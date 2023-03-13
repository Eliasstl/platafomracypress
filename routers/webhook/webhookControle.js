const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Nometeste = require("../../database/Nometeste");
const Webhook = require("../../database/webhook");
const VideoTeste = require("../../database/VideoTeste");
const FormData = require("form-data");
const axios = require("axios");
const adminAuto = require("../../middleware/autorizar");

router.post("/deletarwebhook/:idempresa/:discord/:key",adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  const discord = req.params.discord;
  const key = req.params.key;
  // Realiza a busca na tabela "webhook"
  Webhook.findOne({ where: { idempresa: idempresa, tipo: discord } })
    .then((webhook) => {
      if (webhook) {
        // Deleta a coluna caso tenha sido encontrada
        webhook.destroy();
        res.render("webhookdelete", { idempresa});
      } else {
        res.render("webhooknao", { idempresa});
      }
    })
    .catch((err) => {
      console.log("Erro ao buscar/deletar webhook:", err);
    });
});

router.get("/cadastrarwebhook/:idempresa",adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  res.render("webhook", { idempresa});
 
});
router.post("/salvarwebhook/:idempresa",adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  const urlPassou = req.body.urlPassou;
  const urlFalhou = req.body.urlFalhou;
  const nomewebhook = req.body.nomewebhook;
  Webhook.findOne({
    where: {
      tipo: "discord",
    },
  })
    .then((webhook) => {
      
      if (webhook) {
        res.render("webhook", { idempresa});
      } else {
        // Não existe um webhook do tipo "discord"
        // Crie um novo registro na tabela "webhooks"
        Webhook.create({
          idempresa: idempresa,
          urlPassou: urlPassou,
          tipo: "discord",
          urlFalhou: urlFalhou,
          nomewebhook: nomewebhook,
        })
          .then(() => {
            res.render("webhook", { idempresa});
          })
          .catch((err) => {
            // Ocorreu um erro ao criar o registro
          });
      }
      
    })
    .catch((err) => {
      // Ocorreu um erro ao pesquisar na tabela "webhooks"
    });

   
});

router.get(
  "/webhookdiscord/:idempresa/:nometeste/:resultado/:nomevideo",adminAuto,
  (req, res) => {
    const videoFileName = req.params.nomevideo;
    const nometeste = req.params.nometeste;
    const resultado = req.params.resultado;
    const idempresa = req.params.idempresa;
    const videoPath = path.join(__dirname, "../../videos", videoFileName);
    // Defina a URL do webhook do Discord que você deseja usar
    const webhookUrl =
      "https://discordapp.com/api/webhooks/1083556657826635886/pTQDZEllmbGSvmEFjgzigjlgEHDxbRqHZFFLe4e_DhRo-iFjQCSnkro4s7Uz3aTGKp0i";

    // Crie uma instância do axios com as configurações necessárias
    const axiosInstance = axios.create({
      baseURL: webhookUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bot YOUR_TOKEN_HERE",
      },
    });

    // Crie um objeto com a mensagem que você deseja enviar
    const message = {
      content: ` ${nometeste} resultado: ${resultado}`,
    };

    if (fs.existsSync(videoPath)) {
      // O vídeo existe na pasta de vídeos
      const formData = new FormData();
      formData.append("video", fs.createReadStream(videoPath));

      axios
        .post(
          "https://discordapp.com/api/webhooks/1083556657826635886/pTQDZEllmbGSvmEFjgzigjlgEHDxbRqHZFFLe4e_DhRo-iFjQCSnkro4s7Uz3aTGKp0i",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        )
        .then((response) => {
          console.log("POST enviado para o webhook do Discord com sucesso!");
          res.send("POST enviado para o webhook do Discord com sucesso!");
        })
        .catch((error) => {
          console.error(
            "Erro ao enviar o POST para o webhook do Discord: ",
            error
          );
          res
            .status(500)
            .send("Erro ao enviar o POST para o webhook do Discord.");
        });
    } else {
      // O vídeo não existe na pasta de vídeos
      console.error("O vídeo não existe na pasta de vídeos.");
      res.status(500).send("O vídeo não existe na pasta de vídeos.");
    }

    // Use a instância do axios para enviar a mensagem para o webhook
    axiosInstance
      .post("", message)
      .then((response) => {
        console.log("Mensagem enviada com sucesso!");
      })
      .catch((error) => {
        console.log("Erro ao enviar mensagem:", error);
        res.status(500).send("Erro ao enviar mensagem");
      });
  }
);

module.exports = router;
