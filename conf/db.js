const env = process.env.NODE_ENV  // 环境参数

// 配置
let MYSQL_CONF
let REDIS_CONF
let STMP_CONF

if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456789',
        port: '3306',
        database: 'mt'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }

    STMP_CONF = {
        get host(){
          return 'smtp.qq.com'
        },
        get user(){
          return '1802528291@qq.com'
        },
        get pass(){
          return 'skxjfnvjkhgecdgf'
        },
        get code(){
          return ()=>{
            return Math.random().toString(16).slice(2,6).toUpperCase()
          }
        },
        get expire(){
          return ()=>{
            return new Date().getTime()+60*60*1000
          }
        }
      }
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456789',
        port: '3306',
        database: 'my'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}
  

module.exports = {
    MYSQL_CONF,
    REDIS_CONF,
    STMP_CONF
}