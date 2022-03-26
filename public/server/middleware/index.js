const http = require("http")
const { StatusCodes } = require("http-status-codes")
const { MongoClient } = require("mongodb")

const getIp = (req, res, next) => {
  http.get({ "host": "api.ipify.org", "port": 80, "path": "/" }, (response) => {
    response.on("data", (ip) => {
      req.body.ip = ip.toString("utf-8")
      next()
    })
  })
}

const getRegionInfoFromIp = (req, res, next) => {
  const { ip } = req.body
  http.get(
    { "host": "ip-api.com", "port": 80, "path": `/json/${ip}` },
    (response) => {
      response.on("data", (data) => {
        const {
          regionName: state,
          city,
          lat,
          lon,
        } = JSON.parse(data.toString("utf-8"))
        assignToReqBody(req.body, { state, city, lat, lon })
        next()
      })
    }
  )
}

const getRegionInfoFromZip = async (req, res, next) => {
  const { zip } = req.params
  const client = new MongoClient(process.env.MONGO_URI)
  await client.connect()
  const municipality = await client
    .db("municipalities_US")
    .collection("municipalities")
    .findOne({
      "zip_code": zip,
    })
  const { state, municipality: city, lat, lon } = municipality
  assignToReqBody(req.body, { state, city, lat, lon })
  next()
}

const assignToReqBody = (req, obj) => {
  Object.assign(req, obj)
}

const getTimeUntil = (currentTime, newTime, event, req) => {
  let varName = `"time_until_${event}": `
  let timePast = currentTime.toTimeString().split(" ")[0]
  let __past = timePast.split(":")
  let hoursPast = Number(__past[0])
  let minutesPast = Number(__past[1])
  let newTime_timeOnly = newTime.slice(0, -3)
  let newTime_timeOnly__ = newTime_timeOnly.split(":")
  let hoursUntil = newTime_timeOnly__[0] - hoursPast
  let minutesUntil = newTime_timeOnly__[1] - minutesPast
  if (minutesUntil < 0) {
    hoursUntil--
    minutesUntil += 60
  }

  if (hoursUntil === 0) {
    if (minutesUntil === 1) {
      assignToReqBody(req, JSON.parse(`{${varName} "1 minute"}`))
    } else {
      assignToReqBody(req, JSON.parse(`{${varName} "${minutesUntil} minutes"}`))
    }
  } else if (hoursUntil === 1) {
    if (minutesUntil === 0) {
      assignToReqBody(req, JSON.parse(`{${varName} "1 hour"}`))
    } else if (minutesUntil === 1) {
      assignToReqBody(req, JSON.parse(`{${varName} "1 hour and 1 minute"}`))
    } else {
      assignToReqBody(
        req,
        JSON.parse(`{${varName} "1 hour and ${minutesUntil} minutes"}`)
      )
    }
  } else {
    if (minutesUntil === 0) {
      assignToReqBody(req, JSON.parse(`{${varName} "${hoursUntil} hours"}`))
    } else if (minutesUntil === 1) {
      assignToReqBody(
        req,
        JSON.parse(`{${varName} "${hoursUntil} hours and 1 minute"}`)
      )
    } else {
      assignToReqBody(
        req,
        JSON.parse(
          `{${varName} "${hoursUntil} hours and ${minutesUntil} minutes"}`
        )
      )
    }
  }
}

const getWeather = (req, res, next) => {
  let { lat, lon } = req.body
  if (!lat && !lon) {
    lat = req.params.lat
    lon = req.params.lon
  }
  http.get(
    {
      "host": "api.openweathermap.org",
      "port": 80,
      "path": `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OW_KEY}&units=imperial`,
    },
    (response) => {
      response.on("data", (data) => {
        const weatherData = JSON.parse(data.toString("utf-8"))
        const { id, description, icon } = weatherData.weather[0]
        let {
          main: { temp, temp_max, temp_min, feels_like, humidity, pressure },
          wind: { speed: windSpeed },
          dt: time_calculated,
          sys: { sunrise, sunset },
          timezone,
        } = weatherData
        let currentTime = new Date()
        currentTime = new Date(
          currentTime.getTime() + currentTime.getTimezoneOffset()
        )
        let currentTime_int = Number(String(currentTime.getTime()).slice(0, -3))
        for (let time of [sunrise, sunset]) {
          let t = new Date(time * 1000)
          let utc = t.getTime() + t.getTimezoneOffset()
          let lt = new Date(utc)
          let newTime = lt.toLocaleString().split(" ")
          let newTime_24 = lt.toTimeString().split(" ")[0]
          newTime = `${newTime[1].slice(0, -3)} ${newTime[2]}`
          if (time === sunrise) {
            let sun_has_risen
            if (currentTime_int >= Number(sunrise)) {
              sun_has_risen = true
            } else {
              sun_has_risen = false
              getTimeUntil(currentTime, newTime_24, "sunrise", req.body)
            }
            assignToReqBody(req.body, {
              sunrise: newTime,
              sun_has_risen,
            })
          } else {
            let sun_has_set
            if (currentTime_int >= Number(sunset)) {
              sun_has_set = true
            } else {
              sun_has_set = false
              getTimeUntil(currentTime, newTime_24, "sunset", req.body)
            }
            assignToReqBody(req.body, {
              sunset: newTime,
              sun_has_set,
            })
          }
        }
        assignToReqBody(req.body, {
          id,
          description,
          icon,
          temp,
          temp_max,
          temp_min,
          feels_like,
          humidity,
          pressure,
          windSpeed,
          time_calculated,
          timezone,
        })
        next()
      })
    }
  )
}

const setImage = (req, res, next) => {
  const {
    id,
    description,
    sun_has_risen,
    sun_has_set,
    time_until_sunrise,
    time_until_sunset,
    windSpeed,
  } = req.body
  let firstNumber = Number(String(id)[0])
  switch (firstNumber) {
    case 2:
      if (!sun_has_risen) {
        assignToReqBody(req.body, { icon: "THUNDERSTORM" })
      } else if (!sun_has_set) {
        assignToReqBody(req.body, { icon: "THUNDERSTORM_DAY" })
      } else {
        assignToReqBody(req.body, { icon: "THUNDERSTORM_NIGHT" })
      }
      break
    case 3:
      if (
        description.startsWith("light") ||
        description.startsWith("drizzle")
      ) {
        if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "LIGHTRAIN" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "MODERATERAIN_DAY" })
        } else {
          assignToReqBody(req.body, { icon: "MODERATERAIN_NIGHT" })
        }
      } else if (description.startsWith("shower")) {
        if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "MODERATERAIN" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "MODERATERAIN_DAY" })
        } else {
          assignToReqBody(req.body, { icon: "MODERATERAIN_NIGHT" })
        }
      } else {
        if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "HEAVYRAIN" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "MODERATERAIN_DAY" })
        } else {
          assignToReqBody(req.body, { icon: "MODERATERAIN_NIGHT" })
        }
      }
      break
    case 5:
      if (
        description.startsWith("light") ||
        description.startsWith("moderate") ||
        description.startsWith("shower")
      ) {
        if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "MODERATERAIN" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "MODERATERAIN_DAY" })
        } else {
          assignToReqBody(req.body, { icon: "MODERATERAIN_NIGHT" })
        }
      } else if (description.startsWith("freezing")) {
        assignToReqBody(req.body, { icon: "HAIL" })
      } else {
        if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "HEAVYRAIN" })
        } else {
          assignToReqBody(req.body, { icon: "MODERATERAIN_NIGHT" })
        }
      }
      break
    case 6:
      if (description.startsWith("light")) {
        assignToReqBody(req.body, { icon: "HAIL" })
      } else {
        if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "SNOW" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "SNOW_DAY" })
        } else {
          assignToReqBody(req.body, { icon: "SNOW_NIGHT" })
        }
      }
      break
    case 7:
      if (id === 701) {
        assignToReqBody(req.body, { icon: "LIGHTRAIN" })
      } else if (id === 731 || id === 751 || id === 761) {
        if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "SAND" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "SAND_DAY" })
        } else {
          assignToReqBody(req.body, { icon: "SAND_NIGHT" })
        }
      } else if (id === 711 || id === 721 || id === 741 || id === 762) {
        if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "FOGGY" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "FOGGY_DAY" })
        } else {
          assignToReqBody(req.body, { icon: "FOGGY_NIGHT" })
        }
      } else if (id === 771) {
        assignToReqBody(req.body, { icon: "CLOUDY_WINDY" })
      } else {
        assignToReqBody(req.body, { icon: "TORNADO" })
      }
      break
    default:
      if (id === 800) {
        if (!sun_has_risen && !time_until_sunrise.includes("hour")) {
          assignToReqBody(req.body, { icon: "SUNRISE" })
        } else if (!sun_has_risen || sun_has_set) {
          assignToReqBody(req.body, { icon: "CLEAR_NIGHT" })
        } else if (!sun_has_set && !time_until_sunset.includes("hour")) {
          assignToReqBody(req.body, { icon: "SUNSET" })
        } else {
          assignToReqBody(req.body, { icon: "CLEAR_DAY" })
        }
      } else if (id < 803) {
        if (!sun_has_risen && windSpeed <= 15) {
          assignToReqBody(req.body, { icon: "CLOUDY" })
        } else if (!sun_has_risen) {
          assignToReqBody(req.body, { icon: "CLOUDY_WINDY" })
        } else if (!sun_has_set && windSpeed <= 15) {
          assignToReqBody(req.body, { icon: "PARTLYCLOUDY_DAY" })
        } else if (!sun_has_set) {
          assignToReqBody(req.body, { icon: "PARTLYCLOUDY_DAY_WINDY" })
        } else if (sun_has_set && windSpeed <= 15) {
          assignToReqBody(req.body, { icon: "PARTLYCLOUDY_NIGHT" })
        } else {
          assignToReqBody(req.body, { icon: "PARTLYCLOUDY_NIGHT_WINDY" })
        }
      } else {
        if (windSpeed <= 15) {
          assignToReqBody(req.body, { icon: "CLOUDY" })
        } else {
          assignToReqBody(req.body, { icon: "CLOUDY_WINDY" })
        }
      }
      break
  }
  next()
}

const returnWeather = (req, res, next) => {
  let {
    city,
    state,
    description,
    feels_like,
    temp,
    temp_max,
    temp_min,
    icon,
    humidity,
    windSpeed,
    time_calculated,
    pressure,
    sunrise,
    sunset,
    sun_has_risen,
    sun_has_set,
    time_until_sunrise,
    time_until_sunset,
    timezone,
  } = req.body
  res.status(StatusCodes.OK).json({
    city,
    state,
    description,
    feels_like: Math.floor(feels_like),
    temp: Math.floor(temp),
    temp_max: Math.floor(temp_max),
    temp_min: Math.floor(temp_min),
    icon,
    humidity,
    wind_speed: windSpeed,
    time_calculated,
    pressure_hPa: pressure,
    pressure_inHg: Math.round(pressure * 0.029529983071445),
    sunrise,
    sunset,
    sun_has_risen,
    sun_has_set,
    time_until_sunrise,
    time_until_sunset,
    timezone,
  })
}

module.exports = {
  getIp,
  getRegionInfoFromIp,
  getRegionInfoFromZip,
  getWeather,
  setImage,
  returnWeather,
}
