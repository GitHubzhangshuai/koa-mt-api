const xss = require('xss')
const { exec } = require('../db/mysql')

const getProvince = async () => {
    let sql = `select * from provinces `
    let result =  await exec(sql)
    return result
}



module.exports = {
    getProvince
}