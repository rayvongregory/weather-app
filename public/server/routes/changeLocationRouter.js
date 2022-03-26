const express = require("express")
const router = express.Router()
const {
  getCountriesStartingWith___,
  getFirstLvlDivisionType,
  getFirstLvlDivision,
  getSecondLvlDivisionType,
  getSecondLvlDivision,
  getThirdLvlDivisionType,
} = require("../../server/controllers/mySQL")

router.route("/:country_name").get(getCountriesStartingWith___)
router.route("/:country_name/fldt").get(getFirstLvlDivisionType) //! can't find a good way to get this to happen at the same time as the above function
router.route("/:country_name/:fldn").get(getFirstLvlDivision)
router.route("/:country_name/sldt/:flsid").get(getSecondLvlDivisionType) //! this functionality should happen at the same time as the below function
router.route("/:country_name/:fldid/:sldn").get(getSecondLvlDivision)
router.route("/:country_name/tldt/:flsid").get(getThirdLvlDivisionType) //! this functionality should happen at the same time as the above function
module.exports = router
