const router = require('koa-router')()
const {getCategory} = require('../controller/category')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/category')

router.get('/', async function (ctx, next) {
  let listData = await getCategory()
  ctx.body = new SuccessModel(listData)
})

module.exports = router
