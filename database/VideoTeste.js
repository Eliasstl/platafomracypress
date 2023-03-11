const Sequelize = require("sequelize");
const connection = require("./database");

const VideoTeste = connection.define("videos", {

  nometeste: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  idempresa: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  resultado: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  video: {
    type: Sequelize.STRING(150), // definindo um tamanho máximo de 255 caracteres para o campo video
    allowNull: false,
  }
});

VideoTeste.sync({ force: false })
  .then(() => {
    console.log("Tabela Video teste criada com sucesso!");
  })
  .catch((msgErro) => {
    console.log("Erro ao criar tabela: " + msgErro);
  });

module.exports = VideoTeste;
