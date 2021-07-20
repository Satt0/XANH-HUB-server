var config = {
  host: "54a2f15b-5c0f-46df-8954-7e38e612c2bd.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud",
  port: 32733,
  username: "jvv09471",
  password: "WzhdYYw4wJMKapWL",
  database: "bludb",
};
var ibmdb = require("ibm_db");

const urlString = `DRIVER={DB2};DATABASE=${config.database};HOSTNAME=${config.host};UID=${config.username};PWD=${config.password};PORT=${config.port};PROTOCOL=TCPIP;`;

const DB2 = new Promise((res, ej) => {
  ibmdb.open(urlString, function (err, conn) {
    if (err) return console.log(err);

    res(conn);
  });
});

const sample = async () => {
  const db = await DB2;
  const pm = new Promise((res, ej) => {
    db.query("select * from products limit 5;", function (err, data) {
      if (err) throw err;

      res(data);
    });
  });
  return await pm;
};

module.exports = { sample };
