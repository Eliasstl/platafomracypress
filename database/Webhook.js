const Sequelize = require("sequelize");
const connection = require("./database");

const Webhook = connection.define("webhooks", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  urlPassou: {
    type: Sequelize.STRING,
    allowNull: false,
  },
 tipo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlFalhou: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nomewebhook: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Webhook.sync({ force: false })
  .then(() => {
    console.log("Tabela Webhook criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = Webhook;
