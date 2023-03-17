const express = require("express");
const router = express.Router();
const Nometeste = require("../../database/Nometeste");
const Cadastrar = require("../../database/Cadastrar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const adminAuto = require("../../middware/autorizar");

router.get("/planoplus/:idempresa/:token", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  var token = req.params.token;
  Nometeste.findAll().then((testes) => {
    res.render("planoplus", {
      idempresa,
      testes,
      token,
    });
  });
});

// acessar
router.get("/", (req, res) => {
  res.render("acessar");
});
router.get("/sair/:idempresa", (req, res) => {
  res.render("acessar");
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
router.get("/painel/:idempresa/:token", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  var token = req.params.token;
  Nometeste.findAll().then((testes) => {
    res.render("painel", {
      idempresa,
      testes,
      token,
    });
  });
});
router.get("/rodartestes/:idempresa/:token", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  var token = req.params.token;
  Nometeste.findAll().then((testes) => {
    res.render("rodartestes", {
      idempresa,
      testes,
      token,
    });
  });
});
router.get("/painelatualizar/:idempresa/:token", adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  var token = req.params.token;
  Nometeste.findAll().then((testes) => {
    res.render("painel", {
      idempresa,
      testes,
      token,
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
            var hash = "QAPRO";

            // Senha correta, renderiza o painel
            const token = jwt.sign({ userId: registro.id }, hash, {
              expiresIn: 28800,
            });

            res.cookie("token", token, { httpOnly: true });
            console.log("TOKEN DE ACESSO: " + token);
            const idempresa = registro.id;
            Nometeste.findAll().then((testes) => {
              res.render("painel", {
                idempresa,
                testes,
                token,
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
