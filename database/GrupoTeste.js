const Sequelize = require("sequelize");

const connection = require("./database");

const Grupo = connection.define("grupos", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  nometeste: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tipo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  conteudo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  funcao: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  inserir: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  forca: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  esperar: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nomegrupo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
 
});
Grupo.sync({ force: false })
  .then(() => {
    console.log("Tabela Nome Grupo criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela grupo: " + msgErro);
  });

module.exports = Grupo;
