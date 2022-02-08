const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const articleDB = require("../../db/article")
const linkDB = require("../../db/link")

//md上传配置
let mdStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/article-public/md"))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\.md$/, `-${Date.now()}.md`))
  }
})
let mdUpload = multer({storage: mdStorage}).single('md')

//鉴定权限
router.post("/", (req, res) => {
  if (!req.session.userInfo || !req.session.userInfo.admin) {
    return res.send({
      code: 1,
      msg: "请先以管理员账号登录"
    })
  }

  res.send({
    code: 0,
    msg: "管理登录成功"
  })

})

//md上传
router.post("/md", async (req, res) => {
  mdUpload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
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
      return res.send({
        code: 0,
        msg: "上传成功",
        mdSrc: `/article-public/md/${req.file.filename}`
      })
    } catch (e) {
      console.log(e);
      return res.send({
        code: 4,
        msg: "服务器错误，请稍后再试"
      })
    }

  })
})

//文章发表
router.post("/article", async (req, res) => {
  //先看是不是管理员
  if (!req.session.userInfo || !req.session.userInfo.admin) {
    return res.send({
      code: 1,
      msg: "请先以管理员账号登录"
    })
  }

  const {title, des, src} = req.body

  try {
    //创建对应文章
    let result = await articleDB.create({
      title, des, src, author: req.session.userInfo._id
    })
    console.log(result);
    res.send({
      code: 0,
      msg: "发表成功",
      _id: result._id
    })
  } catch (e) {

  }
})

//获取文章列表
router.post("/getArticle", async (req, res) => {
  let data = await articleDB
    .find({}, {author: 0}, {sort: {time: -1}})

  res.send({
    code: 0,
    msg: "请求成功",
    data
  })
})

//删除文章
router.delete("/article", async (req, res) => {
  //先看是不是管理员
  if (!req.session.userInfo || !req.session.userInfo.admin) {
    return res.send({
      code: 1,
      msg: "请先以管理员账号登录"
    })
  }

  let {_id} = req.body

  await articleDB.findByIdAndDelete(_id)

  res.send({
    code: 0,
    msg: "删除成功"
  })

})

//添加友链
router.post("/addLink", async (req, res) => {
  //先看是不是管理员
  if (!req.session.userInfo || !req.session.userInfo.admin) {
    return res.send({
      code: 1,
      msg: "请先以管理员账号登录"
    })
  }

  let {src, icon, name, des} = req.body

  if (!src || !icon || !name || !des) {
    return res.send({
      code: 1,
      msg: "参数缺失"
    })
  }

  //有没有添加过
  let doc = await linkDB.findOne({src})

  if (doc) {
    //说明已经添加过了，这次要更新内容
    await linkDB.findOneAndUpdate({src}, {icon, name, des})
    return res.send({
      code: 0,
      msg: "友链已存在，更新信息完成。"
    })
  }

  await linkDB.create({
    src, icon, name, des
  })

  res.send({
    code: 0,
    msg: "添加友链成功"
  })
})

//删除友链
router.delete("/link", async (req, res) => {
  //先看是不是管理员
  if (!req.session.userInfo || !req.session.userInfo.admin) {
    return res.send({
      code: 1,
      msg: "请先以管理员账号登录"
    })
  }

  let {_id} = req.body

  await linkDB.findByIdAndDelete(_id)

  res.send({
    code: 0,
    msg: "删除成功"
  })

})


//导出
module.exports = router









