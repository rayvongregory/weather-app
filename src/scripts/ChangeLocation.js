import React, { Component } from "react"
import axios from "axios"
import DataCollectionWrapper from "./DataCollectionWrapper"
import "../styles/ChangeLocation.css"

class ChangeLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.subs = {
      a: "[AÀÁÂÃÄaàáâãä]",
      e: "[EÈÉÊËeèéêë]",
      i: "[IÌÍîÏiìíîï]",
      o: "[OÒÓÔÕÖoòóôõö]",
      u: "[UÙÚÛÜuùúûü]",
      n: "[NÑnñ]",
      y: "[YÝŸyýÿ]",
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleChangingInput = this.handleChangingInput.bind(this)
    this.addCountries = this.addCountries.bind(this)
    this.returnToCurrentLocation = this.returnToCurrentLocation.bind(this)
  }

  componentDidUpdate() {
    if (!this.state.visible) {
      setTimeout(() => {
        this.setState({ visible: true })
      }, 0)
    }
  }

  returnToCurrentLocation() {
    this.props.handleLocationChange(false)
  }

  handleChangingInput(e) {
    const { value } = e.target
    if (!value.trim()) {
      let countriesList = document.querySelector("#pick-country ul")
      if (countriesList) {
        countriesList.replaceChildren()
      }
      return
    }
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios.get(`/change-location/c/${value}`).then((response) => {
      const { results } = response.data
      if (!results) {
        let countriesList = document.querySelector("#pick-country  ul")
        if (countriesList) {
          countriesList.replaceChildren()
        }
      } else {
        this.addCountries(results, value)
      }
    })
  }

  addCountries(countries, queryString) {
    let pickCountry = document.getElementById("pick-country")
    let countriesList = document.querySelector("#pick-country ul")
    if (countriesList) {
      countriesList.replaceChildren()
    } else {
      countriesList = document.createElement("ul")
    }
    const matchThis = queryString
      .replaceAll(/a/gi, this.subs["a"])
      .replaceAll(/e/gi, this.subs["e"])
      .replaceAll(/i/gi, this.subs["i"])
      .replaceAll(/o/gi, this.subs["o"])
      .replaceAll(/u/gi, this.subs["u"])
      .replaceAll(/n/gi, this.subs["n"])
      .replaceAll(/y/gi, this.subs["y"])
    for (let country of countries) {
      let li = document.createElement("li")
      let { country_name, country_code } = country
      let regex = new RegExp(matchThis, "gi")
      let match = country_name.match(regex)
      let matchSpan = document.createElement("strong")
      matchSpan.innerText = match
      country_name = country_name.replace(match, matchSpan.outerHTML.toString())
      li.dataset.country_code = country_code
      li.innerHTML = country_name
      li.addEventListener("pointerup", this.handleSearch)
      countriesList.appendChild(li)
    }
    pickCountry.insertAdjacentElement("beforeend", countriesList)
  }

  handleSearch(e) {
    const { target } = e
    const { parentElement: ul } = target
    const { parentElement: wrapper } = ul
    const input = wrapper.querySelector("input")
    const clearBtn = wrapper.querySelector(".clear")
    input.value = target.innerText
    input.setAttribute("disabled", "disabled")
    ul.remove()
    clearBtn.classList.add("exit")
    this.setState({ country_code: target.dataset.country_code })
  }

  render() {
    return (
      <div
        className="change-location-layer"
        show={`${this.props.changingLocation}`}
      >
        <div className="change-location-form">
          {this.props.dataCollectionInfo.map((el, i) => {
            return (
              <DataCollectionWrapper
                key={i} // to satisy react
                id={el.id}
                placeholder={el.placeholder}
                url={el.url}
                setNewLocation={this.props.setNewLocation}
              />
            )
          })}
        </div>
        <button id="back" onClick={this.returnToCurrentLocation}>
          Back to current location
        </button>
      </div>
    )
  }
}

export default ChangeLocation
