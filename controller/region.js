const xss = require('xss')
const { exec } = require('../db/mysql')

const getRegion = async () => {
    let sql = `select * from regions `
    let result =  await exec(sql)
    return result
}



module.exports = {
    getRegion
}