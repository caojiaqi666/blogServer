const mongoose = require("mongoose")

const Schema = mongoose.Schema

let linkSchema = new Schema({
  src: String,
  icon: String,
  name: String,
  des: String
})

module.exports = mongoose.model("link", linkSchema)







