const route = require('express').Router({mergeParams:true})
const {isAuth} = require('../authen')
const {postCheckout,getByFilter}=require('../handlers/shop')

route.post('/checkout',isAuth,postCheckout)
route.get('/order',isAuth,getByFilter)







module.exports=route