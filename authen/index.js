const jwt=require('jsonwebtoken')
const key='very secrete'



exports.signToken=({user})=>{
    var token = jwt.sign(user, key);
    return token

}
exports.verifyToken=({token})=>{
    var decoded = jwt.verify(token, key);
    if(decoded.username){
        return true
    }
    return false
}