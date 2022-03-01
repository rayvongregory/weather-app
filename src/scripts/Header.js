import React, { Component } from "react"
import "../styles/Header.css"

class Header extends Component {
  constructor(props) {
    super(props)
    this.days = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    }

    this.months = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    }

    this.state = {
      day: "",
      date: "",
      year: "",
      time: "",
      btnText: "Change Location",
      visible: false,
    }
    this.getDate = this.getDate.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
  }

  getDate() {
    let t = new Date()
    let utc = t.getTime() + t.getTimezoneOffset()
    let lt = new Date(utc)
    let day = this.days[lt.getDay()]
    let month = this.months[lt.getMonth()]
    let year = lt.getFullYear()
    let date = lt.getDate()
    let time = lt.toLocaleString().split(" ")
    this.setState({
      day,
      date: `${month} ${date}`,
      year,
      time: `${time[1].slice(0, -3)} ${time[2]}`,
    })
  }
  componentDidMount() {
    this.getDate()
  }

  componentDidUpdate() {
    if (!this.state.visible) {
      setTimeout(() => {
        this.setState({ visible: true })
      }, 0)
    }
  }

  handleLocationChange() {
    this.props.handleLocationChange(true)
  }

  render() {
    return (
      <>
        <header className={this.state.visible ? "reveal" : ""}>
          <h1>
            Today is {this.state.day},{" "}
            <span className="nowrap">
              {this.state.date}, {this.state.year}
            </span>
            .
          </h1>
          <h2>
            {this.props.city},{" "}
            <span className="nowrap">{this.props.state}</span>
          </h2>
          <p>
            Last updated: <span className="nowrap">{this.state.time}</span>
          </p>
        </header>
        <button id="change" onClick={this.handleLocationChange}>
          {this.state.btnText}
        </button>
      </>
    )
  }
}

export default Header
