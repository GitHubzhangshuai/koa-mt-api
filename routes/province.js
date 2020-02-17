const router = require('koa-router')()
const {getProvince} = require('../controller/province')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/province')

router.get('/', async function (ctx, next) {
  let listData = await getProvince()
  ctx.body = new SuccessModel(listData)
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
