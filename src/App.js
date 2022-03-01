import axios from "axios"
import React, { Component } from "react"
import Header from "./scripts/Header"
import Weather from "./scripts/Weather"
import ChangeLocation from "./scripts/ChangeLocation"

class App extends Component {
  constructor() {
    super()
    this.state = {
      changing_location: false,
      data_collection_info: [
        { placeholder: "Country", id: "country", url: "/change-location/" },
      ],
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
    this.getRegionInfo = this.getRegionInfo.bind(this)
    this.getFirstLvlDivisionType = this.getFirstLvlDivisionType.bind(this)
    this.getSecondLvlDivisionType = this.getSecondLvlDivisionType.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.returnData = this.returnData.bind(this)
  }

  componentDidMount() {
    this.getRegionInfo()
  }

  componentDidUpdate(prevProps, prevState) {
    switch (true) {
      case this.state.country_code !== prevState.country_code:
        this.getFirstLvlDivisionType()
        break
      case this.state.firstLvlDiv !== prevState.firstLvlDiv:
        this.getSecondLvlDivisionType()
        break
      default:
        break
    }
  }

  getFirstLvlDivisionType() {
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios
      .get(`/change-location/${this.state.country_name}/fldt`)
      .then((response) => {
        const { type } = response.data
        this.setState({
          firstLvlDivType: type,
          data_collection_info: [
            { placeholder: "Country", id: "country", url: "/change-location/" },
            {
              placeholder: type,
              id: "first_level_subdivision",
              url: `/change-location/${this.state.country_name
                .toLowerCase()
                .replaceAll(" ", "_")}/`,
            },
          ],
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getSecondLvlDivisionType() {
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios
      .get(
        `/change-location/${this.state.country_name}/sldt/${this.state.first_level_subdivision_id}`
      )
      .then((response) => {
        const { type } = response.data
        console.log(type)
        const { firstLvlDivType } = this.state
        this.setState({
          secondLvlDivType: type,
          data_collection_info: [
            { placeholder: "Country", id: "country", url: "/change-location/" },
            {
              placeholder: firstLvlDivType,
              id: "first_level_subdivision",
              url: `/change-location/${this.state.country_name
                .toLowerCase()
                .replaceAll(" ", "_")}/`,
            },
            {
              placeholder: type,
              id: "second_level_subdivision",
              url: `/change-location/${this.state.country_name
                .toLowerCase()
                .replaceAll(" ", "_")}/${
                this.state.first_level_subdivision_id
              }/`,
            },
          ],
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  returnData(vals) {
    let obj = {}
    vals.forEach((val) => {
      Object.assign(obj, val)
    })
    this.setState(obj)
    setTimeout(() => {}, 0)
  }

  getRegionInfo() {
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios.get("/").then((response) => {
      console.log(response.data)
      this.setState(response.data)
    })
  }

  handleLocationChange(bool = true) {
    switch (bool) {
      case true:
        this.setState({ changing_location: bool })
        break
      default:
        this.setState({
          changing_location: bool,
          data_collection_info: [
            { placeholder: "Country", id: "country", url: "/change-location/" },
          ],
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
    setTimeout(() => {
      console.log(this.state)
    }, 0)
  }

  render() {
    return (
      <div className="bg">
        <Header
          city={this.state.city}
          state={this.state.state}
          handleLocationChange={this.handleLocationChange}
        />
        <Weather
          description={this.state.description}
          feels_like={this.state.feels_like}
          temp={this.state.temp}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          icon={this.state.icon}
          sunrise={this.state.sunrise}
          sunset={this.state.sunset}
          sun_has_risen={this.state.sun_has_risen}
          sun_has_set={this.state.sun_has_set}
          time_until_sunrise={this.state.time_until_sunrise}
          time_until_sunset={this.state.time_until_sunset}
          humidity={this.state.humidity}
          wind_speed={this.state.wind_speed}
          time_calculated={this.state.time_calculated}
          pressure_hPa={this.state.pressure_hPa}
          pressure_inHg={this.state.pressure_inHg}
        />
        <ChangeLocation
          changing_location={this.state.changing_location}
          handleLocationChange={this.handleLocationChange}
          data_collection_info={this.state.data_collection_info}
          returnData={this.returnData}
        />
      </div>
    )
  }
}

export default App
