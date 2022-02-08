const mongoose = require("mongoose")

let Schema = mongoose.Schema

let visitorSchema = new Schema({
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  time: {
    type: Number,
    default: Date.now
  }
})

module.exports = mongoose.model("visitor", visitorSchema)








