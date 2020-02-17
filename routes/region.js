const router = require('koa-router')()
const {getRegion} = require('../controller/region')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/region')

router.get('/', async function (ctx, next) {
  let listData = await getRegion()
  ctx.body = new SuccessModel(listData)
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
