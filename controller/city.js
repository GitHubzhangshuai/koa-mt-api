const xss = require('xss')
const { exec } = require('../db/mysql')

const getCity = async () => {
    let sql = `select c_v_o.province as province,c_v_o.name as name,c_v_o.idText as id,c.idText as parentId 
    from cities as c 
    inner join cities_value as c_v inner join cities_value_object as c_v_o 
    where c_v.parent_fk = c.ID and c_v.Object_fk = c_v_o.ID `
    let result =  await exec(sql)
    let newData = []
    result.forEach(el => {
        let index = newData.findIndex(item => item.id === el.parentId)
        if(index === -1){
            newData.push({
                id: el.parentId,
                value: [{
                    province: el.province,
                    name: el.name,
                    id: el.id
                }]
            })
        }else{
            newData[index].value.push({
                province: el.province,
                name: el.name,
                id: el.id
            })
        }
    })
    return newData
}



module.exports = {
    getCity
}