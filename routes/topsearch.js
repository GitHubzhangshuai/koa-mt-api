const router = require('koa-router')()
const {getTopsearch} = require('../controller/topsearch')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/topsearch')

router.get('/', async function (ctx, next) {
  let listData = await getTopsearch()
  ctx.body = new SuccessModel(listData)
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
