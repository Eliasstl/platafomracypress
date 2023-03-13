const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Nometeste = require("../../database/Nometeste");
const Cadastrar = require("../../database/Cadastrar");
const Agendamento = require("../../database/Agendamento");
const adminAuto = require("../../middleware/autorizar");
const moment = require('moment');

router.post(
  "/salvaragendamento/:idempresa/",
  adminAuto,
  (req, res) => {
    var idagendamento = req.params.idagendamento;
    var idempresa = req.params.idempresa;
    var domingohorainicio = req.body.domingohorainicio;
    var domingohorafim = req.body.domingohorafim;
    var segundahorafim = req.body.segundahorafim;
    var segundahorainicio = req.body.segundahorainicio;
    var tercahorainicio = req.body.tercahorainicio;
    var tercahorafim = req.body.tercahorafim;
    var quartahorafim = req.body.quartahorafim;
    var quartahorainicio = req.body.quartahorainicio;
    var quintahorainicio = req.body.quintahorainicio;
    var quintahorafim = req.body.quintahorafim;
    var sextahorafim = req.body.sextahorafim;
    var sextahorainicio = req.body.sextahorainicio;
    var sabadohorainicio = req.body.sabadohorainicio;
    var sabadohorafim = req.body.sabadohorafim;
    var data = req.body.data;
    var nomeagendamento = req.body.nomeagendamento;
    var tempo = req.body.tempo;
    res.render("agenda", { idempresa });

  }
);

router.get("/agenda/:idempresa", adminAuto, (req, res) => {
  const idempresa = req.params.idempresa
  
    res.render("agenda", { idempresa });
 
});



// Define a rota para /agendamento
router.post("/agendamento", (req, res) => {
  // Obter a data e hora e a mensagem do corpo da requisição
  const { dataHora, mensagem } = req.body;

  // Chamar a função agendarMensagem para agendar a mensagem
  agendarMensagem(dataHora, mensagem);

  // Responder com uma mensagem de confirmação
  res.send("Mensagem agendada com sucesso!");
});

module.exports = router;
