const route = require('express').Router({mergeParams:true})
const {isAuth} = require('../authen')
const {postCheckout}=require('../handlers/shop')

route.post('/checkout',isAuth,postCheckout)








module.exports=route