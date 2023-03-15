/// <reference types="cypress" />
import "cypress-xpath";

describe("teste", () => {
  const id = Cypress.env("id");
  const inserir = Cypress.env("inserir");
  const status = Cypress.env("status");
  const tipo = Cypress.env("tipo");
  const conteudo = Cypress.env("conteudo");
  const funcao = Cypress.env("funcao");
  const tamanho = Cypress.env("tamanho");

  it("teste", () => {
    // let nometeste = "exemplo de, uma string, com vírgulas";
    let novaInserir = "";
    let novaTipo = "";
    let novaConteudo = "";
    let novaFuncao = "";

    let listaFuncao = [];
    let listaInserir = [];
    let listaTipo = [];
    let listaConteudo = [];

    for (let i = 0; i < funcao.length; i++) {
      let letra = funcao[i];
      if (letra === "|") {
        // remove a condição para espaços em branco
        listaFuncao.push(novaFuncao.trim()); // adiciona a substring sem espaços em branco
        novaFuncao = "";
      } else {
        novaFuncao += letra;
      }
    }

    for (let i = 0; i < conteudo.length; i++) {
      let letra = conteudo[i];
      if (letra === "|") {
        // remove a condição para espaços em branco
        listaConteudo.push(novaConteudo.trim()); // adiciona a substring sem espaços em branco
        novaConteudo = "";
      } else {
        novaConteudo += letra;
      }
    }

    for (let i = 0; i < inserir.length; i++) {
      let letra = inserir[i];
      if (letra === "|") {
        // remove a condição para espaços em branco
        listaInserir.push(novaInserir.trim()); // adiciona a substring sem espaços em branco
        novaInserir = "";
      } else {
        novaInserir += letra;
      }
    }

    for (let i = 0; i < tipo.length; i++) {
      let letra = tipo[i];
      if (letra === "|") {
        // remove a condição para espaços em branco
        listaTipo.push(novaTipo.trim()); // adiciona a substring sem espaços em branco
        novaTipo = "";
      } else {
        novaTipo += letra;
      }
    }
    if (novaTipo !== "") {
      listaTipo.push(novaTipo.trim()); // adiciona a última substring sem espaços em branco
    }

    // Adiciona a última substring, já que não há mais vírgulas após ela
    if (novaInserir !== "") {
      listaInserir.push(novaInserir.trim()); // adiciona a última substring sem espaços em branco
    }
    // Adiciona a última substring, já que não há mais vírgulas após ela
    if (novaConteudo !== "") {
      listaConteudo.push(novaConteudo.trim()); // adiciona a última substring sem espaços em branco
    }

    // Adiciona a última substring, já que não há mais vírgulas após ela
    if (novaFuncao !== "") {
      listaFuncao.push(novaFuncao.trim()); // adiciona a última substring sem espaços em branco
    }

    for (let i = 0; i < tamanho; i++) {
      if (listaTipo[i] == "navegar para url" && listaFuncao[i] == "navegar") {
        cy.visit(listaInserir[i]);
        //criando um passo inserir com css selector
      } else if (
        listaTipo[i] == "css selector" &&
        listaFuncao[i] == "inserir"
      ) {
        cy.get(listaConteudo[i]).type(listaInserir[i]);
      } //criando um passo inserir com xpath
      else if (listaTipo[i] == "xpath" && listaFuncao[i] == "inserir") {
        cy.xpath(listaConteudo[i]).type(listaInserir[i]);
      }
      //criando um passo inserir com xpath validar se existe
      else if (listaTipo[i] == "xpath" && listaFuncao[i] == "existe") {
        cy.xpath(listaConteudo[i]).should("exist");
      } else if (
        listaTipo[i] == "capturar imagem" &&
        listaFuncao[i] == "capturar imagem"
      ) {
        cy.screenshot(listaInserir[i]);

        // captura uma imagem da página e salva com o nome 'pagina_inicial.png' na pasta 'screenshots'
        cy.screenshot("pagina_inicial", { folder: "screenshots" });
      }

      //limpar campo de texto com  css
      else if (
        listaTipo[i] == "xpath" &&
        listaFuncao[i] == "limpar campo de texto"
      ) {
        cy.xpath(listaConteudo[i]).clear();
      }
      //criando um passo clique com xpath
      else if (listaTipo[i] == "xpath" && listaFuncao[i] == "clique") {
        cy.xpath(listaConteudo[i]).click();
      }
      //validando have value com contain
      else if (listaTipo[i] == "xpath" && listaFuncao[i] == "contem palavra") {
        cy.xpath(listaConteudo[i]).should("contain", listaInserir[i]);
      }

      //validando have value com xpath
      else if (listaTipo[i] == "xpath" && listaFuncao[i] == "value") {
        cy.xpath(listaConteudo[i]).should("have.value", listaInserir[i]);
      }
      //validando tamanho xpath
      else if (listaTipo[i] == "xpath" && listaFuncao[i] == "validar tamanho") {
        cy.xpath(listaConteudo[i]).should("have.length", listaInserir[i]);
      }
      //validando que elemento não existe com  xpath
      else if (listaTipo[i] == "xpathnog" && listaFuncao[i] == "não existe") {
        cy.xpath(listaConteudo[i]).should("not.exist");
      }
      //validando contem frase css
      else if (listaTipo[i] == "xpath" && listaFuncao[i] == "contem frase") {
        cy.xpath(listaConteudo[i]).should("have.text", listaInserir[i]);
      }
      //validando contem frase css
      else if (
        listaTipo[i] == "css selector" &&
        listaFuncao[i] == "contem frase"
      ) {
        cy.get(listaConteudo[i]).should("have.text", listaInserir[i]);
      }
      //validando tamanho xpath
      else if (
        listaTipo[i] == "css selector" &&
        listaFuncao[i] == "validar tamanho"
      ) {
        cy.get(listaConteudo[i]).should("have.length", listaInserir[i]);
      }

      //validando have value com contain
      else if (
        listaTipo[i] == "css selector" &&
        listaFuncao[i] == "contem palavra"
      ) {
        cy.get(listaConteudo[i]).should("contain", listaInserir[i]);
      }

      //criando um passo inserir com css validar se existe
      else if (listaTipo[i] == "css selector" && listaFuncao[i] == "existe") {
        cy.get(listaConteudo[i]).should("exist");
      }
      //validando have value com css
      else if (listaTipo[i] == "css selector" && listaFuncao[i] == "value") {
        cy.get(listaConteudo[i]).should("have.value", listaInserir[i]);
      }
      //criando um passo clique com css selector
      else if (listaTipo[i] == "css selector" && listaFuncao[i] == "clique") {
        cy.get(listaConteudo[i]).click();
      }

      //validando que elemento não existe com  css
      else if (
        listaTipo[i] == "css selector" &&
        listaFuncao[i] == "não existe"
      ) {
        cy.get(listaConteudo[i]).should("not.exist");
      }

      //limpar campo de texto com  css
      else if (
        listaTipo[i] == "css selector" &&
        listaFuncao[i] == "limpar campo de texto"
      ) {
        cy.get(listaConteudo[i]).clear();
      }
    }
  });
});
