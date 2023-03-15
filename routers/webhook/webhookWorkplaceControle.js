const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Nometeste = require("../../database/Nometeste");
const WebhookDiscord = require("../../database/WebhookDiscord");
const WebhookWorkplace = require("../../database/WebhookWorkplace");
const VideoTeste = require("../../database/VideoTeste");
const FormData = require("form-data");
const axios = require("axios");
const adminAuto = require("../../middleware/autorizar");

//// workplace
router.get(
  "/webhookworkplaceenviar/:idempresa/:nometeste/:resultado/:nomevideo",
  (req, res) => {
    const videoFileName = req.params.nomevideo;
    const nometeste = req.params.nometeste;
    const resultado = req.params.resultado;
    const idempresa = req.params.idempresa;
const msg ="nometeste"+ "resultdado: "+resultado+ "\n" +"http://node131305-qapro.jelastic.saveincloud.net:14264/"+videoFileName
    WebhookWorkplace.findOne({
      where: {
        idempresa: idempresa,
      },
    })
      .then((webhook) => {
        if (webhook) {
          class Workplace {
            constructor() {
              this.url = "https://graph.workplace.com/me/messages";
              this.headers = {
                Authorization:
                  `Bearer ${webhook.token}`,
              };
            }

            async send(text) {
              const message = {
                recipient: {
                  thread_key: `${webhook.idgrupo}`,
                },
                message: { text },
              };
              const response = await axios.post(this.url, message, {
                headers: this.headers,
              });
              return response.data;
            }
          }
          const workplace = new Workplace();
          workplace.send(msg);
          console.log("Webhook wokplaxe enviado")
          res.redirect(`/relatoriogeral/${idempresa}`)
        }
      })
      .catch((err) => {
        // Ocorreu um erro ao pesquisar na tabela "webhooks"
      });
  }
);

router.get("/webhookworkplace/:idempresa", (req, res) => {
  const idempresa = req.params.idempresa;
  res.render("webhookWorkplace", { idempresa });
});

// Deleta a coluna caso tenha sido encontrada
router.post("/deletarwebhookworkplace/:idempresa/", adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  // Realiza a busca na tabela "webhook"
  WebhookWorkplace.findOne({ where: { idempresa: idempresa } })
    .then((webhook) => {
      if (webhook) {
        // Deleta a coluna caso tenha sido encontrada
        webhook.destroy();
        res.render("webhookWorkplacedelete", { idempresa });
      } else {
        res.render("webhookworkplacenao", { idempresa });
      }
    })
    .catch((err) => {
      console.log("Erro ao buscar/deletar webhook:", err);
    });
});

router.post("/salvarwebhookworkplace/:idempresa", (req, res) => {
  const idempresa = req.params.idempresa;
  const token = req.body.token;
  const idgrupo = req.body.idgrupo;
  WebhookWorkplace.findOne({
    where: {
     idempresa:idempresa,
    },
  })
    .then((webhook) => {
      
      if (webhook) {
        res.render("webhookWorkplace", { idempresa });
      } else {
        // Não existe um webhook do tipo "discord"
        // Crie um novo registro na tabela "webhooks"
        WebhookWorkplace.create({
          idempresa: idempresa,
          idgrupo:idgrupo,
          token:token
        })
          .then(() => {
            res.render("webhookWorkplace", { idempresa });
          })
          .catch((err) => {
           console.log(err)
          });
      }
      
    })
    .catch((err) => {
      // Ocorreu um erro ao pesquisar na tabela "webhooks"
    });
});

module.exports = router;
