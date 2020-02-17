const xss = require('xss')
const { exec } = require('../db/mysql')

const getTopsearch = async () => {
    let sql = `select * from topsearches `
    let result =  await exec(sql)
    return result
}



module.exports = {
    getTopsearch
}