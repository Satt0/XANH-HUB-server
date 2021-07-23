
const {createCheckout,getOrderByFilter} =require('../database/queries/shop')
exports.postCheckout=async(req,res,next)=>{
    try{
        const {cart,order_infor}=req.body
        return res.status(201).json(await createCheckout({cart,order_infor,user:req.user}))
    }catch(e){
        next(e)
    }
}
exports.getByFilter=async(req,res,next)=>{
    try{
            const {filter}=req.query;
            const {USER_ID}=req.user;
            res.json(await getOrderByFilter({filter,USER_ID}))
    }catch(e){
        next(e)
    }
}