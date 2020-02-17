const router = require('koa-router')()
const {getCity} = require('../controller/city')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/city')

router.get('/', async function (ctx, next) {
  let listData = await getCity()
  ctx.body = new SuccessModel(listData)
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
