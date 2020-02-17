const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
    username = escape(username)

    // 生成加密密码
    password = genPassword(password)
    password = escape(password)

    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    // console.log('sql is', sql)

    const rows = await exec(sql)
    return rows[0] || {}
}

const register = async(username,realname,password,email) => {
    password = genPassword(password)
    password = escape(password)
    username = escape(username)
    realname = escape(realname)
    console.log(email)
    email = escape(email)
    console.log(email)
    const sql = `insert into users (username,realname,password,email) values (${username},${realname},${password},${email})`
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const havRegister = async(username,email) => {
    username = escape(username)
    email = escape(email)
    const sql = `select * from users where username = ${username} or email = ${email}`
    const rows = await exec(sql)
    console.log(rows)
    if(rows.length>0){
        return true
    }else{
        return false
    }
}

const deleteUser = async(id,username,email) => {
    let sql = `delete from users where 1 = 1 `
    if(id){
        id = escape(id)
        sql += `and id=${id}`
    }
    if(username){
        username = escape(username)
        sql += `and username = ${username}`
    }
    if(email){
        email = escape(email)
        sql += `and email = ${email}`
    }
    const rows = await exec(sql)
    if(rows.affectedRows>0){
        return true
    }else{
        return false
    }
}

module.exports = {
    login,
    register,
    havRegister,
    deleteUser
}