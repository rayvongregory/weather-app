const express = require("express")
const router = express.Router()
const {
  getIp,
  getRegionInfoFromIp,
  // getRegionInfoFromZip,
  getWeather,
  setImage,
  returnWeather,
} = require("../middleware/index")

router
  .route("/")
  .get(getIp, getRegionInfoFromIp, getWeather, setImage, returnWeather)
router.route("/lat/:lat/lon/:lon").get(getWeather, setImage, returnWeather)

module.exports = router
