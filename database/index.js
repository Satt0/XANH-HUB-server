var config = {
  host: "54a2f15b-5c0f-46df-8954-7e38e612c2bd.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud",
  port: 32733,
  username: "jvv09471",
  password: "WzhdYYw4wJMKapWL",
  database: "bludb",
};
var ibmdb = require("ibm_db");

const urlString = `DRIVER={DB2};DATABASE=${config.database};HOSTNAME=${config.host};UID=${config.username};PWD=${config.password};PORT=${config.port};PROTOCOL=TCPIP;`;

let DB2 = new Promise((res, ej) => {
  ibmdb.open(urlString, function (err, conn) {
    if (err) throw err;

    res(conn);
  });
});

setInterval(()=>{
  console.log('reconnecting db');
  DB2 = new Promise((res, ej) => {
    ibmdb.open(urlString, function (err, conn) {
      if (err) throw err;
      console.log('reconnect ok');
      res(conn);
    });
  });
},1000 * 60 * 5)



// const insert=async()=>{
//   const rows=await getData()
//   const db=await DB2
//   // "name","img","des","feature__ORIGIN","feature__MATERIALS","feature__END_OF_LIFE","specifications__PRODUCT_CARE","specifications__ADDITIONAL_FEATURES","specifications__RETURNS","company"
//   for(let i=0;i<rows.length;i++){
//     const data=rows[i]
//     const query={
//       sql:`insert into product (NAME,"img","des","feature__ORIGIN","feature__MATERIALS","feature__END_OF_LIFE","specifications__PRODUCT_CARE","specifications__ADDITIONAL_FEATURES","specifications__RETURNS","company",category) values(?,?,?,?,?,?,?,?,?,?,?);`,
//       params:Object.entries(data).map(e=>e[1])
    
//     }
//     db.query(query.sql,[...query.params],(err,data)=>{
//       if(err) return console.log(i,'false',err.message);
       
//       return console.log(i,'ok');

//     })
//   }



// }
// insert()

module.exports = { DB2 };
