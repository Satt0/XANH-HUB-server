const route = require("express").Router({ mergeParams: true });
const { isAuth } = require("../authen");
const {
  postCheckout,
  getByFilter,
  receiveHandler,
  rateProductHandler,
  checkDidRateHandler
} = require("../handlers/shop");

route.post("/checkout", isAuth, postCheckout);
route.get("/order", isAuth, getByFilter);
route.put("/confirm", isAuth, receiveHandler);
route.post("/rate", isAuth, rateProductHandler);
route.get("/didrate", isAuth,checkDidRateHandler);

module.exports = route;
