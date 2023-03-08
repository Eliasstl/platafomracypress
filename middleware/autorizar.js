const Token = require("../database/Token");
const bcrypt = require("bcryptjs");

function adminAuto(req, res, next) {
  const idempresa = req.params.idempresa;

  console.log("ID EMPRESA: " + idempresa);

  Token.findOne({ where: { idempresa: idempresa } })
    .then((token) => {
      if (token) {
        const tokenSalvo = token.token;

        // Comparar o hash gerado com o tokenSalvo
        const isTokenValid = bcrypt.compareSync(
          idempresa.toString(),
          tokenSalvo
        );
        console.log("TOKEN VALIDO: " + isTokenValid);
        if (isTokenValid) {
          next();
        } else {
          
          res.redirect("/sair/idempresa");
        }
      } else {
        res.redirect("/sair/idempresa");
      }
    })
    .catch((error) => {
      res.redirect("/sair/idempresa");
    });
}


module.exports = adminAuto;
