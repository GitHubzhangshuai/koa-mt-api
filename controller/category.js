const xss = require('xss')
const { exec } = require('../db/mysql')

// 优化后的，7个表联查改成了两个4表联查，最后返回数据依然是336.09k，不过时间从21.65s变成了228ms
const getCategory = async () => {
    let sql1 = `select distinct c_t_o_m.String as t_item, c_t_o.type as t_type,c.city as city
    from category as c  
    inner join category_types as c_t 
    inner join category_types_object as c_t_o
    inner join category_types_object_module as c_t_o_m
    where 
    c.ID = c_t.parent_fk and c_t.Object_fk = c_t_o.ID and c_t.Object_fk = c_t_o_m.parent_fk 
    `
    let sql2 = `select distinct c_a_o_m.String as a_item, c_a_o.type as a_type,c.city as city
    from category as c  
    inner join category_areas as c_a 
    inner join category_areas_object as c_a_o
    inner join category_areas_object_module as c_a_o_m
    where 
    c.ID = c_a.parent_fk and c_a.Object_fk = c_a_o.ID and c_a.Object_fk = c_a_o_m.parent_fk 
    `
    let result1 =  await exec(sql1)
    let result2 =  await exec(sql2)
    let newData = []
    result1.forEach(el => {
        let index = newData.findIndex(item => item.city === el.city)
        if(index === -1){
            newData.push({
                city: el.city,
                types: [{
                    type: el.t_type,
                    module: [el.t_item]
                }],
                areas:[]
            })
        }else{
            var index1 = newData[index].types.findIndex(item => item.type === el.t_type)
            if(index1 === -1){
                newData[index].types.push({type:el.t_type,module: [el.t_item]})
            }else{
                if(newData[index].types[index1].module.findIndex(e => e===el.t_item)=== -1){
                    newData[index].types[index1].module.push(el.t_item)
                }
            }
        }
    })
    result2.forEach(el => {
        let index = newData.findIndex(item => item.city === el.city)
        if(index === -1){
            newData.push({
                city: el.city,
                types: [],
                areas:[{
                    type: el.a_type,
                    module: [el.a_item]
                }]
            })
        }else{
            var index2 = newData[index].areas.findIndex(item => item.type === el.a_type)
            if(index2 === -1){
                newData[index].areas.push({type: el.a_type,module:[el.a_item]})
            }else{
                if(newData[index].areas[index2].module.findIndex(e => e===el.a_item)=== -1){
                    newData[index].areas[index2].module.push(el.a_item)
                }
            }
        }
    })
    return newData
}

// 7个表联查由于交叉积会查出123万行，查出大量没有意义的组合，超过50M，筛选后只有300k，不过处理时间超过了20s
// const getCategory = async () => {
//     let sql = `select distinct c_a_o_m.String as a_item, c_a_o.type as a_type,c_t_o_m.String as t_item, c_t_o.type as t_type,c.city as city
//     from category as c  
//     inner join category_areas as c_a 
//     inner join category_areas_object as c_a_o
//     inner join category_areas_object_module as c_a_o_m
//     inner join category_types as c_t 
//     inner join category_types_object as c_t_o
//     inner join category_types_object_module as c_t_o_m
//     where 
//     c.ID = c_a.parent_fk and c_a.Object_fk = c_a_o.ID and c_a.Object_fk = c_a_o_m.parent_fk 
//     and c.ID = c_t.parent_fk and c_t.Object_fk = c_t_o.ID and c_t.Object_fk = c_t_o_m.parent_fk 
//     `
//     let result =  await exec(sql)
//     let newData = []
//     result.forEach(el => {
//         let index = newData.findIndex(item => item.city === el.city)
//         if(index === -1){
//             newData.push({
//                 city: el.city,
//                 types: [{
//                     type: el.t_type,
//                     module: [el.t_item]
//                 }],
//                 areas:[{
//                     type: el.a_type,
//                     module: [el.a_item]
//                 }]
//             })
//         }else{
//             var index1 = newData[index].types.findIndex(item => item.type === el.t_type)
//             if(index1 === -1){
//                 newData[index].types.push({type:el.t_type,module: [el.t_item]})
//             }else{
//                 if(newData[index].types[index1].module.findIndex(e => e===el.t_item)=== -1){
//                     newData[index].types[index1].module.push(el.t_item)
//                 }
//             }
//             var index2 = newData[index].areas.findIndex(item => item.type === el.a_type)
//             if(index2 === -1){
//                 newData[index].areas.push({type: el.a_type,module:[el.a_item]})
//             }else{
//                 if(newData[index].areas[index2].module.findIndex(e => e===el.a_item)=== -1){
//                     newData[index].areas[index2].module.push(el.a_item)
//                 }
//             }
//         }
//     })
//     return newData
// }



module.exports = {
    getCategory
}