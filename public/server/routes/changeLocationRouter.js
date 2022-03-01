const express = require("express")
const router = express.Router()
const {
  connectToMySQL,
  getCountriesStartingWith___,
  getFirstLvlDivisionType,
  getFirstLvlDivision,
  getSecondLvlDivisionType,
  getSecondLvlDivision,
} = require("../../server/controllers/mySQL")

router.route("/:country_name").get(connectToMySQL, getCountriesStartingWith___)
router.route("/:country_name/fldt").get(connectToMySQL, getFirstLvlDivisionType)
router.route("/:country_name/:fldn").get(connectToMySQL, getFirstLvlDivision)
router
  .route("/:country_name/sldt/:flsid")
  .get(connectToMySQL, getSecondLvlDivisionType)
router
  .route("/:country_name/:fldid/:sldn")
  .get(connectToMySQL, getSecondLvlDivision)
module.exports = router
