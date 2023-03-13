const Sequelize = require("sequelize");
const connection = require("./database");

const Biblioteca = connection.define("dados", {
  idempresa: {
    type: Sequelize.INTEGER,
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
  tecla: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  esperar: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
Biblioteca.sync({ force: false })
  .then(() => {
    console.log("Tabela Bilioteca teste criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela Bilioteca: " + msgErro);
  });

module.exports = Biblioteca;
