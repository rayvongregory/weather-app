import React, { Component } from "react"

class WeatherPanel3 extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate() {
    const panel_3 = document.querySelector(".panel-wrapper:nth-of-type(3)")
    if (!panel_3.classList.contains("reveal")) panel_3.classList.add("reveal")
  }

  render() {
    return (
      <div className="panel-wrapper">
        <div className="panel">
          <span>{this.props.humidity}%</span>
          <span className="nowrap">{this.props.wind_speed} MPH</span>
          <span className="nowrap">{this.props.pressure_inHg} inHg</span>
          <span>Humidity</span>
          <span>Wind Speed</span>
          <span>Pressure</span>
        </div>
      </div>
    )
  }
}

export default WeatherPanel3
