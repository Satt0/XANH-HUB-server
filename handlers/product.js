const {
    getProductById,
    searchProducts
  } = require("../database/queries/product");
  


exports.getProductById=async(req,res,next)=>{
    
        try {
          const { id } = req.query;
          if (id) {
            return res.json(await getProductById({ productId: req.query.id }));
          }
          throw new Error("bad request");
        } catch (e) {
          next(e);
        }
      
}
exports.searchByKeyword=async(req,res,next)=>{
  try{
    const {keyword,category=null}=req.query
      res.json(await searchProducts({keyword,category}))
  }catch(e){
    next(e)
  }
}