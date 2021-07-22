const jwt=require('jsonwebtoken')
const key='very secrete'



exports.signToken=({user})=>{
    var token = jwt.sign(user, key);
    return token

}


// middlewares


exports.isAuth=(req,res,next)=>{
    try{
        const token=req.get('Authorization').substring('Bearer '.length).trim()
        
        const decoded=jwt.verify(token,key)
        if(!decoded.err){
            req.user=decoded
           return next()
        }
        return res.status(404).json({err:'invalid',signOut:true})
        
    }
    catch(e){
        next(e)
    }
}