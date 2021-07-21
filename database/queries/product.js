const {DB2} = require('../index')



exports.getProductById=async({productId})=>{
    try{
        const db=await DB2
        const wait=new Promise((res,ej)=>{
            // limit 30
            db.query('select * from product where SID=?;',[productId],(err,data)=>{
           if(err) ej(err)

           res(data[0] || {err:'not found'})
            
        })
        }) 
        return await wait
           
    }catch(e){
        throw e
    }
}

exports.getAllProducts=async()=>{
    try{
        const db=await DB2
        const wait=new Promise((res,ej)=>{
            // limit 30
            db.query('select * from product limit 30;',(err,data)=>{
           if(err) throw err

           res(data)
            
        })
        }) 
        return await wait
}catch(e){
    throw e
}
}



