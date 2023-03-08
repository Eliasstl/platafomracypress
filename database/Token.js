const Sequelize = require("sequelize");
const connection = require("./database");

const Token = connection.define("tokens", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});
Token.sync({ force: false })
  .then(() => {
    console.log("Tabela Token criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = Token;
