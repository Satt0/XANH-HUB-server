const route=require('express').Router({mergeParams:true})
const fetch=require('node-fetch')
const axios=require('axios')
route.get('/product',async (req,res,next)=>{
        try{
                const {TYPE,USER_ID,PRODUCT_ID,LIMIT}=req.query
            if(TYPE==='CS'){
                const data=await axios.get(`http://localhost:8000/CS?id=${PRODUCT_ID}&limit=${LIMIT}`).then(({data})=>data)
                res.json(await data)
            }else if(TYPE==='CF'){
                const data=await axios.get(`http://localhost:8000/CF?id=${USER_ID}`).then(({data})=>data)
                res.json(await data)

            }


        }catch(e){
            next(e)
        }
})



module.exports=route