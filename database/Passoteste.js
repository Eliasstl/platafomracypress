const Sequelize = require("sequelize");
const connection = require("./database");

const Passo = connection.define("passos", {
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

  nomegrupo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  esperar: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tamanho: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});
Passo.sync({ force: false })
  .then(() => {
    console.log("Tabela Nome teste criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = Passo;
