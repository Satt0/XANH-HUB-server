
const validator=require('validator')

exports.validCart=({cart})=>{
    try{
        if(cart.length<=0) return false
    for(let item in cart){
        const {count,id,supCode,img,price,name}=cart[item];
       
        if(
            !validator.isNumeric(count+'')
            ||
            !validator.isNumeric(supCode+'')
            ||
             !validator.isFloat(price+'')
             ||
             validator.isEmpty(id+'')
            ||
            validator.isEmpty(img+'')
            ||
            validator.isEmpty(name+'')
        ){
            return false
        }
    }
    return true
    }catch(e){
        return false
    }
}

exports.validInfor=({order_infor})=>{
    try{
        const {
            address ,
            ship,
            payment,
            
          } = order_infor;
          if(
              validator.isEmpty(address+'')
              ||
              validator.isEmpty(ship+'')
              ||
              validator.isEmpty(payment+'')
              
          ) return false


          return true
    }catch(e){
        return false
    }
}