const Sequelize = require("sequelize");
const connection = require("./database");

const Cadastrar = connection.define("cadastros", {
  nomeempresa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nomeusuario: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
Cadastrar.sync({ force: false })
  .then(() => {
    console.log("Tabela Cadastro criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = Cadastrar;
