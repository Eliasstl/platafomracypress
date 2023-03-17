const express = require("express");
const router = express.Router();
const WebhookWorkplace = require("../../database/WebhookWorkplace");
const axios = require("axios");
const adminAuto = require("../../middware/autorizar") 
//// workplace
router.get(
  "/webhookworkplaceenviar/:idempresa/:nometeste/:resultado/:nomevideo/:token", adminAuto ,
  (req, res) => {
    var token = req.params.token;
    const videourl = req.params.nomevideo;
    const videoFileName = decodeURIComponent(videourl);
    const nometesteUrl = req.params.nometeste;
    const nometeste= decodeURIComponent(nometesteUrl);
    const resultado = req.params.resultado;
    const idempresa = req.params.idempresa;
    const encodedVideoFileName = videoFileName.replace(/ /g, "%20");
    const url =
      "http://node131305-qapro.jelastic.saveincloud.net:14264/videos/" +
      encodedVideoFileName;
    const msg =
      "Nome do Teste: " +
      nometeste +
      "\n" +
      " status: " +
      resultado +
      "\n" +
      url;

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
                Authorization: `Bearer ${webhook.token}`,
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
          console.log("Webhook wokplaxe enviado");
          res.redirect(`/relatoriogeral/${idempresa}/${token}`);
        }
      })
      .catch((err) => {
        // Ocorreu um erro ao pesquisar na tabela "webhooks"
      });
  }
);

router.get("/webhookworkplace/:idempresa/:token", adminAuto ,  (req, res) => {
  const idempresa = req.params.idempresa;
  var token = req.params.token;
  res.render("webhookWorkplace", { idempresa,token });
});

// Deleta a coluna caso tenha sido encontrada
router.post("/deletarwebhookworkplace/:idempresa/:token", adminAuto ,  (req, res) => {
  const idempresa = req.params.idempresa;
  var token = req.params.token;
  // Realiza a busca na tabela "webhook"
  WebhookWorkplace.findOne({ where: { idempresa: idempresa } })
    .then((webhook) => {
      if (webhook) {
        // Deleta a coluna caso tenha sido encontrada
        webhook.destroy();
        res.render("webhookWorkplacedelete", { idempresa,token });
      } else {
        res.render("webhookworkplacenao", { idempresa,token });
      }
    })
    .catch((err) => {
      console.log("Erro ao buscar/deletar webhook:", err);
    });
});

router.post("/salvarwebhookworkplace/:idempresa/:token", adminAuto ,  (req, res) => {
  var token = req.params.token;
  const idempresa = req.params.idempresa;
  const toke = req.body.token;
  const idgrupo = req.body.idgrupo;
  
  WebhookWorkplace.findOne({
    where: {
      idempresa: idempresa,
    },
  })
    .then((webhook) => {
      if (webhook) {
        res.render("webhookWorkplace", { idempresa,token });
      } else {
        // Não existe um webhook do tipo "discord"
        // Crie um novo registro na tabela "webhooks"
        WebhookWorkplace.create({
          idempresa: idempresa,
          idgrupo: idgrupo,
          token: toke,
        })
          .then(() => {
            res.render("webhookWorkplace", { idempresa,token });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      // Ocorreu um erro ao pesquisar na tabela "webhooks"
    });
});

module.exports = router;
