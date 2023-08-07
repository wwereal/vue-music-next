const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const csrf = require('xsrf')
const registerRouter = require('./router')

const port = process.env.PORT || 9002

const app = express()

// 创建一个csrfProtection中间件实例，用于CSRF保护，其中包括启用cookie支持、忽略HEAD和OPTIONS请求、检查路径以/api开头。
// https://c6yy63r5qj.feishu.cn/docx/doxcnPrOupqcd6Uaykpg22B1pBf#doxcn04Uau8QuM6qcgnvgxDSqaf
const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['HEAD', 'OPTIONS'],
  checkPathReg: /^\/api/
})

app.use(cookieParser()) // 使用cookie-parser中间件解析cookie
app.use(csrfProtection) // 使用csrfProtection中间件进行CSRF保护

// 当访问根路径'/'时，将一个名为'XSRF-TOKEN'的cookie设置为当前请求的CSRF令牌，并将请求传递给下一个中间件。
app.get('/', function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken()) // 将CSRF令牌设置为'XSRF-TOKEN'的cookie
  return next()
})

registerRouter(app) // 注册自定义路由模块

app.use(compression()) // 使用compression中间件对响应数据进行压缩

app.use(express.static('./dist')) // 提供静态文件服务

// 处理CSRF令牌错误的中间件
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next()
  }

  // 在此处处理CSRF令牌错误
  res.status(403)
  res.send('')
})

// 启动服务并监听指定端口
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('正在 Listening at http://localhost:' + port + '\n')
})
