const express = require("express")
const userDB = require("../../db/user")
const visitorDB = require("../../db/visitor")
const router = express.Router()

//登陆
router.post("/", async (req, res) => {
  let {user, pass} = req.body

  //检测数据
  if (!user || !pass) {
    return res.send({
      code: 1,
      msg: "参数有误",
      data: {}
    })
  }

  //验证用户名和密码的匹配
  try {

    let doc = await userDB.findOne({user})

    //没有对应的用户
    if (!doc) {
      return res.send({
        code: 2,
        msg: "用户不存在",
        data: {}
      })
    }

    //用户存在，但是密码不正确
    if (doc.pass !== pass) {
      return res.send({
        code: 3,
        msg: "密码错误",
        data: {}
      })
    }

    //登陆成功
    //添加到最近访客
    let visitorDoc = await visitorDB.findOne({user: doc._id})
    if (visitorDoc) {
      await visitorDB.findOneAndUpdate({user: doc._id},{time: Date.now()})
    }else{
      await visitorDB.create({user: doc._id})
    }

    //更新session
    let userInfo = {
      user: doc.user,
      _id: doc._id,
      face: doc.face,
      admin: doc.admin
    }
    req.session.userInfo = userInfo
    return res.send({
      code: 0,
      msg: "登陆成功",
      data: userInfo
    })

  } catch (e) {
    return res.send({
      code: 4,
      msg: "服务器出错，请稍后再试~",
      data: {}
    })
  }

})

//检测是否登录
router.post("/check", async (req, res) => {
  if (req.session.userInfo) {
    let visitorDoc = await visitorDB.findOne({user: req.session.userInfo._id})
    if (visitorDoc) {
      await visitorDB.findOneAndUpdate({user: req.session.userInfo._id},{time: Date.now()})
    }else{
      await visitorDB.create({user: req.session.userInfo._id})
    }
    //有session信息，登录过了
    return res.send({
      code: 0,
      data: req.session.userInfo
    })
  }
  res.send({
    code: 1,
    data: {}
  })
})

//退出登录
router.post("/logout", (req, res) => {
  //销毁session
  req.session.destroy()

  res.send({
    code: 0,
    msg: "退出登录成功"
  })
})

module.exports = router









