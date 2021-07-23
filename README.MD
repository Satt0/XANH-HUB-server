### setup dsdriver.

/v1/product/all - GET --- get all products

/v1/product/byid?id=<product-id> - GET - get single product by id (0 - 255)


/v1/user/login - POST - body :{username,password} return {
    user:{
        ...
    },
    jwt:...
}


/v1/shop/checkout - POST
- body:{cart:[{...}],order_infor:{ship,payment,address,discount}}
- headers : {
    "Authorization":"Bearer <token>"
}
 
/v1/shop/order?filter=<queue || success || canceled> - GET
