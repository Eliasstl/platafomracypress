const express = require("express");
const router = express.Router();
const Nometeste = require("../../database/Nometeste");
const NomeGrupo = require("../../database/Nometeste");
const Passo = require("../../database/Passoteste");
const VideoTeste = require("../../database/VideoTeste");
const adminAuto = require("../../middleware/autorizar");

router.get("/atualizarnometeste/:nometeste/:idempresa", (req, res) => {
  var nometeste = req.params.nometeste;
  var idempresa = req.params.idempresa;
  res.render("editarnometeste", { nometeste, idempresa });
});

router.post("/salvarnovonometeste/:nometeste", (req, res) => {
  var novonometeste = req.body.novonometeste;
  var idempresa = req.body.idempresa;
  var nometeste = req.params.nometeste;

  console.log("NOME TESTE ROTA: " + nometeste);
  console.log("NOVO NOME TESTE: " + novonometeste);
  Nometeste.findOne({
    where: { nometeste: novonometeste, idempresa: idempresa, status: 0 },
  })
    .then((registro) => {
      if (registro) {
        res.render("editarnometesteexiste", {
         idempresa, nometeste
        });
      } else {
        Nometeste.update(
          {
            nometeste: novonometeste,
          },
          {
            where: {
              nometeste: nometeste,
            },
          }
        );
        Passo.update(
          {
            nometeste: novonometeste,
          },
          {
            where: {
              nometeste: nometeste,
            },
          }
        );
        NomeGrupo.update(
          {
            nometeste: novonometeste,
          },
          {
            where: {
              nometeste: nometeste,
            },
          }
        )
        VideoTeste.update(
          {
            nometeste: novonometeste,
          },
          {
            where: {
              nometeste: nometeste,
            },
          }
        ).then(() => {
            Nometeste.findAll().then((testes) => {
              res.render("painel", {
                idempresa,
                testes,
              });
            });
          })
          .catch((erro) => {
            console.log("Erro ao gravar nome do teste: " + erro);
          });
      }
    })
    .catch((erro) => {
      console.log("Erro ao buscar nome do teste: " + erro);
    });
});
//Criar caso de teste
router.get("/criarteste/:nometeste/:idempresa", adminAuto, (req, res) => {
  var nometeste = req.params.nometeste;
  var idempresa = req.params.idempresa;

  Passo.findAll().then((testes) => {
    res.render("criarteste", {
      nometeste: nometeste,
      idempresa: idempresa,
      testes: testes,
    });
  });
});

//salvar nome teste
router.get("/gravarnometeste/:idempresa", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  res.render("nometeste", {
    idempresa: idempresa,
  });
});

router.post("/nometeste/", (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  Nometeste.findOne({
    where: { nometeste: nometeste, idempresa: idempresa, status: 0 },
  })
    .then((registro) => {
      if (registro) {
        res.render("nometesteexiste", {
          idempresa: idempresa,
        });
      } else {
        Nometeste.create({
          idempresa: idempresa,
          nometeste: nometeste,
          status: 0,
          executar: "nao",
        })
          .then(() => {
            res.redirect("/criarteste/" + nometeste + "/" + idempresa);
            console.log("Nome salvo com sucesso");
          })
          .catch((erro) => {
            console.log("Erro ao gravar nome do teste: " + erro);
          });
      }
    })
    .catch((erro) => {
      console.log("Erro ao buscar nome do teste: " + erro);
    });
});

//editar teste
router.get("/editarteste/:nometeste/:idempresa", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  var nometeste = req.params.nometeste;
  res.redirect("/criarteste/" + nometeste + "/" + idempresa);
  console.log("Passo salvo com sucesso!");
});

//deletar teste
router.post("/deletarteste/", (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  console.log("ID: " + idempresa);

  Passo.findOne({
    where: { idempresa: idempresa, nometeste: nometeste },
  }).then((passo) => {
    if (passo) {
      Passo.destroy({
        where: { nometeste: nometeste, idempresa: idempresa },
      })
        .then(() => {
          console.log("Passo excluido com sucesso!");
        })
        .catch((erro) => {
          res.redirect("/adicionarpasso");
          console.log("Erro ao excluir passo" + erro);
        });
    }
  });
  Nometeste.findOne({
    where: { nometeste: nometeste, idempresa: idempresa, status: 0 },
  })
    .then((nome) => {
      if (nome) {
        // Exclui o registro encontrado
        Nometeste.destroy({
          where: { nometeste: nometeste, idempresa: idempresa, status: 0 },
        })
          .then(() => {
            console.log("Teste excluído com sucesso!");
            res.redirect("/painelatualizar/" + idempresa);
          })
          .catch((err) => {
            console.error("Erro ao excluir registro:", err);
          });
      } else {
        console.log(
          "Teste não encontrado: ID EMPRESA: " +
            idempresa +
            " NOME TESTE: " +
            nometeste +
            "STATUS: " +
            status
        );
        res.redirect("/painelatualizar/" + idempresa);
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar registro:", err);
      res.redirect("/painelatualizar/" + idempresa);
    });
});

module.exports = router;
