const xss = require('xss')
const { exec } = require('../db/mysql')

const getPois = async () => {
    let sql = `select * from pois `
    let result =  await exec(sql)
    return result
}



module.exports = {
    getPois
}