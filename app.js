const express = require("express");

const cors=require('cors')
const logger=require('morgan')
// app
const app=express()
// routes
const userRoute=require('./routes/user')
const productRoute=require('./routes/product')
const searchRoute=require('./routes/search')


app.use(cors())
app.use(logger('dev'))
app.use(express.json())

// routes
app.use('/v1/user',userRoute)
app.use('/v1/product',productRoute)
app.use('/v1/search',searchRoute)
app.get('/',(res,res)=>{
    res.send('xanhub server!')
})

// errors handler
app.use((err, req, res,next) => {
 res.json({err:err.message})
});
const port =process.env.PORT || 4000
app.listen(port,()=>{
    console.log('Listening on port',port);
});
