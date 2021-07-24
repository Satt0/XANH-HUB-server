const {
  createCheckout,
  getOrderByFilter,
  receivedProduct,
  rateProduct,
  checkDidRate
} = require("../database/queries/shop");
exports.postCheckout = async (req, res, next) => {
  try {
    const { cart, order_infor } = req.body;
    return res
      .status(201)
      .json(await createCheckout({ cart, order_infor, user: req.user }));
  } catch (e) {
    next(e);
  }
};
exports.getByFilter = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const { USER_ID } = req.user;
    res.json(await getOrderByFilter({ filter, USER_ID }));
  } catch (e) {
    next(e);
  }
};
exports.receiveHandler = async (req, res, next) => {
  try {
    const { USER_ID } = req.user;
    const { SID } = req.body;

    return res.json(await receivedProduct({ USER_ID, SID }));
  } catch (e) {
    next(e);
  }
};
exports.rateProductHandler = async (req, res, next) => {
  try {
    const { USER_ID } = req.user;
    const { SID, RATE } = req.body;
    return res.json(await rateProduct({ USER_ID, SID, RATE }));
  } catch (e) {
    next(e);
  }
};
exports.checkDidRateHandler=async(req,res,next)=>{
    try{
            const {USER_ID}=req.user
            const {SID}=req.query
            return res.json(await checkDidRate({USER_ID,SID}))
    }
    catch(e){
        next(e)
    }
}