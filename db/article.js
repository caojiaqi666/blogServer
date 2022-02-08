const mongoose = require("mongoose")

const Schema = mongoose.Schema

let articleSchema = new Schema({
  //标题
  title: {required: true, type: String},
  //对应的md地址
  src: {required: true, type: String},
  //描述
  des: {required: true, type: String},
  //封面图
  cover: {type: String, default:"/article-public/cover/default.jpg"},
  //作者
  author: {type: Schema.Types.ObjectId, ref: "user"},
  //时间
  time: {type: Number, default: Date.now},
  //浏览量
  pv: {type: Number, default: 0}
})

module.exports = mongoose.model("article", articleSchema)









