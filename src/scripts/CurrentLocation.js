import Header from "../scripts/Header"
import Weather from "../scripts/Weather"

const CurrentLocation = (props) => {
  const { currentLocation } = props

  // will need to update this when new location is set
  return (
    <>
      <Header
        city={currentLocation.city}
        state={currentLocation.state}
        handleLocationChange={props.handleLocationChange}
      />
      <Weather
        description={currentLocation.description}
        feels_like={currentLocation.feels_like}
        temp={currentLocation.temp}
        temp_max={currentLocation.temp_max}
        temp_min={currentLocation.temp_min}
        icon={currentLocation.icon}
        sunrise={currentLocation.sunrise}
        sunset={currentLocation.sunset}
        sun_has_risen={currentLocation.sun_has_risen}
        sun_has_set={currentLocation.sun_has_set}
        time_until_sunrise={currentLocation.time_until_sunrise}
        time_until_sunset={currentLocation.time_until_sunset}
        humidity={currentLocation.humidity}
        wind_speed={currentLocation.wind_speed}
        time_calculated={currentLocation.time_calculated}
        pressure_hPa={currentLocation.pressure_hPa}
        pressure_inHg={currentLocation.pressure_inHg}
      />
    </>
  )
}

export default CurrentLocation
