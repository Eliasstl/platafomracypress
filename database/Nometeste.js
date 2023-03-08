const Sequelize = require("sequelize");
const connection = require("./database");

const NomeTeste = connection.define("nometestes", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  nometeste: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  executar: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
NomeTeste.sync({ force: false })
  .then(() => {
    console.log("Tabela Passo criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = NomeTeste;
