import React, { Component } from "react"

class WeatherPanel3 extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate() {
    const flexwrapper = document.querySelector(".flex-wrapper")
    if (!flexwrapper.classList.contains("reveal")) {
      flexwrapper.classList.add("reveal")
      flexwrapper.nextElementSibling.classList.add("reveal")
      flexwrapper.nextElementSibling.nextElementSibling.classList.add("reveal")
    }
  }

  render() {
    return (
      <div className="panel">
        <div className="flex-wrapper">
          <span>Humidity</span>
          <span>{this.props.humidity}%</span>
        </div>
        <div className="flex-wrapper">
          <span>Wind Speed</span>
          <span className="nowrap">{this.props.wind_speed} MPH</span>
        </div>
        <div className="flex-wrapper">
          <span>Pressure</span>
          <span className="nowrap">{this.props.pressure_inHg} inHg</span>
        </div>
      </div>
    )
  }
}

export default WeatherPanel3
