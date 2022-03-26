import React, { Component } from "react"
import axios from "axios"

class DataCollectionWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: "0",
    }
    this.clearInput = this.clearInput.bind(this)
    this.editInput = this.editInput.bind(this)
    this.disableInput = this.disableInput.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleLoseFocus = this.handleLoseFocus.bind(this)
    this.betterMatch = this.betterMatch.bind(this)
    this.checkForList = this.checkForList.bind(this)
    this.addToList = this.addToList.bind(this)
    this.handleCountrySearch = this.handleCountrySearch.bind(this)
    this.handleFirstLvlSearch = this.handleFirstLvlSearch.bind(this)
    this.handleSecondLvlSearch = this.handleSecondLvlSearch.bind(this)
    this.handleChangingInput = this.handleChangingInput.bind(this)
    this.addCountries = this.addCountries.bind(this)
    this.addFirstLevelDivisions = this.addFirstLevelDivisions.bind(this)
    this.addSecondLevelDivisions = this.addSecondLevelDivisions.bind(this)
  }

  componentDidMount() {
    this.setState({ key: this._reactInternals.key })
  }

  componentDidUpdate() {
    if (!this.state.visible) {
      setTimeout(() => {
        this.setState({ visible: true })
      }, 0)
    }
  }

  clearInput(e) {
    const { previousElementSibling } = e.target
    previousElementSibling.value = ""
    this.handleChangingInput(e)
    this.handleLoseFocus(e)
  }

  editInput(e) {
    console.log("clicked edit btn")
  }

  handleFocus(e) {
    const { parentElement } = e.target
    if (!parentElement.classList.contains("float")) {
      parentElement.classList.add("float")
    }
  }

  handleLoseFocus(e) {
    const { parentElement, value } = e.target
    if (!value.trim()) {
      parentElement.classList.remove("float")
    }
  }

  handleChangingInput(e) {
    const { target } = e
    const { value, parentElement: inputWrapper } = target
    if (!value.trim()) {
      let list = inputWrapper.querySelector("ul")
      if (list) {
        list.replaceChildren()
      }
      return
    }
    axios.defaults.baseURL =
      window.location.protocol + "//" + window.location.hostname + ":" + 3001
    axios.get(`${this.props.url}${value}`).then((response) => {
      const { results, latLonFound } = response.data
      if (!results) {
        let list = inputWrapper.querySelector("ul")
        if (list) {
          list.replaceChildren()
        }
      } else {
        switch (this.state.key) {
          case "0":
            this.addCountries(inputWrapper, results, value)
            break
          case "1":
            this.addFirstLevelDivisions(
              inputWrapper,
              results,
              value,
              latLonFound
            )
            break
          case "2":
            this.addSecondLevelDivisions(
              inputWrapper,
              results,
              value,
              latLonFound
            )
            break
          default:
            break
        }
      }
    })
  }

  addCountries(wrapper, results, queryString) {
    let list = this.checkForList(wrapper)
    const matchThis = this.betterMatch(queryString)
    for (let country of results) {
      let li = document.createElement("li")
      let { country_name, db_country_name, country_code } = country
      let regex = new RegExp(matchThis, "gi")
      let match = country_name.match(regex)[0]
      let matchSpan = document.createElement("strong")
      matchSpan.innerText = match
      country_name = country_name.replace(match, matchSpan.outerHTML.toString())
      li.dataset.db_country_name = db_country_name
      li.dataset.country_code = country_code
      this.addToList(li, country_name, this.handleCountrySearch, list)
    }
    wrapper.insertAdjacentElement("beforeend", list)
  }

  betterMatch(string) {
    const subs = {
      a: "[AÀÁÂÃÄaàáâãä]",
      e: "[EÈÉÊËeèéêë]",
      i: "[IÌÍîÏiìíîï]",
      o: "[OÒÓÔÕÖoòóôõö]",
      u: "[UÙÚÛÜuùúûü]",
      n: "[NÑnñ]",
      y: "[YÝŸyýÿ]",
    }
    return string
      .replaceAll(/a/gi, subs["a"])
      .replaceAll(/e/gi, subs["e"])
      .replaceAll(/i/gi, subs["i"])
      .replaceAll(/o/gi, subs["o"])
      .replaceAll(/u/gi, subs["u"])
      .replaceAll(/n/gi, subs["n"])
      .replaceAll(/y/gi, subs["y"])
  }

  checkForList(wrapper) {
    let list = wrapper.querySelector("ul")
    if (list) {
      list.replaceChildren()
    } else {
      list = document.createElement("ul")
    }
    return list
  }

  addToList(li, text, fn, list) {
    li.innerHTML = text
    li.addEventListener("pointerup", fn)
    list.appendChild(li)
  }

  addFirstLevelDivisions(wrapper, results, queryString, latLonFound) {
    let list = this.checkForList(wrapper)
    const matchThis = this.betterMatch(queryString)
    for (let division of results) {
      let li = document.createElement("li")
      let {
        first_level_subdivision_name,
        first_level_subdivision_id,
        first_level_subdivision_type_id,
        // second_level_subdivision_type_id,
        // second_level_subdivision_type_name,
      } = division
      let regex = new RegExp(matchThis, "gi")
      let match = first_level_subdivision_name.match(regex)[0]
      let matchSpan = document.createElement("strong")
      matchSpan.innerText = match
      first_level_subdivision_name = first_level_subdivision_name.replace(
        match,
        matchSpan.outerHTML.toString()
      )
      li.dataset.first_level_subdivision_id = first_level_subdivision_id
      li.dataset.first_level_subdivision_type_id =
        first_level_subdivision_type_id
      // li.dataset.second_level_subdivision_type_id =
      // second_level_subdivision_type_id
      // li.dataset.second_level_subdivision_type_name =
      // second_level_subdivision_type_name
      if (latLonFound) {
        li.dataset.lat = division.lat
        li.dataset.lon = division.lon
      }
      this.addToList(
        li,
        first_level_subdivision_name,
        this.handleFirstLvlSearch,
        list
      )
    }
    wrapper.insertAdjacentElement("beforeend", list)
  }

  addSecondLevelDivisions(wrapper, results, queryString, latLonFound) {
    let list = this.checkForList(wrapper)
    const matchThis = this.betterMatch(queryString)
    for (let division of results) {
      let li = document.createElement("li")
      let {
        second_level_subdivision_name,
        second_level_subdivision_id,
        second_level_subdivision_type_id,
      } = division
      let regex = new RegExp(matchThis, "gi")
      let match = second_level_subdivision_name.match(regex)[0]
      let matchSpan = document.createElement("strong")
      matchSpan.innerText = match
      second_level_subdivision_name = second_level_subdivision_name.replace(
        match,
        matchSpan.outerHTML.toString()
      )
      li.dataset.second_level_subdivision_id = second_level_subdivision_id
      li.dataset.second_level_subdivision_type_id =
        second_level_subdivision_type_id
      if (latLonFound) {
        li.dataset.lat = division.lat
        li.dataset.lon = division.lon
      }
      this.addToList(
        li,
        second_level_subdivision_name,
        this.handleSecondLvlSearch,
        list
      )
    }
    wrapper.insertAdjacentElement("beforeend", list)
  }

  disableInput(e) {
    const { target } = e
    const { parentElement: ul } = target
    const { parentElement: wrapper } = ul
    const input = wrapper.querySelector("input")
    const clearBtn = wrapper.querySelector(".clear")
    input.value = target.innerText
    input.setAttribute("disabled", "disabled")
    ul.remove()
    clearBtn.classList.add("exit")
    const editBtn = document.createElement("button")
    editBtn.classList.add("edit")
    editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`
    editBtn.addEventListener("pointerup", this.editInput)
    wrapper.appendChild(editBtn)
    setTimeout(() => {
      editBtn.classList.add("enter")
    }, 300)
    return target
  }

  handleCountrySearch(e) {
    const target = this.disableInput(e)
    const { innerText } = target
    const { db_country_name, country_code } = target.dataset
    this.props.setNewLocation((prev) => {
      return {
        ...prev,
        country_name: innerText,
        db_country_name,
        country_code,
      }
    })
  }

  handleFirstLvlSearch(e) {
    const target = this.disableInput(e)
    const { innerText } = target
    const {
      first_level_subdivision_id,
      first_level_subdivision_type_id,
      lat,
      lon,
    } = target.dataset
    this.props.setNewLocation((prev) => {
      return {
        ...prev,
        firstLvlDiv: innerText,
        first_level_subdivision_id,
        first_level_subdivision_type_id,
        lat,
        lon,
      }
    })
  }

  handleSecondLvlSearch(e) {
    const target = this.disableInput(e)
    const { lat, lon } = target.dataset
    this.props.setNewLocation((prev) => {
      return {
        ...prev,
        secondLvlDiv: target.innerText,
        second_level_subdivision_id: target.dataset.second_level_subdivision_id,
        second_level_subdivision_type_id:
          target.dataset.second_level_subdivision_type_id,
        lat,
        lon,
      }
    })
  }

  render() {
    return (
      <div className="input-wrapper" data-placeholder={this.props.placeholder}>
        <input
          id={`${this.props.id}-input`}
          type="text"
          autoComplete="off"
          onInput={this.handleChangingInput}
          onFocus={this.handleFocus}
          onBlur={this.handleLoseFocus}
        ></input>
        <button className="clear" onClick={this.clearInput}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    )
  }
}

export default DataCollectionWrapper
