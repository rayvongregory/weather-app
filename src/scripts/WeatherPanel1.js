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
      const panel_1 = document.querySelector(".panel-wrapper:first-of-type")
      if (!panel_1.classList.contains("reveal")) {
        panel_1.classList.add("reveal")
      }
    }
  }

  render() {
    return (
      <div className="panel-wrapper">
        <div className="panel">
          <p>
            {this.props.temp}
            <button onClick={this.convertTemps}>°F</button>
          </p>
          <img
            src={`/images/weather-icons/icons/${this.state.icon}.png`}
            alt={this.props.description}
          ></img>
          <p>{this.props.description}</p>
        </div>
        <div className="temps-wrapper">
          <div className="temps">
            <span>{this.props.temp_max}°F</span>
            <span>{this.props.temp_min}°F</span>
            <span>{this.props.feels_like}°F</span>
            <span>MAX TEMP</span>
            <span>MIN TEMP</span>
            <span>FEELS LIKE</span>
          </div>
        </div>
      </div>
    )
  }
}

export default WeatherPanel1
