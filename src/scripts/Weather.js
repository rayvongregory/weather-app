import React, { Component } from "react"
import WeatherPanel1 from "../scripts/WeatherPanel1"
import WeatherPanel2 from "../scripts/WeatherPanel2"
import WeatherPanel3 from "../scripts/WeatherPanel3"
import "../styles/Weather.css"
import "../styles/WeatherPanel.css"

class Weather extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // console.log("component updated", this.props)
  componentDidUpdate(prevProps, prevState) {
    Object.entries(this.props).forEach(
      ([key, val]) =>
        prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    )
    if (this.state) {
      Object.entries(this.state).forEach(
        ([key, val]) =>
          prevState[key] !== val && console.log(`State '${key}' changed`)
      )
    }
  }

  render() {
    return (
      <div className="weather">
        <WeatherPanel1
          icon={this.props.icon}
          description={this.props.description}
          temp={this.props.temp}
          feels_like={this.props.feels_like}
          temp_max={this.props.temp_max}
          temp_min={this.props.temp_min}
        />
        <WeatherPanel2
          sunrise={this.props.sunrise}
          sunset={this.props.sunset}
          sun_has_risen={this.props.sun_has_risen}
          sun_has_set={this.props.sun_has_set}
          time_until_sunrise={this.props.time_until_sunrise}
          time_until_sunset={this.props.time_until_sunset}
        />
        <WeatherPanel3
          humidity={this.props.humidity}
          pressure_hPa={this.props.pressure_hPa}
          pressure_inHg={this.props.pressure_inHg}
          wind_speed={this.props.wind_speed}
        />
      </div>
    )
  }
}

export default Weather
