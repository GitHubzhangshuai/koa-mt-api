const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const topsearch = require('./routes/topsearch')
const region = require('./routes/region')
const province = require('./routes/province')
const pois = require('./routes/pois')
const menu = require('./routes/menu')
const city = require('./routes/city')
const area = require('./routes/area')
const category = require('./routes/category')
const index = require('./routes/index')
const blog = require('./routes/blog')
const user = require('./routes/user')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const ENV = process.env.NODE_ENV
if(ENV !== 'production'){
  app.use(morgan('dev'))
}else{
  const logFileName = path.join(__dirname,'logs','access.log')
  const writeStream = fs.createWriteStream(logFileName,{
    flags: 'a'
  })
  app.use(morgan('combined',{
    stream: writeStream
  }))
}

// session 配置
app.keys = ['WJiol#23123_']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: redisStore({
    all: '127.0.0.1:6379'   // 写死本地的 redis
    // all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))


// routes
app.use(topsearch.routes(), topsearch.allowedMethods())
app.use(region.routes(), region.allowedMethods())
app.use(province.routes(), province.allowedMethods())
app.use(pois.routes(), pois.allowedMethods())
app.use(menu.routes(), menu.allowedMethods())
app.use(city.routes(), city.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(area.routes(), area.allowedMethods())
app.use(index.routes(), index.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
