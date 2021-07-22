const {DB2} = require('../index')
var cache = require('memory-cache');




exports.getProductById=async({productId})=>{
    try{
        const fromCache=cache.get(`cache/product-${productId}`)
        if(fromCache){
            return fromCache
        }
        const db=await DB2
        const wait=new Promise((res,ej)=>{
            // limit 30
            db.query('select * from product where SID=?;',[productId],(err,data)=>{
           if(err) ej(err)

          
           res(data[0] || {err:'not found'})
            
        })
        }) 
        const data=await wait

        if(!data.err){
            cache.put(`cache/product-${productId}`,data)    
        }
        return data
           
    }catch(e){
        throw e
    }
}

exports.getAllProducts=async()=>{
    try{

        const fromCache=cache.get('all-product')
        if(fromCache){
            return fromCache
        }

        const db=await DB2
        const wait=new Promise((res,ej)=>{
            // limit 30
            db.query('select * from product;',(err,data)=>{
           if(err) throw err
            cache.put('all-product',data)        
           res(data)
            
        })
        }) 
        return await wait
}catch(e){
    throw e
}
}



