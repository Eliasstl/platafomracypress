const express = require("express");
const router = express.Router();
const Nometeste = require("../../database/Nometeste");
const Cadastrar = require("../../database/Cadastrar");
const Token = require("../../database/Token");
const bcrypt = require("bcryptjs");
const adminAuto = require("../../middleware/autorizar");
const session = require("express-session");

// acessar
router.get("/", (req, res) => {
  res.render("acessar");
});
router.get("/sair/:idempresa", (req, res) => {
  var idempresa = req.params.idempresa;

  // Verifica se idempresa é um número inteiro
  if (isNaN(parseInt(idempresa))) {
    res.redirect("/");
  } else {
    // Verifica se idempresa está na tabela
    Token.findOne({
      where: {
        idempresa: idempresa,
      },
    })
      .then((token) => {
        if (token) {
          // Deleta o token e redireciona para a página principal
          Token.destroy({
            where: {
              idempresa: idempresa,
            },
          })
            .then(() => {
              console.log("saiu: " + session.user);
              res.redirect("/");
            })
            .catch((err) => {
              res.redirect("/");
            });
        } else {
          res.redirect("/");
        }
      })
      .catch((err) => {
        res.redirect("/");
      });
  }
});

//cadastrar cliente
router.get("/cadastrarcliente", (req, res) => {
  res.render("cadastrarcliente");
});
//salvar cliente no banco
router.post("/salvarcadastro", (req, res) => {
  var nomeempresa = req.body.nomeempresa;
  var nomeusuario = req.body.nomeusuario;
  var email = req.body.email;
  var senha = req.body.senha;

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(senha, salt);

  Cadastrar.findOne({
    where: { email: email },
  }).then((registro) => {
    if (registro) {
      res.render("cadastroexiste");
    } else {
      Cadastrar.create({
        nomeempresa: nomeempresa,
        nomeusuario: nomeusuario,
        email: email,
        senha: hash,
        status: 0,
      })
        .then(() => {
          res.render("acessar");
          console.log("Cadastro realizado  com sucesso");
        })
        .catch((erro) => {
          console.log("Erro ao cadastrar cliente: " + erro);
        });
    }
  });
});
//painel adm 
router.get("/painel/:idempresa", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  Nometeste.findAll().then((testes) => {
    res.render("painel", {
      idempresa,
      testes,
    });
  });
});
router.get("/rodartestes/:idempresa", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  Nometeste.findAll().then((testes) => {
    res.render("rodartestes", {
      idempresa,
      testes,
    });
  });
});
router.get("/painelatualizar/:idempresa", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  Nometeste.findAll().then((testes) => {
    res.render("painel", {
      idempresa,
      testes,
    });
  });
});
//validar Acesso
router.post("/validaracesso", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  Cadastrar.findOne({
    where: { email: email, status: 0 },
  })
    .then((registro) => {
      if (registro) {
        bcrypt.compare(senha, registro.senha, (err, result) => {
          if (result) {
            req.session.user = {
              id: registro.id,
            };
            console.log("VALOR: " + registro.id);

            // Senha correta, renderiza o painel
            const idempresa = registro.id;
            Nometeste.findAll().then((testes) => {
              res.render("painel", {
                idempresa,
                testes,
              });

              let salt = bcrypt.genSaltSync(10);
              let token = bcrypt.hashSync(idempresa.toString(), salt);

              // deleta todos os tokens com o mesmo idempresa
              Token.destroy({
                where: {
                  idempresa: idempresa,
                },
              });
              // cadastra o novo token
              Token.create({
                idempresa: idempresa,
                token: token,
              });
            });
          } else {
            res.render("acessonegado");
          }
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((erro) => {
      res.render("acessonegado");
      console.log("Erro ao acessar");
    });
});

module.exports = router;
