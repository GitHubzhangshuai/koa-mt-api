const xss = require('xss')
const { exec } = require('../db/mysql')

const getMenu = async () => {
    let sql = `select m.name as mname,m_m_o.name as name,m_m_o.type as type,m_m_o_c_o.title as title,m_m_o_c_o_c.String as item
    from menus as m 
    inner join menus_menu as m_m inner join menus_menu_object as m_m_o inner join menus_menu_object_child as m_m_o_c inner join menus_menu_object_child_object as m_m_o_c_o inner join menus_menu_object_child_object_child as m_m_o_c_o_c
    where m_m.parent_fk = m.ID and m_m.Object_fk = m_m_o.ID and m_m.Object_fk = m_m_o_c.parent_fk and m_m_o_c.Object_fk = m_m_o_c_o.ID and m_m_o_c.Object_fk = m_m_o_c_o_c.parent_fk `
    let result =  await exec(sql)
    let newData = []
    result.forEach(el => {
        let index = newData.findIndex(item => item.name === el.mname)
        if(index === -1){
            newData.push({
                name: el.mname,
                menu: [{
                    type: el.type,
                    name: el.name,
                    child: [{
                        title: el.title,
                        child: [el.item]
                    }]
                }]
            })
        }else{
            let index1 = newData[index].menu.findIndex(e1 => e1.type === el.type)
            if(index1 === -1){
                newData[index].menu.push({
                    type: el.type,
                    name: el.name,
                    child: [{
                        title: el.title,
                        child: [el.item]
                    }]
                })
            }else{
                let index2 = newData[index].menu[index1].child.findIndex(e2 => e2.title === el.title)
                if(index2 === -1){
                    newData[index].menu[index1].child.push({
                        title:el.title,
                        child: [el.item]
                    })
                }else{
                    newData[index].menu[index1].child[index2].child.push(el.item)
                }
                
            }
        }
    })
    return newData
}



module.exports = {
    getMenu
}