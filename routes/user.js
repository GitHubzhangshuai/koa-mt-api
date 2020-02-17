const router = require('koa-router')()
const Redis = require('koa-redis')
const nodeMailer = require('nodemailer')
const { login,havRegister,register,deleteUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
const { STMP_CONF } = require('../conf/db')
let Store = new Redis().client
router.prefix('/user')

// 注销登录
router.post('/exit', loginCheck,async function (ctx, next) {
    // 设置 session
    ctx.session.username = ''
    ctx.session.realname = ''
    ctx.body = new SuccessModel('注销成功')
    return
})

// 根据username,passowrd登陆
router.post('/login', async function (ctx, next) {
    const { username, password } = ctx.request.body
    const data = await login(username, password)
    if (data.username) {
        // 设置 session
        ctx.session.username = data.username
        ctx.session.realname = data.realname
        ctx.body = new SuccessModel('登录成功')
        return
    }
    ctx.body = new ErrorModel('登录失败')
})

// 根据username,realname,password,email,code注册用户
router.post('/register',async function(ctx,next){
    const {username,realname,password,email,code} = ctx.request.body
    if (code) {
        const saveCode = await Store.hget(`nodemail:${username}-${email}`, 'code')
        const saveExpire = await Store.hget(`nodemail:${username}-${email}`, 'expire')
        if (code === saveCode) {
          if (new Date().getTime() - saveExpire > 0) {
            ctx.body = new ErrorModel('验证码过期')
            return false
          }
        } else {
          ctx.body = new ErrorModel('验证码错误')
          return
        }
      } else {
        ctx.body = new ErrorModel('请填写验证码')
        return
      }
    if(await havRegister(username,email)){
        ctx.body = new ErrorModel('昵称或邮箱已被注册')
    }else{
        let insertData = await register(username,realname,password,email)
        if(insertData.id){
            ctx.body = new SuccessModel('注册成功')
        }else{
            ctx.body = new ErrorModel('未知的错误')
        }
    }
})

// 根据id或username或者email删除用户
router.post('/delete',async function(ctx,next){
    const {id,username,realname,password,email} = ctx.request.body
    if(await deleteUser(id,username,email)){
        ctx.body = new SuccessModel('删除成功')
    }else{
        ctx.body = new ErrorModel('删除失败')
    }
})

// 根据username和email发送验证码
router.post('/verify', async (ctx, next) => {
    let username = ctx.request.body.username
    let email = ctx.request.body.email
    const saveExpire = await Store.hget(`nodemail:${username}-${email}`, 'expire')
    if (saveExpire && new Date().getTime() - saveExpire < 0) {
      ctx.body = new ErrorModel('验证码请求频繁,稍后再试')
      return false
    }
    let transporter = nodeMailer.createTransport({
      service: 'qq',
      auth: {
        user: STMP_CONF.user,
        pass: STMP_CONF.pass
      }
    })
    let ko = {
      code: STMP_CONF.code(),
      expire: STMP_CONF.expire(),
      email: ctx.request.body.email,
      user: ctx.request.body.username
    }
    let mailOptions = {
      from: `"认证邮件" <${STMP_CONF.user}>`,
      to: ko.email,
      subject: 'xxx注册码',
      html: `您在xxx中注册，您的邀请码是${ko.code}`
    }
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      } else {
        Store.hmset(`nodemail:${ko.user}-${ko.email}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
      }
    })
    ctx.body = {
      code: 0,
      msg: '验证码已发送，可能会有延时，有效期1分钟'
    }
  })


module.exports = router