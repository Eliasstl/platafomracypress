const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Nometeste = require("../../database/Nometeste");
const Cadastrar = require("../../database/Cadastrar");
const Agendamento = require("../../database/Agendamento");
const adminAuto = require("../../middleware/autorizar");
// Restante do código aqui...


const moment = require('moment');


router.post('/rodartestesagendados', (req, res) => {
  const { data, hora, corpo } = req.body;

  const mensagemProgramada = moment(`${data} ${hora}`, 'DD/MM/YYYY HH:mm');

  const diff = mensagemProgramada.diff(moment());

  setTimeout(() => {
    const diaDaSemana = mensagemProgramada.format('dddd');
    console.log(`Mensagem enviada no ${diaDaSemana}: ${corpo}`);
  }, diff);

  res.send('Mensagem agendada com sucesso!');
});




router.post(
  "/salvaragendamento/:idempresa/:idagendamento",
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

    let diasDaSemana = [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];

    let horarios = [];

    diasDaSemana.forEach((dia) => {
      let horario = {};
      horario.dia = dia;

      switch (dia) {
        case "domingo":
          horario.horainicio = domingohorainicio;
          horario.horafim = domingohorafim;
          break;
        case "segunda":
          horario.horainicio = segundahorainicio;
          horario.horafim = segundahorafim;
          break;
        case "terça":
          horario.horainicio = tercahorainicio;
          horario.horafim = tercahorafim;
          break;
        case "quarta":
          horario.horainicio = quartahorainicio;
          horario.horafim = quartahorafim;
          break;
        case "quinta":
          horario.horainicio = quintahorainicio;
          horario.horafim = quintahorafim;
          break;
        case "sexta":
          horario.horainicio = sextahorainicio;
          horario.horafim = sextahorafim;
          break;
        case "sabado":
          horario.horainicio = sabadohorainicio;
          horario.horafim = sabadohorafim;
          break;
      }

      horarios.push(horario);
    });

    Agendamento.findAll({ where: { idagendamento: idagendamento } }).then(
      (agendamentos) => {
        agendamentos.forEach(async (agendar) => {
          if (agendar) {
            horarios.forEach(async (horario) => {
              if (horario.horainicio && horario.horafim) {
                // atualiza a tabela Agendamento com as informações do horário deste dia
                await Agendamento.create({
                  idempresa: idempresa,
                  nometeste: agendar.nometeste,
                  nomeagendamento: nomeagendamento,
                  diasemana: horario.dia.toLowerCase(),
                  datafim: data,
                  horainicio: horario.horainicio,
                  horafim: horario.horafim,
                  tempo: tempo,
                  executar: "nao",
                });
              }
            });
            agendar.destroy();
          }
        });
      }
    );

    res.render("acessar");
  }
);

router.post("/agenda/:idempresa", adminAuto, async (req, res) => {
  const idempresa = req.params.idempresa;
  const selecionados = req.body["selecionado[]"];
  const dataatual = "id" + Date.now().toString(); // obtém a data atual

  try {
    if (Array.isArray(selecionados)) {
      for (const selecionado of selecionados) {
        await Agendamento.create({
          idempresa: idempresa,
          nometeste: selecionado,
          nomeagendamento: "Nome do agendamento",
          diasemana: "Dia da semana",

          horainicio: "Hora de início",
          horafim: "Hora de fim",
          tempo: "Tempo",
          executar: "nao",
          idagendamento: dataatual,
        });
      }
    } else {
      await Agendamento.create({
        idempresa: idempresa,
        nometeste: selecionados,
        nomeagendamento: "Nome do agendamento",
        diasemana: "Dia da semana",

        horainicio: "Hora de início",
        horafim: "Hora de fim",
        tempo: "Tempo",
        executar: "nao",
        idagendamento: dataatual,
      });
    }

    res.render("agenda", { idempresa, dataatual });
  } catch (error) {
    console.log("Erro ao inserir dados na tabela Agendamento: " + error);
    res.status(500).send("Erro ao inserir dados na tabela Agendamento");
  }
});

router.get("/selecionartesteagenda/:idempresa", adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  Nometeste.findAll().then((testes) => {
    res.render("selecionartesteagenda", {
      idempresa,
      testes,
    });
  });
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
