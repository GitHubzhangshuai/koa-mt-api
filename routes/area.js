const router = require('koa-router')()
const {getArea} = require('../controller/area')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/areas')

router.get('/',loginCheck, async function (ctx, next) {
  let listData = await getArea()
  ctx.body = new SuccessModel(listData)
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
