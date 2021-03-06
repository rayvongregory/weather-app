import React, { Component } from "react"

class WeatherPanel2 extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate() {
    const info = document.querySelector(".info")
    const sunP = document.querySelector("p.reveal")
    // if (!info.classList.contains("reveal")) {
    //   info.classList.add("reveal")
    //   info.nextElementSibling.classList.add("reveal")
    // }
    const panel_2 = document.querySelector(".panel-wrapper:nth-of-type(2)")
    if (!panel_2.classList.contains("reveal")) panel_2.classList.add("reveal")
    return
    if (sunP) return
    if (!this.props.sun_has_risen || !this.props.sun_has_set) {
      const grid = info.parentElement
      if (!this.props.sun_has_risen) {
        let hoursToSunrise = Number(this.props.time_until_sunrise.split(" ")[0])
        if (
          (this.props.time_until_sunrise.includes("hour") &&
            hoursToSunrise < 3) ||
          !this.props.time_until_sunrise.includes("hour")
        ) {
          let p = document.createElement("p")
          p.innerHTML = `The sun will rise in <span class="nowrap">${this.props.time_until_sunrise}.</span>`
          grid.classList.add("more-space")
          grid.parentElement.appendChild(p)
          setTimeout(() => {
            p.classList.add("reveal")
          }, 0)
        }
      } else if (!this.props.sun_has_set) {
        let hoursToSunset = Number(this.props.time_until_sunset.split(" ")[0])
        if (
          (this.props.time_until_sunset.includes("hour") &&
            hoursToSunset < 3) ||
          !this.props.time_until_sunset.includes("hour")
        ) {
          if (grid.classList.contains("more-space")) {
            let p = grid.parentElement.querySelector("p")
            p.innerHTML = `The sun will set in <span class="nowrap">${this.props.time_until_sunset}.</span>`
          } else {
            let p = document.createElement("p")
            p.innerHTML = `The sun will set in <span class="nowrap">${this.props.time_until_sunset}.</span>`
            grid.classList.add("more-space")
            grid.parentElement.appendChild(p)
            setTimeout(() => {
              p.classList.add("reveal")
            }, 0)
          }
        }
      }
    }
  }

  render() {
    return (
      <div className="panel-wrapper">
        <div className="panel">
          <img
            src="/images/weather-icons/icons/SUNRISE.png"
            alt="sunrise"
          ></img>
          <img src="/images/weather-icons/icons/SUNSET.png" alt="sunset"></img>
          <span>{this.props.sunrise}</span>
          <span>{this.props.sunset}</span>
          <div className="sunrise_set">
            <span>SUNRISE</span>
            <span>SUNSET</span>
          </div>
        </div>
      </div>
    )
  }
}

export default WeatherPanel2
