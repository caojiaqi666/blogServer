const mongoose = require("mongoose")

mongoose
  .connect("mongodb://localhost:27017/flyBlog",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(()=>{console.log("数据库连接成功")})
  .catch(()=>{console.log("数据库连接失败")})









