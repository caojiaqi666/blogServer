const express = require("express")
const userDB = require("../../db/user")
const router = express.Router()

//用户名修改
router.post("/name", async (req, res) => {
  let {newName} = req.body
  //检测数据
  if (!newName) {
    return res.send({
      code: 1,
      msg: "参数有误"
    })
  }
  //检测是否登录
  if (!req.session.userInfo) {
    return res.send({
      code: 2,
      msg: "请先登录！"
    })
  }

  try {
    //检测新用户名是否已经存在
    let doc = await userDB.findOne({user: newName})
    if (doc) {
      //存在同名用户，不允许修改成这个名字
      return res.send({
        code: 3,
        msg: "用户名已存在"
      })
    }

    //更新数据
    await userDB.updateOne({_id: req.session.userInfo._id}, {user: newName})

    if (req.session.userInfo) {
      req.session.userInfo.user = newName
    }

    return res.send({
      code: 0,
      msg: "更新成功"
    })

  } catch (e) {
    return res.send({
      code: 4,
      msg: "服务器出错，请稍后再试~"
    })
  }

})

//密码修改
router.post("/pass", async (req, res) => {
  let {_id, oldPass, newPass} = req.body

  let reg = /^[\w\[\]\/\\\-!@#$%^&*()+=|,.<>?:;"'{}]{6,18}$/
  if (!reg.test(oldPass) || !reg.test(newPass)) {
    return res.send({
      code: 1,
      msg: "参数格式错误"
    })
  }

  try {
    //检测原密码是否正确
    let doc = await userDB.findById(_id)
    if (!doc || doc.pass !== oldPass){
      return res.send({
        code: 2,
        msg: "原密码错误"
      })
    }

    //更新密码
    await userDB.updateOne({_id},{pass:newPass})
    return res.send({
      code: 0,
      msg: "更新成功"
    })

  } catch (e) {
    return res.send({
      code: 4,
      msg: "服务器错误"
    })
  }
})

module.exports = router









