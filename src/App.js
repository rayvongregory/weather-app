import axios from "axios"
import { useState, useEffect, useCallback } from "react"
import ChangeLocation from "./scripts/ChangeLocation"
import CurrentLocation from "./scripts/CurrentLocation"

const CURRENT_LOCATION = {
  city: "",
  state: "",
  description: "",
  feels_like: "",
  temp: "",
  temp_max: "",
  temp_min: "",
  icon: "",
  humidity: "",
  wind_speed: "",
  time_calculated: "",
  pressure_hPa: "",
  pressure_inHg: "",
  sun_has_risen: false,
  sun_has_set: false,
  sunrise: "",
  sunset: "",
  time_until_sunrise: "",
  time_until_sunset: "",
}

const NEW_LOCATION = {
  country_name: "",
  country_code: "",
  db_country_name: "",
  firstLvlDiv: "",
  secondLvlDiv: "",
  thirdLvlDiv: "",
  firstLvlDivType: "",
  secondLvlDivType: "",
  thirdLvlDivType: "",
  fourthLvlDivType: "",
  first_level_subdivision_id: "",
  first_level_subdivision_type_id: "",
  second_level_subdivision_id: "",
  second_level_subdivision_type_id: "",
  second_level_subdivision_type_name: "",
  third_level_subdivision_id: "",
  third_level_subdivision_type_id: "",
  fourth_level_subdivision_id: "",
  fourth_level_subdivision_type_id: "",
  lat: "",
  lon: "",
}

const DATA_COLLECTION_INFO = [
  { placeholder: "Country", id: "country", url: "/change-location/" },
]

// convert this to a function component using hooks

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(CURRENT_LOCATION)
  const [changingLocation, setChangingLocation] = useState(false)
  const [newLocation, setNewLocation] = useState(NEW_LOCATION)
  const [dataCollectionInfo, setDataCollectionInfo] =
    useState(DATA_COLLECTION_INFO)
  const [newLocationName, setNewLocationName] = useState()

  const getNewLocationWeather = useCallback((lat, lon, locationName) => {
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios.get(`/lat/${lat}/lon/${lon}`).then((response) => {
      setNewLocationName(locationName)
      const confirmOrEdit = document.createElement("p")
      const confirmBtn = document.createElement("button")
      confirmBtn.innerText = `Click here to see the weather in ${locationName}`
      confirmBtn.addEventListener("pointerup", () => {
        handleLocationChange(false)
        setCurrentLocation(Object.assign({ city: locationName }, response.data))
      })
      confirmOrEdit.appendChild(confirmBtn)
      confirmOrEdit.insertAdjacentText("beforeend", " or continue editing.")
      document.querySelector(".change-location-form").appendChild(confirmOrEdit)
    })
  }, [])

  useEffect(() => {
    //!gets the current location's info
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios.get("/").then((response) => {
      console.log(response.data)
      setCurrentLocation(response.data)
    })
  }, [])

  useEffect(() => {
    //! gets first level division type
    const country_name = newLocation.country_name
    const db_country_name = newLocation.db_country_name
    if (!country_name) return
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios
      .get(`/change-location/${db_country_name}/fldt`)
      .then((response) => {
        const { type } = response.data
        setNewLocation((prev) => {
          return { ...prev, firstLvlDivType: type }
        })
        setDataCollectionInfo((prev) => {
          return [
            ...prev,
            {
              placeholder: type,
              id: "first_level_subdivision",
              url: `/change-location/${db_country_name}/`,
            },
          ]
        })
      })
      .catch((err) => {
        console.log("no data for this location")
        console.log(err.response.data)
      })
  }, [
    getNewLocationWeather,
    newLocation.country_name,
    newLocation.db_country_name,
  ])

  useEffect(() => {
    //! gets the second level division type
    //check for lat lon and first
    //if all exist AND second does not exist, getNewWeather
    const firstLvlDiv = newLocation.firstLvlDiv
    const secondLvlDiv = newLocation.secondLvlDiv
    if (!firstLvlDiv || secondLvlDiv) return
    const lat = newLocation.lat
    const lon = newLocation.lon
    const thirdLvlDiv = newLocation.thirdLvlDiv
    if (lat && lon && firstLvlDiv && !secondLvlDiv) {
      return getNewLocationWeather(lat, lon, firstLvlDiv)
    }
    if (lat && lon && firstLvlDiv && secondLvlDiv && !thirdLvlDiv) {
      return getNewLocationWeather(lat, lon, secondLvlDiv)
    }
    const db_country_name = newLocation.db_country_name
    const first_level_subdivision_id = newLocation.first_level_subdivision_id
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios
      .get(
        `/change-location/${db_country_name}/sldt/${first_level_subdivision_id}`
      )
      .then((response) => {
        const { type } = response.data
        setNewLocation((prev) => {
          return {
            ...prev,
            secondLvlDivType: type,
          }
        })
        setDataCollectionInfo((prev) => {
          return [
            ...prev,
            {
              placeholder: type,
              id: "second_level_subdivision",
              url: `/change-location/${db_country_name}/${first_level_subdivision_id}/`,
            },
          ]
        })
      })
      .catch((err) => {
        console.log("no data for this location")
        console.log(err)
      })
  }, [
    getNewLocationWeather,
    newLocation.db_country_name,
    newLocation.firstLvlDiv,
    newLocation.secondLvlDiv,
    newLocation.first_level_subdivision_id,
    newLocation.lat,
    newLocation.lon,
    newLocation.thirdLvlDiv,
  ])

  useEffect(() => {
    const lat = newLocation.lat
    const lon = newLocation.lon
    const secondLvlDiv = newLocation.secondLvlDiv
    if (lat && lon && secondLvlDiv) {
      return getNewLocationWeather(lat, lon, secondLvlDiv)
    }
    // getThirdLvlDivisionType
    if (!secondLvlDiv) return
    const db_country_name = newLocation.db_country_name
    const second_level_subdivision_id = newLocation.second_level_subdivision_id
    console.log("getting thirdLvlDivisionType")
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios
      .get(
        `/change-location/${db_country_name}/tldt/${second_level_subdivision_id}/`
      )
      .then((response) => {
        const { type } = response.data
        console.log(type)
        setNewLocation((prev) => {
          return {
            ...prev,
            thirdLvlDivType: type,
          }
        })
        setDataCollectionInfo((prev) => {
          return [...prev].push({
            placeholder: type,
            id: "third_level_subdivision",
            url: `/change-location/${db_country_name
              .toLowerCase()
              .replaceAll(" ", "_")}/${
              newLocation.first_level_subdivision_id
            }/${newLocation.second_level_subdivision_id}`,
          })
        })
      })
      .catch((err) => {
        console.log("no data for this location")
        console.log(err.response.data)
      })
  }, [
    getNewLocationWeather,
    newLocation.db_country_name,
    newLocation.first_level_subdivision_id,
    newLocation.lat,
    newLocation.lon,
    newLocation.secondLvlDiv,
    newLocation.secondLvlDivType,
    newLocation.second_level_subdivision_id,
  ])

  const handleLocationChange = (bool = true) => {
    switch (bool) {
      case true:
        setChangingLocation(bool)
        break
      default:
        setChangingLocation(bool)
        const countryInput = document.querySelector("input")
        const p = document.querySelector(".change-location-form p")
        countryInput.value = ""
        countryInput.removeAttribute("disabled")
        countryInput.parentElement.classList.remove("float")
        countryInput.nextElementSibling.classList.remove("exit")
        if (countryInput.nextElementSibling.nextElementSibling) {
          countryInput.nextElementSibling.nextElementSibling.remove()
        }
        if (p) p.remove()
        setDataCollectionInfo([
          { placeholder: "Country", id: "country", url: "/change-location/" },
        ])
        setNewLocation({
          country_name: "",
          country_code: "",
          firstLvlDiv: "",
          secondLvlDiv: "",
          thirdLvlDiv: "",
          firstLvlDivType: "",
          secondLvlDivType: "",
          thirdLvlDivType: "",
          first_level_subdivision_id: "",
          first_level_subdivision_type_id: "",
        })
        break
    }
  }

  return (
    <div className="bg">
      <CurrentLocation
        currentLocation={currentLocation}
        handleLocationChange={handleLocationChange}
      />
      <ChangeLocation
        changingLocation={changingLocation}
        handleLocationChange={handleLocationChange}
        dataCollectionInfo={dataCollectionInfo}
        setNewLocation={setNewLocation}
      />
    </div>
  )
}

export default App
