const Sequelize = require("sequelize");
const connection = require("./database");

const WebhookDiscord = connection.define("webhooksDiscord", {
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
 

  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
 
});

WebhookDiscord.sync({ force: false })
  .then(() => {
    console.log("Tabela WebhookDiscord criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = WebhookDiscord;
