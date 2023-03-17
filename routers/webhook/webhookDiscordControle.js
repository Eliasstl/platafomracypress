const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const WebhookDiscord = require("../../database/WebhookDiscord");
const FormData = require("form-data");
const axios = require("axios");
const adminAuto = require("../../middware/autorizar");

router.post("/deletarwebhook/:idempresa/:token", adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  var token = req.params.token;
  // Realiza a busca na tabela "webhook"
  WebhookDiscord.findOne({ where: { idempresa: idempresa } })
    .then((webhook) => {
      if (webhook) {
        // Deleta a coluna caso tenha sido encontrada
        webhook.destroy();
        res.render("webhookdelete", { idempresa, token });
      } else {
        res.render("webhooknao", { idempresa, token });
      }
    })
    .catch((err) => {
      console.log("Erro ao buscar/deletar webhook:", err);
    });
});

router.get("/cadastrarwebhook/:idempresa/:token", adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  var token = req.params.token;
  res.render("webhook", { idempresa, token });
});
router.post("/salvarwebhook/:idempresa/:token", adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  var token = req.params.token;
  const url = req.body.url;
  WebhookDiscord.findOne({
    where: {
      idempresa: idempresa,
    },
  })
    .then((webhook) => {
      if (webhook) {
        res.render("webhook", { idempresa, token });
      } else {
        // Não existe um webhook do tipo "discord"
        // Crie um novo registro na tabela "webhooks"
        WebhookDiscord.create({
          idempresa: idempresa,
          url: url,
        })
          .then(() => {
            res.render("webhook", { idempresa, token });
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
  "/webhookdiscord/:idempresa/:nometeste/:resultado/:nomevideo/:token",
  adminAuto,
  (req, res) => {
    var token = req.params.token;
    const videourl = req.params.nomevideo;
    const videoFileName = decodeURIComponent(videourl);
    const nometesteUrl = req.params.nometeste;
    const nometeste= decodeURIComponent(nometesteUrl);
    const resultado = req.params.resultado;
    const idempresa = req.params.idempresa;
    const videoPath = path.join(__dirname, "../../videos", videoFileName);

    WebhookDiscord.findOne({
      where: {
        idempresa: idempresa,
      },
    })
      .then((webhook) => {
        if (webhook) {
          // Defina a URL do webhook do Discord que você deseja usar
          const webhookUrl = webhook.url;
         

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
              .post(webhookUrl, formData, {
                headers: {
                  ...formData.getHeaders(),
                },
              })
              .then((response) => {
                console.log(
                  "POST enviado para o webhook do Discord com sucesso!"
                );
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
      })
      .catch((err) => {
        // Ocorreu um erro ao pesquisar na tabela "webhooks"
      });
  }
);
module.exports = router;
