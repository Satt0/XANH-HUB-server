const route = require("express").Router({ mergeParams: true });
const { getProductById } = require("../handlers/product");

route.get("/byid", getProductById);

module.exports = route;
