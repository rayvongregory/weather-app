import React, { Component } from "react"

class WeatherPanel1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      icon: "",
    }
  }

  componentDidMount() {
    this.setState({ icon: this.props.icon })
  }

  componentDidUpdate() {
    if (this.state.icon !== this.props.icon) {
      this.setState({ icon: this.props.icon })
      const img = document.querySelector(".panel:first-of-type .grid > img")
      const h3 = document.querySelector(".panel:first-of-type .grid > h3")
      const temps = document.querySelector(".temps-wrapper")
      if (!img.classList.contains("reveal")) {
        img.classList.add("reveal")
        h3.classList.add("reveal")
        temps.classList.add("reveal")
      }
    }
  }

  render() {
    return (
      <div className="panel">
        <div className="grid">
          <h3>
            <span>{this.props.temp}</span>°F
          </h3>
          <img
            src={`/images/weather-icons/icons/${this.state.icon}.png`}
            alt={this.props.description}
          ></img>
          <div className="temps-wrapper">
            <i className="fas fa-arrow-up"></i>
            {this.props.temp_max}°F
            <i className="fas fa-arrow-down"></i>
            {this.props.temp_min}°F
            <svg
              height="32"
              viewBox="0 0 32 32"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m26 30h-4a2.0059 2.0059 0 0 1 -2-2v-7a2.0059 2.0059 0 0 1 -2-2v-6a2.9465 2.9465 0 0 1 3-3h6a2.9465 2.9465 0 0 1 3 3v6a2.0059 2.0059 0 0 1 -2 2v7a2.0059 2.0059 0 0 1 -2 2zm-5-18a.9448.9448 0 0 0 -1 1v6h2v9h4v-9h2v-6a.9448.9448 0 0 0 -1-1z" />
              <path d="m24 9a4 4 0 1 1 4-4 4.0118 4.0118 0 0 1 -4 4zm0-6a2 2 0 1 0 2 2 2.0059 2.0059 0 0 0 -2-2z" />
              <path d="m10 20.1839v-8.1839h-2v8.1839a3 3 0 1 0 2 0z" />
              <path d="m9 30a6.9931 6.9931 0 0 1 -5-11.8892v-11.1108a5 5 0 0 1 10 0v11.1108a6.9931 6.9931 0 0 1 -5 11.8892zm0-26a3.0033 3.0033 0 0 0 -3 3v11.9834l-.332.2983a5 5 0 1 0 6.664 0l-.332-.2983v-11.9834a3.0033 3.0033 0 0 0 -3-3z" />
              <path d="m0 0h32v32h-32z" fill="none" />
            </svg>
            {this.props.feels_like}°F
          </div>
        </div>
      </div>
    )
  }
}

export default WeatherPanel1
