const { DB2 } = require("../index");
const { validCart ,validInfor} = require("../../authen/authCart");

exports.createCheckout = async ({ cart, user,order_infor }) => {
  try {
    if (validCart({ cart }) && validInfor({order_infor})) {
      const res = await transaction({ user, cart ,order_infor});
      return res;
    }
    throw new Error("bad request body!");
  } catch (e) {
    throw e;
  }
};

exports.getOrderByFilter=async({filter,USER_ID})=>{
  try{
      const db=await DB2
      const process=new Promise((resolve,reject)=>{
        db.query("select * from ORDER_ITEM WHERE USER_ID=? and STATUS=? order by SID desc;",[USER_ID,filter],(err,data)=>{
          if(err) return reject({err:'server error!'})


          return resolve(data)
        })
      })
      return await process

  }catch(e){
    throw e
  }
}


exports.receivedProduct=async({USER_ID,SID})=>{
  try{
    const db=await DB2
    const process=new Promise((resolve,reject)=>{
      db.query(`update  ORDER_ITEM set status='success' where USER_ID=? and SID=?`,[USER_ID,SID],(err,data)=>{
        if(err) return resolve(false)


        return resolve(true)
      })
    })
    return  {status:await process}
  }catch(e){
    throw e
  }
}




















// checkout
const initOrder = async ({
  userid,
  address,
  ship ,
  payment ,
  discount = "",
}) => {
  try {
    const db = await DB2;
    const process = new Promise((resolve, reject) => {
      db.query(
        `
            select ORDER_ID from final table
            (
                insert into ORDER (BUYER_ID,DATECREATED,STATUS,SHIP_METHOD,PAYMENT_METHOD,DISCOUNT_CODE,ADDRESS)
                 values(?,now(),?,?,?,?,?)
            )
        `,
        [userid, "pending", ship, payment, discount, address],
        (err, data) => {
          if (err) reject(err);

          resolve(data[0]);
        }
      );
    });
    return await process;
  } catch (e) {
    throw e;
  }
};

const createOneOrderItem = async ({ ORDER_ID, item ,USER_ID}) => {
  const db = await DB2;
  const process = new Promise((resolve, reject) => {
    db.query(
      "insert into ORDER_ITEM (ORDER_ID,PRODUCT_ID,COMPANY_ID,QUANTITY,TOTAL_PRICE,STATUS,USER_ID) values(?,?,?,?,?,?,?);",
      [ORDER_ID, item.id, item.supCode, item.count, item.price, "queue",USER_ID],
      (err, data) => {
        if (err) return resolve(false);
        return resolve(true);
      }
    );
  });
  return await process;
};

const transaction = async ({ cart, user, order_infor }) => {
  try {
    const conn = await DB2;
    const process = new Promise((resolve, reject) => {
      conn.beginTransaction(async function (err) {
        if (err) {
          return resolve(false);
        }
       try{
        const {
          address ,
          ship,
          payment,
          discount,
        } = order_infor;
       
        const { ORDER_ID } = await initOrder({
          userid: user.USER_ID,
          address,
          ship,
          payment,
          discount,
        });
        for (let item in cart) {
          const result = await createOneOrderItem({
            ORDER_ID,
            item: cart[item],
            USER_ID:user.USER_ID
          });
          if (result === false) {
            resolve(false);
            return;
          }
        }
      }catch(e){
        return resolve(false)
      }
        conn.commitTransaction(function (err) {
          if (err) {
            return resolve(false);
          }
          return resolve(true);
        });
      });
    });
    return { status: await process };
  } catch (e) {
    throw e;
  }
};
