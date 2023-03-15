const express = require("express");
const router = express.Router();
const Biblioteca = require("../../database/Biblioteca");
const Passo = require("../../database/Passoteste");
const Grupo = require("../../database/GrupoTeste");
const adminAuto = require("../../middleware/autorizar")

const NomeGrupo = require("../../database/NomeGrupo");

router.get("/deletargrupo/:titulo/:nometeste/:idempresa",adminAuto, (req, res) => {
  const nomegrupo = req.params.titulo;
  const nometeste = req.params.nometeste;
  const idempresa = req.params.idempresa;

  const deletarGrupo = Grupo.destroy({
    where: {
      nomegrupo: nomegrupo,
    },
  });

  const deletarNomeGrupo = NomeGrupo.destroy({
    where: {
      titulo: nomegrupo,
    },
  });

  Promise.all([deletarGrupo, deletarNomeGrupo])
    .then((results) => {
      Passo.findAll().then((testes) => {
        res.render("criarteste", {
          nometeste: nometeste,
          idempresa: idempresa,
          testes: testes,
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao deletar registros:", error);
    });
});

//selecionar grupo
router.get("/selecionargrupo/:titulo/:nometeste/:idempresa",adminAuto, (req, res) => {
  const titulo = req.params.titulo;
  const nometeste = req.params.nometeste;
  const idempresa = req.params.idempresa;
  // Busca todos os grupos com o mesmo nome de grupo
  Grupo.findAll({
    where: {
      nomegrupo: titulo,
    },
  })
    .then((grupos) => {
      // Salva cada grupo encontrado na tabela passos
      const promises = grupos.map((grupo) =>
        Passo.create({
          idempresa: idempresa,
          nometeste: nometeste,
          titulo: grupo.titulo,
          tipo: grupo.tipo,
          conteudo: grupo.conteudo,
          funcao: grupo.funcao,
          status: 0,
          inserir: grupo.inserir,
          forca: grupo.forca,
          nomegrupo: grupo.nomegrupo,
          esperar: grupo.esperar,
          tamanho: grupos.length,
        })
      );
      Promise.all(promises)
        .then(() => {
          return Passo.findAll();
        })
        .then((testes) => {
          res.render("criarteste", {
            nometeste: nometeste,
            idempresa: idempresa,
            testes: testes,
          });
          console.log("Grupo salvo na tabela passos");
        })
        .catch((error) => {
          console.log("Erro ao salvar grupo na tabela passos: " + error);
        });
    })
    .catch((error) => {
      console.log("Erro ao buscar grupos na tabela grupos: " + error);
    });
});

//renderizar grupo
router.get("/meusgrupos/:nometeste/:idempresa",adminAuto, (req, res) => {
  NomeGrupo.findAll()
    .then((grupos) => {
      const nometeste = req.params.nometeste;
      const idempresa = req.params.idempresa;
      res.render("meusgrupo", {
        grupos: grupos,
        nometeste: nometeste,
        idempresa: idempresa,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar grupos" });
    });
});

router.post("/salvargrupodepasso/:nometeste/:idempresa",adminAuto, (req, res) => {
  const nometeste = req.params.nometeste;
  const idempresa = req.params.idempresa;
  const nomegrupo = req.body.nomegrupo;

  // Atualiza o status de todos os grupos existentes para 1
  Grupo.update(
    { status: 1, nomegrupo: nomegrupo },
    { where: { idempresa: idempresa, nometeste: nometeste } }
  )
    .then(() => {
      // Salva um novo grupo com o título fornecido
      return NomeGrupo.create({
        idempresa: idempresa,
        titulo: nomegrupo,
      });
    })
    .then(() => {
      Passo.findAll().then((testes) => {
        res.render("criarteste", {
          nometeste: nometeste,
          idempresa: idempresa,
          testes: testes,
        });
      });
      console.log("Grupo de passos salvo com sucesso!");
    })
    .catch((error) => {
      console.log("Erro ao salvar grupo de passos: ", error);
    });
});

//mover passo para cima
router.get("/movergruposub/:id/:idempresa/:nometeste",adminAuto, (req, res) => {
  const id = req.params.id;
  let idPlus = parseInt(id) - 1;
  const idempresa = req.params.idempresa;
  const nometeste = req.params.nometeste;

  Grupo.findByPk(idPlus).then((passo2) => {
    if (!passo2) {
      console.log("Erro ao encontrar o próximo passo");
      return res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
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

    Grupo.findByPk(id).then((passo) => {
      if (!passo) {
        console.log("Erro ao encontrar o passo atual");
        return res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
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

      Grupo.update(
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
        Grupo.update(
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
          return res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
        });
      });
    });
  });
});

//mover passo para baixo
router.get("/movergrupodes/:id/:idempresa/:nometeste",adminAuto, (req, res) => {
  const id = req.params.id;
  const idPlus = parseInt(id) + 1;
  const idempresa = req.params.idempresa;
  const nometeste = req.params.nometeste;

  Grupo.findByPk(idPlus).then((passo2) => {
    if (!passo2) {
      console.log("Erro ao encontrar o próximo passo");
      return res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
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

    Grupo.findByPk(id).then((passo) => {
      if (!passo) {
        console.log("Erro ao encontrar o passo atual");
        return res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
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

      Grupo.update(
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
        Grupo.update(
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
          return res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
        });
      });
    });
  });
});

//deletar passso
router.post("/deletarpassogrupo/", (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  var idpasso = req.body.idpasso;

  Grupo.findOne({
    where: { id: idpasso, idempresa: idempresa, nometeste: nometeste },
  }).then((passo) => {
    if (passo) {
      // Exclui o registro encontrado
      Grupo.destroy({
        where: { id: idpasso, nometeste: nometeste, idempresa: idempresa },
      })
        .then(() => {
          console.log("Passo excluido com sucesso!");
          res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
        })
        .catch((erro) => {
          res.redirect("/adicionarpasso");
          console.log("Erro ao excluir passo" + erro);
        });
    }
  });
});

router.post("/atualizarpassogrupo/", (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  var titulo = req.body.titulo;
  var tipo = req.body.tipo;
  var conteudo = req.body.conteudo;
  var funcao = req.body.funcao;
  var idpasso = req.body.idpasso;
  var inserir = req.body.inserir;
  var forca = req.body.forca;

  var esperar = req.body.esperar;

  Grupo.update(
    {
      idempresa: idempresa,
      nometeste: nometeste,
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
        id: idpasso,
      },
    }
  )
    .then(() => {
      res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
      console.log("Passo atualizado com sucesso!");
    })
    .catch((erro) => {
      res.redirect("/adicionarpasso");
      console.log("Erro ao atualizar passo" + erro);
    });
});

// artualizar dados
router.post("/atualizarpassodadosgrupo/", (req, res) => {
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
            res.render("grupos", {
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

//editar passo
router.get("/editargrupo/:nometeste/:idempresa/:idpasso",adminAuto, (req, res) => {
  var nometeste = req.params.nometeste;
  var idempresa = req.params.idempresa;
  var idpasso = req.params.idpasso;
  Grupo.findAll().then((testes) => {
    const filteredTestes = testes.filter((teste) => teste.id == idpasso);
    res.render("editarpassogrupo", {
      nometeste: nometeste,
      idempresa: idempresa,
      testes: filteredTestes,
      idpasso: idpasso,
    });
  });
});

router.get("/editardadosgrupo/:id/:nometeste/:idempresa",adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  const id = req.params.id;
  const nometeste = req.params.nometeste;

  Biblioteca.findAll({ where: { id: id, idempresa: idempresa } })
    .then((testes) => {
      if (!testes || testes.length === 0) {
        res.status(404).send("Passo não encontrado");
      } else {
        res.render("editarpassogrupo", {
          testes: testes,
          nometeste: nometeste,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Erro ao buscar passo na biblioteca: " + err);
    });
});

router.get("/criargrupo/:nometeste/:idempresa",adminAuto, (req, res) => {
  var nometeste = req.params.nometeste;
  var idempresa = req.params.idempresa;
  Grupo.findAll().then((testes) => {
    res.render("criargrupo", {
      nometeste: nometeste,
      idempresa: idempresa,
      testes: testes,
    });
  });
});

//adicionar passo
router.get("/adicionarpassogrupo/:nometeste/:idempresa",adminAuto, (req, res) => {
  var nometeste = req.params.nometeste;
  var idempresa = req.params.idempresa;

  res.render("adicionarpassogrupo", {
    nometeste: nometeste,
    idempresa: idempresa,
  });
});
//buscar passos
router.get("/meusdadosgrupo/:nometeste/:idempresa",adminAuto, (req, res) => {
  const idempresa = req.params.idempresa;
  const nometeste = req.params.nometeste;

  Biblioteca.findAll({
    where: {
      idempresa: idempresa,
    },
  })
    .then((dados) => {
      res.render("grupos", {
        dados,
        nometeste: nometeste,
        idempresa: idempresa,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Erro interno do servidor");
    });
});

//adicionar passo no teste
router.get("/adicionardadosgrupo/:id/:nometeste/:idempresa", adminAuto,(req, res) => {
  const id = req.params.id;
  const nometeste = req.params.nometeste;
  const idempresa = req.params.idempresa;

  Biblioteca.findAll({ where: { id: id } }).then((dados) => {
    dados.forEach((item) => {
      Grupo.create({
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
          res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
        })
        .catch((erro) => {
          console.log("Erro ao cadastrar passo" + erro);
        });
    });
  });
});

// salvar passo
router.post("/salvarpassogrupo/", (req, res) => {
  var nometeste = req.body.nometeste;
  var idempresa = req.body.idempresa;
  var titulo = req.body.titulo;
  var tipo = req.body.tipo;
  var conteudo = req.body.conteudo;
  var funcao = req.body.funcao;
  var inserir = req.body.inserir;
  var forca = req.body.forca;
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
            Grupo.create({
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
              res.redirect("/criargrupo/" + nometeste + "/" + idempresa);
              console.log("Passo salvo com sucesso!");
            });
          })
          .catch((erro) => {
            res.redirect("/adicionarpasso");
            console.log("Erro ao cadastrar passo" + erro);
          });
      } else {
        // Se encontrar, redireciona para acessar
        Grupo.findAll().then((testes) => {
          res.render("passoexiste", {
            nometeste: nometeste,
            idempresa: idempresa,
            testes: testes,
          });
        });
      }
    })
    .catch((erro) => {
      res.redirect("/adicionarpasso");
      console.log("Erro ao buscar Biblioteca" + erro);
    });
});
module.exports = router;
