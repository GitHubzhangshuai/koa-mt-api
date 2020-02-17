const router = require('koa-router')()
const {getMenu} = require('../controller/menu')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/menu')

router.get('/', async function (ctx, next) {
  let listData = await getMenu()
  ctx.body = new SuccessModel(listData)
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
