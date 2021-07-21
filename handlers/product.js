const {
    getAllProducts,
    getProductById,
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