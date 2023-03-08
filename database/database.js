const Sequelize = require("sequelize");


const connection = new Sequelize("qaprodev", "root", "R3mixCl@nMorph3l", {
  host: "localhost",
  dialect: "mysql",
});
/*const connection = new Sequelize("heroku_e85ee26b2cdf713", "b0c96a488c83b4", "3de68a50", {
  host: "us-cdbr-east-06.cleardb.net",
  dialect: "mysql",
});
*/


module.exports = connection;
