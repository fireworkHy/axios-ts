const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

// express路由管理
const router = express.Router()

// 简单处理favicon.ico 请求的报错过滤
router.get('favicon.ico', () => {})

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello， simple/get request`
  })
})

router.get('/base/get', function(req, res) {
  res.json(req.query)
})

router.post('/base/post', function(req, res) {
  console.log('response.body: ', req.body)
  res.json(req.body)
})

router.post('/base/buffer', (req, res) => {
  const msg = []
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    const buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.post('/base/response', (req, res) => {
  console.log('response.body: ', req.body)
  res.json(req.body)
})

router.post('/base/response-type', (req, res) => {
  res.json(req.body)
})

router.get('/hhh', (req, res) => {
  res.json(req.query)
})

app.use(router)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
