const jwt = require("jsonwebtoken");
const hash = "QAPRO";

function adminAuto(req, res, next) {
  const idempresa = req.params.idempresa;
  const token = req.params.token;

  if (!token) {
    return res.render("acessar");
  }

  try {
    const decoded = jwt.verify(token, hash);
    const novoid = decoded.userId;

    console.log("iDdecoded: " + novoid.toString() + " IDEMPRESA: " + idempresa.toString());

    if (novoid == idempresa) {
      next();
    } else {
      res.render("acessar");
    }
  } catch (error) {
    console.error(error);
    res.render("acessar");
  }
}

module.exports = adminAuto;
