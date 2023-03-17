const cypress = require("cypress");
const glob = require("glob");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Passo = require("../../database/Passoteste");
const VideoTeste = require("../../database/VideoTeste");
 const adminAuto = require("../../middware/autorizar") 
const path = require("path");
const fs = require("fs");


router.get("/relatoriogeral/:idempresa/:token",adminAuto,(req, res) => {
  var idempresa = req.params.idempresa;
  var token = req.params.token;
  console.log("IDEEMPRESA"+idempresa)
  VideoTeste.findAll({
    where: { idempresa: idempresa }, // Adiciona a cláusula WHERE aqui
    order: [['id', 'DESC']]
  }).then((videos) => {
    res.render("relatoriogeral", {
      idempresa,
      videos,
      token
    });
  });
});

module.exports = router;
