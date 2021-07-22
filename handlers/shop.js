
exports.postCheckout=async(req,res,next)=>{
    try{
        return res.status(201).json(req.body)
    }catch(e){
        next(e)
    }
}