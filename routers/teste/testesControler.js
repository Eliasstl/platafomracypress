const express = require("express");
const router = express.Router();
const Nometeste = require("../../database/Nometeste");
const NomeGrupo = require("../../database/Nometeste");
const Passo = require("../../database/Passoteste");
const VideoTeste = require("../../database/VideoTeste");
const adminAuto = require("../../middware/autorizar");

router.get(
  "/atualizarnometeste/:nometeste/:idempresa/:token",
  adminAuto,
  (req, res) => {
    var nometeste = req.params.nometeste;
    var idempresa = req.params.idempresa;
    var token = req.params.token;
    res.render("editarnometeste", { nometeste, idempresa, token });
  }
);

router.post("/salvarnovonometeste/:nometeste/:idempresa/:token",
adminAuto, (req, res) => {
  var token = req.params.token;
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
          idempresa,
          nometeste,
          token
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
        );
        VideoTeste.update(
          {
            nometeste: novonometeste,
          },
          {
            where: {
              nometeste: nometeste,
            },
          }
        )
          .then(() => {
            Nometeste.findAll().then((testes) => {
              res.render("painel", {
                idempresa,
                testes,
                token
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
router.get(
  "/criarteste/:nometeste/:idempresa/:token",
  adminAuto,
  (req, res) => {
    var nometeste = req.params.nometeste;
    var idempresa = req.params.idempresa;
    var token = req.params.token;

    Passo.findAll().then((testes) => {
      res.render("criarteste", {
        nometeste: nometeste,
        idempresa: idempresa,
        testes: testes,
        token,
      });
    });
  }
);

//salvar nome teste
router.get("/gravarnometeste/:idempresa/:token", adminAuto, (req, res) => {
  var token = req.params.token;
  var idempresa = req.params.idempresa;
  res.render("nometeste", {
    idempresa: idempresa,
    token,
  });
});

router.post("/nometeste/:idempresa/:token", adminAuto, (req, res) => {
  var token = req.params.token;
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  Nometeste.findOne({
    where: { nometeste: nometeste, idempresa: idempresa, status: 0 },
  })
    .then((registro) => {
      if (registro) {
        res.render("nometesteexiste", {
          idempresa: idempresa,
          token,
        });
      } else {
        Nometeste.create({
          idempresa: idempresa,
          nometeste: nometeste,
          status: 0,
          executar: "nao",
        })
          .then(() => {
            res.redirect(
              "/criarteste/" + nometeste + "/" + idempresa + "/" + token
            );
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
router.get(
  "/editarteste/:nometeste/:idempresa/:token",
  adminAuto,
  (req, res) => {
    var idempresa = req.params.idempresa;
    var nometeste = req.params.nometeste;
    var token = req.params.token;
    res.redirect("/criarteste/" + nometeste + "/" + idempresa + "/" + token);
    console.log("Passo salvo com sucesso!");
  }
);

//deletar teste
router.post("/deletarteste/:idempresa/:token", adminAuto, (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  var token = req.params.token;

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
          res.redirect("/adicionarpasso/" + idempresa + "/" + token);
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
            res.redirect("/painelatualizar/" + idempresa + "/" + token);
          })
          .catch((err) => {
            console.error("Erro ao excluir registro:", err);
          });
      } else {
        res.redirect("/painelatualizar/" + idempresa + "/" + token);
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar registro:", err);
      res.redirect("/painelatualizar/" + idempresa + "/" + token);
    });
});

module.exports = router;
