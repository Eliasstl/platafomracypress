const Sequelize = require("sequelize");
const connection = require("./database");

const Agendamento = connection.define("agendamento", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idagendamento: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  nometeste: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nomeagendamento: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  diasemana: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  diasemana: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  datafim: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  horainicio: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  horafim: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tempo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  executar: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});
Agendamento.sync({ force: false })
  .then(() => {
    console.log("Tabela Agendamento criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela Agendamento: " + msgErro);
  });

module.exports = Agendamento;
