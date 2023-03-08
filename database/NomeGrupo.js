const Sequelize = require("sequelize");
const connection = require("./database");

const NomeGrupo = connection.define("nomegrupos", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  }
 
  
 
});
NomeGrupo.sync({ force: false })
  .then(() => {
    console.log("Tabela NomeGrupo criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela grupo: " + msgErro);
  });

module.exports = NomeGrupo;
