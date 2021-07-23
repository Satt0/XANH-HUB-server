const { DB2 } = require("../index");
var cache = require("memory-cache");
const Fuse = require("fuse.js");

let fuse = null;

exports.getProductById = async ({ productId }) => {
  try {
    const fromCache = cache.get(`cache/product-${productId}`);
    if (fromCache) {
      return fromCache;
    }
    const db = await DB2;
    const wait = new Promise((res, ej) => {
      // limit 30
      db.query(
        "select * from product where SID=?;",
        [productId],
        (err, data) => {
          if (err) ej(err);

          res(data[0] || { err: "not found" });
        }
      );
    });
    const data = await wait;

    if (!data.err) {
      cache.put(`cache/product-${productId}`, data);
    }
    return data;
  } catch (e) {
    throw e;
  }
};

exports.getAllProducts = async () => {
  try {
    const fromCache = cache.get("all-product");
    if (fromCache) {
      return fromCache;
    }

    const db = await DB2;
    const wait = new Promise((res, ej) => {
      // limit 30
      db.query("select * from product;", (err, data) => {
        if (err) throw err;
        cache.put("all-product", data);
        res(data);
      });
    });
    return await wait;
  } catch (e) {
    throw e;
  }
};
exports.searchProducts = async ({ keyword, category }) => {
  try {
    if (fuse === null) {
      const fromCache = cache.get("all-product");
      let data;
      if (fromCache) {
        data = fromCache;
      } else {
        data = await this.getAllProducts();
      }
      const options = {
        includeScore: true,

        keys: ["des", "feature__MATERIALS", "feature__ORIGIN"],
      };

      fuse = new Fuse(data, options);
    }
    
    const resp= fuse.search(keyword);
    if(category!==null){
        
        return resp.filter(e=>e.item.CATEGORY===category)
    }
    return resp
  } catch (e) {
      throw e
  }
};
