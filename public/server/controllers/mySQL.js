require("dotenv").config()
const { StatusCodes } = require("http-status-codes")
const mysql = require("mysql2/promise")
const bluebird = require("bluebird")

const connection = mysql.createPool({
  host: "localhost",
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: "countries",
  Promise: bluebird,
  connectionLimit: 10,
})

const latLonFound = (result) => {
  return result.lat ? true : false
}

const getCountriesStartingWith___ = async (req, res) => {
  const { country_name } = req.params
  const like = `"%${country_name}%"`
  var results
  try {
    var [results] = await connection.execute(
      "SELECT country_name, db_country_name, country_code FROM `countries`.`country_names` WHERE `country_name` LIKE " +
        like +
        "LIMIT 5"
    )
  } catch (e) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No data found for this location" })
  }
  if (results.length === 0) {
    return res.status(StatusCodes.OK).json({
      msg: `Could not find countries containing the string "${country_name}".`,
    })
  }
  res.status(StatusCodes.OK).json({
    msg: `Here are the countries containing the string "${country_name}".`,
    results,
  })
}

const getFirstLvlDivisionType = async (req, res) => {
  const { country_name } = req.params
  let db_country_name = country_name.toLowerCase().replaceAll(" ", "_")
  var results
  try {
    var [results] = await connection.execute(
      "SELECT DISTINCT first_level_subdivision_type_name FROM " +
        db_country_name +
        ".`first_level_subdivision_types`"
    )
  } catch (e) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No data found for this location" })
  }
  if (results.length === 0) {
    return res.status(StatusCodes.OK).json({
      msg: `Could not find first level division type for "${country_name}".`,
    })
  }
  results = results.map((res) => {
    return res.first_level_subdivision_type_name
  })
  if (results.length === 1) {
    results = results[0]
  } else if (results.length === 2) {
    results = results.join(" or ")
  } else {
    results = results.join(", ")
    let lastComma = results.lastIndexOf(",")
    results =
      results.slice(0, lastComma) + ", or" + results.slice(lastComma + 1)
  }
  res.status(StatusCodes.OK).json({
    msg: `Here is/are the first level division type/types for "${country_name}".`,
    type: results,
  })
}

const getFirstLvlDivision = async (req, res) => {
  let { country_name, fldn } = req.params
  fldn = `"%${fldn}%"`
  var results
  try {
    var [results] = await connection.execute(
      "SELECT * FROM " +
        country_name +
        ".`first_level_subdivisions` WHERE `first_level_subdivision_name` LIKE " +
        fldn +
        "LIMIT 5"
    )
  } catch (e) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No data found for this location" })
  }
  if (results.length === 0) {
    return res.status(StatusCodes.OK).json({
      msg: `Could not find first level divisions for ${country_name} containing "${fldn}".`,
    })
  } else {
    return res.status(StatusCodes.OK).json({
      msg: `Here are the first level divisions for ${country_name} containing "${fldn}".`,
      results,
      latLonFound: latLonFound(results[0]),
    })
  }
}

const getSecondLvlDivisionType = async (req, res) => {
  const { country_name, flsid } = req.params
  let secondLevelDivisionTypes = []
  let db_country_name = country_name.toLowerCase().replaceAll(" ", "_")
  var results
  try {
    var [results] = await connection.execute(
      "SELECT DISTINCT second_level_subdivision_type_id FROM " +
        db_country_name +
        ".`second_level_subdivisions` WHERE first_level_subdivision_id=" +
        flsid
    )
  } catch (e) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No data found for this location" })
  }
  if (!results) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Something went wrong.` })
  }
  if (results.length === 0) {
    return res.status(StatusCodes.OK).json({
      msg: `Could not find second level division type(s) for "${country_name}".`,
    })
  }

  for (let result of results) {
    const { second_level_subdivision_type_id } = result
    let [type] = await connection.execute(
      "SELECT second_level_subdivision_type_name FROM " +
        db_country_name +
        ".`second_level_subdivision_types` WHERE second_level_subdivision_type_id=" +
        second_level_subdivision_type_id
    )
    if (!type) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Something went wrong" })
    }
    secondLevelDivisionTypes.push(type[0].second_level_subdivision_type_name)
  }
  let typeString
  if (secondLevelDivisionTypes.length === 1) {
    typeString = secondLevelDivisionTypes[0]
  } else if (secondLevelDivisionTypes.length === 2) {
    typeString = secondLevelDivisionTypes.join(" or ")
  } else {
    typeString = secondLevelDivisionTypes.join(", ")
    let lastComma = secondLevelDivisionTypes.lastIndexOf(",")
    typeString =
      typeString.slice(0, lastComma) + ", or" + typeString.slice(lastComma + 1)
  }
  res.status(StatusCodes.OK).json({
    msg: `Here is/are the second level division type/types for "${country_name}".`,
    type: typeString,
  })
}

const getSecondLvlDivision = async (req, res) => {
  let { country_name, fldid, sldn } = req.params
  sldn = `"%${sldn}%"`
  var results
  try {
    var [results] = await connection.execute(
      "SELECT * FROM " +
        country_name +
        ".`second_level_subdivisions` WHERE `second_level_subdivision_name` LIKE " +
        sldn +
        "AND first_level_subdivision_id=" +
        fldid +
        " LIMIT 5"
    )
  } catch (e) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No data found for this location" })
  }

  if (results.length === 0) {
    return res.status(StatusCodes.OK).json({
      msg: `Could not find second level divisions for ${country_name}, firstLvlId:${fldid} containing "${sldn}".`,
    })
  } else {
    return res.status(StatusCodes.OK).json({
      msg: `Here are the second level divisions for ${country_name}, firstLvlId:${fldid} containing "${sldn}".`,
      results,
      latLonFound: latLonFound(results[0]),
    })
  }
}

const getThirdLvlDivisionType = async (req, res) => {
  console.log("getting third level")
  res.status(200)
}

module.exports = {
  getCountriesStartingWith___,
  getFirstLvlDivisionType,
  getFirstLvlDivision,
  getSecondLvlDivisionType,
  getSecondLvlDivision,
  getThirdLvlDivisionType,
}
