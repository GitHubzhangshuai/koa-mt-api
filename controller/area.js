const xss = require('xss')
const { exec } = require('../db/mysql')

const getArea = async () => {
    let sql = `select a_v_o.city as city,a_v_o.name as name,a_v_o.idText as id,a.idText as parentId from areas as a inner join areas_value as a_v inner join areas_value_object as a_v_o where a_v.parent_fk = a.ID and a_v.Object_fk = a_v_o.ID `
    let result =  await exec(sql)
    let newData = []
    result.forEach(el => {
        let index = newData.findIndex(item => item.id === el.parentId)
        if(index === -1){
            newData.push({
                id: el.parentId,
                value: [{
                    city: el.city,
                    name: el.name,
                    id: el.id
                }]
            })
        }else{
            newData[index].value.push({
                city: el.city,
                name: el.name,
                id: el.id
            })
        }
    })
    return newData
}



module.exports = {
    getArea
}