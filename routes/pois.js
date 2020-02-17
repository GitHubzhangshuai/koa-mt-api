const router = require('koa-router')()
const {getPois} = require('../controller/pois')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/pois')

router.get('/', async function (ctx, next) {
  let listData = await getPois()
  ctx.body = new SuccessModel(listData)
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
