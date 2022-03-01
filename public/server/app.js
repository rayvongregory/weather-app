require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3001
const initRouter = require("./routes/initRouter")
const changeLocationRouter = require("./routes/changeLocationRouter")

app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use("/", initRouter)
app.use("/change-location", changeLocationRouter)

app.listen(PORT, async () => {
  try {
  } catch (err) {
    console.log(err)
  }
  console.log(`Server listening on ${PORT}`)
})
