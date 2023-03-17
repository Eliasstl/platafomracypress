const express = require("express");
const router = express.Router();
const Biblioteca = require("../../database/Biblioteca");
const Passo = require("../../database/Passoteste");
const Grupo = require("../../database/GrupoTeste");
const adminAuto = require("../../middware/autorizar") 

//mover passo para cima
router.get("/moverpassosub/:id/:idempresa/:nometeste/:token", adminAuto ,  (req, res) => {
  const id = req.params.id;
  let idPlus = parseInt(id) - 1;
  const idempresa = req.params.idempresa;
  const nometeste = req.params.nometeste;
  var token = req.params.token;

  Passo.findByPk(idPlus).then((passo2) => {
    if (!passo2) {
      console.log("Erro ao encontrar o próximo passo");
      return res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
    }

    const idempresa2 = passo2.idempresa;
    const nometeste2 = passo2.nometeste;
    const titulo2 = passo2.titulo;
    const tipo2 = passo2.tipo;
    const conteudo2 = passo2.conteudo;
    const funcao2 = passo2.funcao;
    const status2 = passo2.status;
    const inserir2 = passo2.inserir;
    const forca2 = passo2.forca;
    const esperar2 = passo2.esperar;

    Passo.findByPk(id).then((passo) => {
      if (!passo) {
        console.log("Erro ao encontrar o passo atual");
        return res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
      }

      const idempresa1 = passo.idempresa;
      const nometeste1 = passo.nometeste;
      const titulo1 = passo.titulo;
      const tipo1 = passo.tipo;
      const conteudo1 = passo.conteudo;
      const funcao1 = passo.funcao;
      const status1 = passo.status;
      const inserir1 = passo.inserir;
      const forca1 = passo.forca;
      const esperar1 = passo.esperar;

      Passo.update(
        {
          idempresa: idempresa2,
          nometeste: nometeste2,
          titulo: titulo2,
          tipo: tipo2,
          conteudo: conteudo2,
          funcao: funcao2,
          status: status2,
          inserir: inserir2,
          forca: forca2,
          esperar: esperar2,
        },
        { where: { id: id } }
      ).then(() => {
        Passo.update(
          {
            idempresa: idempresa1,
            nometeste: nometeste1,
            titulo: titulo1,
            tipo: tipo1,
            conteudo: conteudo1,
            funcao: funcao1,
            status: status1,
            inserir: inserir1,
            forca: forca1,
            esperar: esperar1,
          },
          { where: { id: idPlus } }
        ).then(() => {
          console.log("Linhas invertidas com sucesso");
          return res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
        });
      });
    });
  });
});


//mover passo para baixo
router.get("/moverpassodes/:id/:idempresa/:nometeste/:token", adminAuto , (req, res) => {
  var token = req.params.token;
  const id = req.params.id;
  const idPlus = parseInt(id) + 1;
  const idempresa = req.params.idempresa;
  const nometeste = req.params.nometeste;

  Passo.findByPk(idPlus).then((passo2) => {
    if (!passo2) {
      console.log("Erro ao encontrar o próximo passo");
      return res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
    }

    const idempresa2 = passo2.idempresa;
    const nometeste2 = passo2.nometeste;
    const titulo2 = passo2.titulo;
    const tipo2 = passo2.tipo;
    const conteudo2 = passo2.conteudo;
    const funcao2 = passo2.funcao;
    const status2 = passo2.status;
    const inserir2 = passo2.inserir;
    const forca2 = passo2.forca;
    const esperar2 = passo2.esperar;

    Passo.findByPk(id).then((passo) => {
      if (!passo) {
        console.log("Erro ao encontrar o passo atual");
        return res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
      }

      const idempresa1 = passo.idempresa;
      const nometeste1 = passo.nometeste;
      const titulo1 = passo.titulo;
      const tipo1 = passo.tipo;
      const conteudo1 = passo.conteudo;
      const funcao1 = passo.funcao;
      const status1 = passo.status;
      const inserir1 = passo.inserir;
      const forca1 = passo.forca;
      const esperar1 = passo.esperar;

     Passo.update(
        {
          idempresa: idempresa2,
          nometeste: nometeste2,
          titulo: titulo2,
          tipo: tipo2,
          conteudo: conteudo2,
          funcao: funcao2,
          status: status2,
          inserir: inserir2,
          forca: forca2,
          esperar: esperar2,
        },
        { where: { id: id } }
      ).then(() => {
        Passo.update(
          {
            idempresa: idempresa1,
            nometeste: nometeste1,
            titulo: titulo1,
            tipo: tipo1,
            conteudo: conteudo1,
            funcao: funcao1,
            status: status1,
            inserir: inserir1,
            forca: forca1,
            esperar: esperar1,
          },
          { where: { id: idPlus } }
        ).then(() => {
          console.log("Linhas invertidas com sucesso");
          return res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
        });
      });
    });
  });
});
//adicionar passo
router.get("/adicionarpasso/:nometeste/:idempresa/:token", adminAuto , (req, res) => {
  var nometeste = req.params.nometeste;
  var idempresa = req.params.idempresa;
  var token = req.params.token;

  res.render("adicionarpasso", {
    nometeste: nometeste,
    idempresa,
    token
  });
});

// salvar passo
router.post("/salvarpasso/:idempresa/:token", adminAuto , (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  var titulo = req.body.titulo;
  var tipo = req.body.tipo;
  var conteudo = req.body.conteudo;
  var funcao = req.body.funcao;
  var inserir = req.body.inserir;
  var forca = req.body.forca;
  var token = req.params.token;
  var esperar = req.body.esperar;

  Biblioteca.findAll({ where: { idempresa: idempresa, titulo: titulo } })
    .then((result) => {
      if (result.length === 0) {
        // Se não encontrar, cria uma coluna na tabela Biblioteca e Passo
        Biblioteca.create({
          idempresa: idempresa,
          nometeste: nometeste,
          titulo: titulo,
          tipo: tipo,
          conteudo: conteudo,
          funcao: funcao,
          inserir: inserir,
          forca: forca,
          status: 0,
          esperar: esperar,
        })
          .then(() => {
            Passo.create({
              idempresa: idempresa,
              nometeste: nometeste,
              titulo: titulo,
              tipo: tipo,
              conteudo: conteudo,
              funcao: funcao,
              inserir: inserir,
              forca: forca,
              status: 0,
              esperar: esperar,
            }).then(() => {
              console.log("ESSE: "+token)
              res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
              console.log("Passo salvo com sucesso!");
            });
          })
          .catch((erro) => {
            res.redirect("/adicionarpasso/"+token);
            console.log("Erro ao cadastrar passo" + erro);
          });
      } else {
        // Se encontrar, redireciona para acessar
        Passo.findAll().then((testes) => {
          res.render("passoexiste", {
            nometeste: nometeste,
            idempresa: idempresa,
            testes: testes,
            token
          });
        });
      }
    })
    .catch((erro) => {
      res.redirect("/adicionarpasso/"+token);
      console.log("Erro ao buscar Biblioteca" + erro);
    });
});

//deletar passso
router.post("/deletarpasso/:idempresa/:token", adminAuto , (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  var idpasso = req.body.idpasso;
  var token = req.params.token;
  Passo.findOne({
    where: { id: idpasso, idempresa: idempresa, nometeste: nometeste },
  }).then((passo) => {
    if (passo) {
      // Exclui o registro encontrado
      Passo.destroy({
        where: { id: idpasso, nometeste: nometeste, idempresa: idempresa },
      })
        .then(() => {
          console.log("Passo excluido com sucesso!");
          res.redirect("/criarteste/" + nometeste + "/" + idempresa+"/"+token);
        })
        .catch((erro) => {
          res.redirect("/adicionarpasso");
          console.log("Erro ao excluir passo" + erro);
        });
    }
  });
});

// artualizar dados
router.post("/atualizarpassodados/", (req, res) => {
  var idempresa = req.body.idempresa;
  var nometeste = req.body.nometeste;
  var titulo = req.body.titulo;
  var tipo = req.body.tipo;
  var conteudo = req.body.conteudo;
  var funcao = req.body.funcao;
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
    );
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

router.get("/aditarp/:nometeste/:idempresa/:idpasso/:token", adminAuto , (req, res) => {
  var nometeste = req.params.nometeste;
  var idempresa = req.params.idempresa;
  var idpasso = req.params.idpasso;
  var token = req.params.token;
  Passo.findAll().then((testes) => {
    const filteredTestes = testes.filter((teste) => teste.id == idpasso);
    res.render("editarpasso", {
      nometeste: nometeste,
      idempresa: idempresa,
      testes: filteredTestes,
      idpasso: idpasso,
      token
    });
  });
});

module.exports = router;
