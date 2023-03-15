const Sequelize = require("sequelize");

/*const connection = new Sequelize("qaprodev", "root", "R3mixCl@nMorph3l", {
  host: "localhost",
  dialect: "mysql",
});*/
const connection = new Sequelize("qaprodev", "root", "GHBqdq75748", {
  host: "10.100.47.71",
  dialect: "mysql",
});
/*
const connection = new Sequelize("qaprodev", "root", "GHBqdq75748", {
  host: "node131216-env-0045258.jelastic.saveincloud.net",
  dialect: "mysql",
});
*/


module.exports = connection;
