const express = require("express")
const visitorDB = require("../../db/visitor")
const router = express.Router()

//获取最近访客信息
router.get("/", async (req, res) => {
  try{
    let data = await visitorDB.find({},{},{skip:0,limit:12,sort:{time:-1}})
      .populate("user",{user:1,face:1})
    return res.send({
      code: 0,
      msg: "请求成功",
      data
    })
  }catch (e) {
    return res.send({
      code: 0,
      msg: "服务器出错，请稍后再试~",
      data: []
    })
  }
})

module.exports = router








