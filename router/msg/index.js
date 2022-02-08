const msgDB = require("../../db/message")
const express = require("express")
const router = express.Router()

//留言发表
router.post("/", async (req, res) => {
  let {userId, msg} = req.body

  //检测数据格式
  if (!userId || !msg) {
    return res.send({
      code: 1,
      msg: "参数错误"
    })
  }

  try {
    //存储留言
    await msgDB.create({
      msg,
      user: userId
    })

    return res.send({
      code: 0,
      msg: "留言成功"
    })

  } catch (e) {
    console.log(e);
    return res.send({
      code: 4,
      msg: "服务器错误，请稍后再试~"
    })
  }

})

//留言获取
router.get("/", async (req, res) => {
  let data = await msgDB
    .find({}, {}, {sort: {time: -1}})
    .populate("user", {face: 1, user: 1})
    .populate("children.user", {face: 1, user: 1})
    .populate("children.reply", {face: 1, user: 1})
  res.send({
    code: 0,
    msg: "获取留言成功",
    data
  })
})

//留言回复提交
router.post("/reply", async (req, res) => {
  let {msgId, child} = req.body
  //验证数据
  if (!msgId || !child || !child.msg || !child.user || !child.reply) {
    return res.send({
      code: 1,
      msg: "数据格式错误"
    })
  }

  try {
    //更新数据
    await msgDB.updateOne({_id: msgId}, {
      $push: {children: child}
    })

    return res.send({
      code: 0,
      msg: "回复成功"
    })

  } catch (e) {
    console.log(e);
    res.send({
      code: 4,
      msg: "服务器错误，请稍后再试~"
    })
  }

})

//点赞
router.post("/like", async (req, res) => {
  let {parentId, childId, likes, childIndex} = req.body

  //数据监测
  if (!parentId || !childId || !Array.isArray(likes)){
    return res.send({
      code: 1,
      msg: "参数格式错误"
    })
  }

  //更新父级还是更新子级
  let isChild = parentId !== childId

  try {
    if (isChild){
      //更新子级的likes
      let key = 'children.'+childIndex+'.likes'
      await msgDB.updateOne({"children._id":childId}, {[key]: likes})
    }else{
      //更新父级的likes
      await msgDB.findByIdAndUpdate(parentId, {likes})
    }

    return res.send({
      code: 0,
      msg: "更新完成"
    })
  }catch (e) {
    return res.send({
      code: 4,
      msg: "服务器错误，请稍后再试~"
    })
  }


})

module.exports = router





