const express = require("express")

const router = express.Router()

//登陆路由
router.use("/login",require("./login/index"))

//注册路由
router.use("/reg", require("./register/index"))

//更新路由
router.use("/update", require("./update/index"))

//上传路由
router.use("/upload", require("./upload/index"))

//留言路由
router.use("/msg", require("./msg/index"))

//访客路由
router.use("/visit", require("./visit/index"))

//文章路由
router.use("/art", require("./art/index"))

//友链路由
router.use("/links", require("./links/index"))

//管理员路由
router.use("/admin", require("./admin/index"))


module.exports = router









