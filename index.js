const express = require("express");
const app = express();
const axios = require("axios");
const session = require("express-session");
const bodyParser = require("body-parser");
const connection = require("./database/database");
const testesControler = require("./routers/teste/testesControler");
const passosControler = require("./routers/teste/passosControler");
const admControler = require("./routers/adm/admControler");
const rodarTesteControle = require("./routers/rodarteste/rodarTesteControle");
const relatorioControle = require("./routers/relatorio/relatorioControle");
const bibliotecaControle = require("./routers/biblioteca/bibliotecaControle");
const grupoPassoControle = require("./routers/biblioteca/grupoPassoControle");
const videoTesteControle = require("./routers/rodarteste/videoTesteControle");
const agendamentoControle = require("./routers/agendamento/agendamentoControle");
const Agendamento = require("./database/Agendamento");

const port = process.env.PORT || 3000;
//database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados");
  })
  .catch((msgErro) => {
    console.log("Erro ao logar no banco: " + msgErro);
  });
//Estou dizendo para o Express usar o EJS com View Enine
app.set("view engine", "ejs");
app.use(express.static("public"));

///session

app.use(
  session({
    secret: "bjhbjhbishshfsfkjsfksjfnslsdmadçaadadaadop",
    cookie: { maxAge: 10800000 },
  })
);

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", testesControler);
app.use("/", passosControler);
app.use("/", admControler);
app.use("/", rodarTesteControle);
app.use("/", relatorioControle);
app.use("/", bibliotecaControle);
app.use("/", grupoPassoControle);
app.use("/", videoTesteControle);
app.use("/", agendamentoControle);

setInterval(async () => {
 
}, 60000); // Executa a cada minuto

// Criando uma string no formato "hh:mm" com a hora final

//Porta
app.listen(port, () => {
  console.log("App Rodando!: " + port);
});
