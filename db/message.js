const mongoose = require("mongoose")

const Schema = mongoose.Schema

let messageSchema = new Schema({
  //内容
  msg: {type: String, required: true},

  //评论的时间
  time: {type: Number, default: Date.now},

  //留言者的id
  user: {type: Schema.Types.ObjectId, ref: "user"},

  //点赞
  likes: [
    {type: Schema.Types.ObjectId}
  ],

  //子评论
  children: [
    {
      msg: String,
      user: {type: Schema.Types.ObjectId, ref:"user"},
      reply: {type: Schema.Types.ObjectId, ref:"user"},
      likes: [
        {type: Schema.Types.ObjectId}
      ],
      time: {type: Number, default: Date.now},
    }
  ]
})

module.exports = mongoose.model("message", messageSchema)









