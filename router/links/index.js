const express = require("express")
const router = express.Router()
const linkDB = require("../../db/link")

//返回所有友链
router.get("/", async (req, res) => {
  let data = await linkDB.find()

  res.send({
    code: 0,
    msg: "请求成功",
    data
  })
})


module.exports = router









