const Sequelize = require("sequelize");


/*const connection = new Sequelize("qaprodev", "root", "R3mixCl@nMorph3l", {
  host: "localhost",
  dialect: "mysql",
});*/
const connection = new Sequelize("qaprodev", "root", "GHBqdq75748", {
  host: "10.100.47.71",
  dialect: "mysql",
});



module.exports = connection;
