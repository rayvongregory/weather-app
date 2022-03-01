import React, { Component } from "react"

class WeatherPanel2 extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate() {
    const info = document.querySelector(".info")
    const sunP = document.querySelector("p.reveal")
    if (!info.classList.contains("reveal")) {
      info.classList.add("reveal")
      info.nextElementSibling.classList.add("reveal")
    }
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
      <div className="panel">
        <div className="grid">
          <div className="info">
            <img
              src="/images/weather-icons/icons/SUNRISE.png"
              alt="sunrise"
            ></img>
            {this.props.sunrise}
          </div>
          <div className="info">
            <img
              src="/images/weather-icons/icons/SUNSET.png"
              alt="sunset"
            ></img>
            {this.props.sunset}
          </div>
        </div>
      </div>
    )
  }
}

export default WeatherPanel2
