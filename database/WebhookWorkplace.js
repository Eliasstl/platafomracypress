const Sequelize = require("sequelize");
const connection = require("./database");

const WebhookWorkplace = connection.define("webhookWorkplace", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  idgrupo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING(420),
    allowNull: false,
  },
});

WebhookWorkplace.sync({ force: false })
  .then(() => {
    console.log("Tabela WebhookWorkplace criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = WebhookWorkplace;
