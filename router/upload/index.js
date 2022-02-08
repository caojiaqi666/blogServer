const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const userDB = require("../../db/user")


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/faces"))
  },
  filename: function (req, file, cb) {
    let typeIndex = [
      "image/gif", "image/jpeg", "image/png"
    ].indexOf(file.mimetype)

    if (typeIndex === -1) {
      cb(new Error("文件格式不正确"))
      return
    }
    let ext = [".gif", ".jpg", ".png"][typeIndex]
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})

let upload = multer({storage}).single('avatar')

//头像上传
router.post("/face", async (req, res) => {

  //先判断是否登录
  if (!req.session.userInfo){
    return res.send({
      code: 1,
      msg: "请先登录"
    })
  }

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.send({
        code: 1,
        msg: "A Multer error occurred when uploading."
      })
    } else if (err) {
      return res.send({
        code: 2,
        msg: "An unknown error occurred when uploading."
      })
    }

    try {
      //没有错误，上传完成
      let _id = req.session.userInfo._id
      //修改数据库
      let face = '/faces/'+req.file.filename
      await userDB.updateOne({_id},{face})
      //修改session
      req.session.userInfo.face = face

      return res.send({
        code: 0,
        msg: "头像上传成功"
      })
    }catch (e) {
      console.log(e);
      return res.send({
        code: 4,
        msg: "服务器错误，请稍后再试"
      })
    }

  })
})


module.exports = router









