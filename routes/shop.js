const route = require('express').Router({mergeParams:true})
const { Router } = require('express')
const {isAuth} = require('../authen')
const {postCheckout,getByFilter,receiveHandler}=require('../handlers/shop')

route.post('/checkout',isAuth,postCheckout)
route.get('/order',isAuth,getByFilter)
route.put('/confirm',isAuth,receiveHandler)







module.exports=route