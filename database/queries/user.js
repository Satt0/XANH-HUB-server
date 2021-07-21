const {DB2} = require('../index')



exports.logInUser=({username,password})=>{
    try{
            const db=await DB2
            const wait=new Promise((res,ej)=>{
                db.query('select * from user where username=? and password=?;',[username,password],(err,data)=>{
                    if(err) throw err

                    res(data[0] || {err:'user not exist!'})

                })
            })
            return await wait
    }catch(e){
        throw e
    }
}

exports.signUpUser=()=>{
    try{
        return true
}catch(e){
    throw e
}
}



