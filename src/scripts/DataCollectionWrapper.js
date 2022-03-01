import React, { Component } from "react"
import axios from "axios"

class DataCollectionWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: "0",
    }
    this.subs = {
      a: "[AÀÁÂÃÄaàáâãä]",
      e: "[EÈÉÊËeèéêë]",
      i: "[IÌÍîÏiìíîï]",
      o: "[OÒÓÔÕÖoòóôõö]",
      u: "[UÙÚÛÜuùúûü]",
      n: "[NÑnñ]",
      y: "[YÝŸyýÿ]",
    }
    this.clearInput = this.clearInput.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleLoseFocus = this.handleLoseFocus.bind(this)
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
      const { results } = response.data
      // console.log(results)
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
            this.addFirstLevelDivisions(inputWrapper, results, value)
            break
          case "2":
            this.addSecondLevelDivisions(inputWrapper, results, value)
            break
          default:
            break
        }
      }
    })
  }

  addCountries(wrapper, results, queryString) {
    let list = wrapper.querySelector("ul")
    if (list) {
      list.replaceChildren()
    } else {
      list = document.createElement("ul")
    }
    const matchThis = queryString
      .replaceAll(/a/gi, this.subs["a"])
      .replaceAll(/e/gi, this.subs["e"])
      .replaceAll(/i/gi, this.subs["i"])
      .replaceAll(/o/gi, this.subs["o"])
      .replaceAll(/u/gi, this.subs["u"])
      .replaceAll(/n/gi, this.subs["n"])
      .replaceAll(/y/gi, this.subs["y"])
    for (let country of results) {
      let li = document.createElement("li")
      let { country_name, country_code } = country
      let regex = new RegExp(matchThis, "gi")
      let match = country_name.match(regex)[0]
      let matchSpan = document.createElement("strong")
      matchSpan.innerText = match
      country_name = country_name.replace(match, matchSpan.outerHTML.toString())
      li.dataset.country_code = country_code
      li.innerHTML = country_name
      li.addEventListener("pointerup", this.handleCountrySearch)
      list.appendChild(li)
    }
    wrapper.insertAdjacentElement("beforeend", list)
  }

  addFirstLevelDivisions(wrapper, results, queryString) {
    let list = wrapper.querySelector("ul")
    if (list) {
      list.replaceChildren()
    } else {
      list = document.createElement("ul")
    }
    const matchThis = queryString
      .replaceAll(/a/gi, this.subs["a"])
      .replaceAll(/e/gi, this.subs["e"])
      .replaceAll(/i/gi, this.subs["i"])
      .replaceAll(/o/gi, this.subs["o"])
      .replaceAll(/u/gi, this.subs["u"])
      .replaceAll(/n/gi, this.subs["n"])
      .replaceAll(/y/gi, this.subs["y"])
    for (let division of results) {
      let li = document.createElement("li")
      let {
        first_level_subdivision_name,
        first_level_subdivision_id,
        first_level_subdivision_type_id,
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
      li.innerHTML = first_level_subdivision_name
      li.addEventListener("pointerup", this.handleFirstLvlSearch)
      list.appendChild(li)
    }
    wrapper.insertAdjacentElement("beforeend", list)
  }

  addSecondLevelDivisions(wrapper, results, queryString) {
    let list = wrapper.querySelector("ul")
    if (list) {
      list.replaceChildren()
    } else {
      list = document.createElement("ul")
    }
    const matchThis = queryString
      .replaceAll(/a/gi, this.subs["a"])
      .replaceAll(/e/gi, this.subs["e"])
      .replaceAll(/i/gi, this.subs["i"])
      .replaceAll(/o/gi, this.subs["o"])
      .replaceAll(/u/gi, this.subs["u"])
      .replaceAll(/n/gi, this.subs["n"])
      .replaceAll(/y/gi, this.subs["y"])
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
      li.innerHTML = second_level_subdivision_name
      li.addEventListener("pointerup", this.handleSecondLvlSearch)
      list.appendChild(li)
    }
    wrapper.insertAdjacentElement("beforeend", list)
  }

  handleCountrySearch(e) {
    const { target } = e
    const { parentElement: ul } = target
    const { parentElement: wrapper } = ul
    const input = wrapper.querySelector("input")
    const clearBtn = wrapper.querySelector(".clear")
    input.value = target.innerText
    input.setAttribute("disabled", "disabled")
    ul.remove()
    clearBtn.classList.add("exit")
    this.props.returnData([{ country_name: target.innerText }, target.dataset])
  }

  handleFirstLvlSearch(e) {
    const { target } = e
    const { parentElement: ul } = target
    const { parentElement: wrapper } = ul
    const input = wrapper.querySelector("input")
    const clearBtn = wrapper.querySelector(".clear")
    input.value = target.innerText
    input.setAttribute("disabled", "disabled")
    ul.remove()
    clearBtn.classList.add("exit")
    this.props.returnData([{ firstLvlDiv: target.innerText }, target.dataset])
  }

  handleSecondLvlSearch(e) {}

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
          <i className="fas fa-times"></i>
        </button>
      </div>
    )
  }
}

export default DataCollectionWrapper
