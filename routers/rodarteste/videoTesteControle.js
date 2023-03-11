const cypress = require("cypress");
const glob = require("glob");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Passo = require("../../database/Passoteste");
const VideoTeste = require("../../database/VideoTeste");
const adminAuto = require("../../middleware/autorizar")
const path = require("path");
const fs = require("fs");



router.get("/relatoriogeral/:idempresa",adminAuto, (req, res) => {
  var idempresa = req.params.idempresa;
  console.log("IDEEMPRESA"+idempresa)
  VideoTeste.findAll({
    where: { idempresa: idempresa }, // Adiciona a cláusula WHERE aqui
    order: [['id', 'DESC']]
  }).then((videos) => {
    res.render("relatoriogeral", {
      idempresa,
      videos,
    });
  });
});


module.exports = router;
