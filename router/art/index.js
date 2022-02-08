const express = require("express")
const router = express.Router()
const articleDB = require("../../db/article")

//获取全部文章列表
router.get("/all", async (req, res) => {
  try {

    let data = await articleDB
      .find({}, {}, {sort: {pv: -1}})

    res.send({
      code: 0,
      msg: "请求成功",
      data
    })

  } catch (e) {
    res.send({
      code: 4
      , data: []
    })
  }
})

//获取单独某篇文章的信息
router.get("/id", async (req, res) => {
  let {id} = req.query

  let data = await articleDB
    .findById(id)
    .populate("author", {user: 1, face: 1})

  //pv +1
  await articleDB.findByIdAndUpdate(id, {$inc: {pv: 1}})

  res.send({
    code: 0,
    msg: "查询成功",
    data
  })
})

//获取三个热门文章id
router.get("/hot", async (req, res) => {
  let data = await articleDB.find({},{title:1},{skip:0,limit:3,sort:{pv:-1}})
  res.send({
    code: 0,
    msg: "热门文章查询成功",
    data
  })
})

module.exports = router









