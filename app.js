const express = require("express");

const cors=require('cors')
const logger=require('morgan')
// app
const app=express()
// routes
const userRoute=require('./routes/user')
const productRoute=require('./routes/product')
const searchRoute=require('./routes/search')
const shopRoute=require('./routes/shop')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())

// routes
app.use('/v1/user',userRoute)
app.use('/v1/product',productRoute)
app.use('/v1/search',searchRoute)
app.use('/v1/shop',shopRoute)

app.use(express.static(__dirname+'/client'))
app.use('*',(req,res)=>{
    res.sendFile(__dirname+'/client/index.html')
})

// errors handler
app.use((err, req, res,next) => {
 res.json({err:err.message})
});
const port =process.env.PORT || 4000
app.listen(port,()=>{
    console.log('Listening on port',port);
});
