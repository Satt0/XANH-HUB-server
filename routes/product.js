const route = require("express").Router({ mergeParams: true });
const { getProductById } = require("../handlers/product");
const {getAllProducts}=require('../database/queries/product')
route.get('/all',async(req,res,next)=>{
    return res.json(await getAllProducts())
})
route.get("/byid", getProductById);
module.exports = route;
