const express = require("express");
const router = express.Router();
const Passo = require("../../database/Passoteste");
const Grupo = require("../../database/GrupoTeste");
const Biblioteca = require("../../database/Biblioteca");
const adminAuto = require("../../middware/autorizar") 

///editar passo em lista de passo
router.get(
  "/editardadospasso/:id/:nometeste/:idempresa/:token", adminAuto , (req, res) => {
    var token = req.params.token;
    const idempresa = req.params.idempresa;
    const id = req.params.id;
    const nometeste = req.params.nometeste;

    Biblioteca.findAll({ where: { id: id, idempresa: idempresa } })
      .then((testes) => {
        if (!testes || testes.length === 0) {
          res.status(404).send("Passo não encontrado");
        } else {
          res.render("editardadospasso", {
            testes: testes,
            nometeste: nometeste,
            idempresa,
            token
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Erro ao buscar passo na biblioteca: " + err);
      });
  }
);

// artualizar dados
router.post("/atualizarpassodados/:idempresa/:token", adminAuto , (req, res) => {
  var token = req.params.token;
  var idempresa = req.body.idempresa;
  var nometeste = req.body.nometeste;
  var titulo = req.body.titulo;
  var tipo = req.body.tipo;
  var conteudo = req.body.conteudo;
  var funcao = req.body.funcao;
  var idpasso = req.body.idpasso;
  var inserir = req.body.inserir;
  var forca = req.body.forca;
  var esperar = req.body.esperar;
  var passotitulo = req.body.passotitulo;

  Biblioteca.update(
    {
      idempresa: idempresa,
      tipo: tipo,
      conteudo: conteudo,
      funcao: funcao,
      inserir: inserir,
      forca: forca,
      status: 0,
      esperar: esperar,
      titulo: titulo,
    },
    {
      where: {
        titulo: passotitulo,
      },
    }
  ).then(() => {
    Passo.update(
      {
        titulo: titulo,
        tipo: tipo,
        conteudo: conteudo,
        funcao: funcao,
        inserir: inserir,
        forca: forca,
        status: 0,
        esperar: esperar,
      },
      {
        where: {
          titulo: passotitulo,
        },
      }
    );
    Grupo.update(
      {
        titulo: titulo,
        tipo: tipo,
        conteudo: conteudo,
        funcao: funcao,
        inserir: inserir,
        forca: forca,
        status: 0,
        esperar: esperar,
      },
      {
        where: {
          titulo: passotitulo,
        },
      }
    )
      .then(() => {
        // Tratamento de sucesso
        Biblioteca.findAll({
          where: {
            idempresa: idempresa,
          },
        })
          .then((dados) => {
            res.render("dados", {
              dados,
              nometeste: nometeste,
              idempresa: idempresa,
              token
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Erro interno do servidor");
          });
      })
      .catch((erro) => {
        // Tratamento de erro
        res.redirect("/adicionarpasso");
        console.log("Erro ao atualizar passo" + erro);
      });
  });
});

///deletar passo em lista de passo
router.get(
  "/deletadadospasso/:id/:nometeste/:idempresa/:token", adminAuto ,

  (req, res) => {
    var token = req.params.token; 
    const id = req.params.id;
    const nometeste = req.params.nometeste;
    const idempresa = req.params.idempresa;

    Biblioteca.findOne({
      where: { id: id },
    }).then((dados) => {
      if (dados) {
        Biblioteca.destroy({
          where: { id: id },
        }).then(() => {
          Biblioteca.findAll({
            where: {
              idempresa: idempresa,
            },
          })
            .then((dados) => {
              res.render("dados", {
                dados,
                nometeste: nometeste,
                idempresa: idempresa,
                token
              });
            })
            .catch((erro) => {
              res.redirect("/adicionarpasso");
              console.log("Erro ao excluir passo" + erro);
            });
        });
      }
    });
  }
);

//adicionar passo no teste
router.get(
  "/adicionardados/:id/:nometeste/:idempresa/:token", adminAuto ,

  (req, res) => {
    const id = req.params.id;
    const nometeste = req.params.nometeste;
    const idempresa = req.params.idempresa;
    var token = req.params.token;

    Biblioteca.findAll({ where: { id: id } }).then((dados) => {
      dados.forEach((item) => {
        Passo.create({
          idempresa: item.idempresa,
          nometeste: nometeste,
          titulo: item.titulo,
          tipo: item.tipo,
          conteudo: item.conteudo,
          funcao: item.funcao,
          inserir: item.inserir,
          forca: item.forca,
          status: 0,
          esperar: item.esperar,
        })
          .then(() => {
            res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
          })
          .catch((erro) => {
            console.log("Erro ao cadastrar passo" + erro);
          });
      });
    });
  }
);

//buscar passos
router.get("/meusdados/:nometeste/:idempresa/:token", adminAuto , (req, res) => {
  const idempresa = req.params.idempresa;
  const nometeste = req.params.nometeste;
  var token = req.params.token;
  Biblioteca.findAll({
    where: {
      idempresa: idempresa,
    },
  })
    .then((dados) => {
      res.render("dados", {
        dados,
        nometeste: nometeste,
        idempresa: idempresa,
        token
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Erro interno do servidor");
    });
});

module.exports = router;
