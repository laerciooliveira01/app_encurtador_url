const express = require("express");
const app = express();
app.use(express.json());

const rotas = require("../app/rotas/rotas");

rotas(app);

module.exports = app;