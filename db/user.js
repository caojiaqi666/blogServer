const mongoose = require("mongoose")

let Schema = mongoose.Schema

let userSchema = new Schema({

  //用户名
  user: {type: String, required: true},

  //密码
  pass: {type: String, required: true},

  //头像
  face: {type: String, default: "/faces/default.png"},

  //注册时间
  regTime: {type: Number, default: Date.now},

  //是否管理员
  admin: {type: Boolean, default: false}

})

module.exports = mongoose.model("user", userSchema)








