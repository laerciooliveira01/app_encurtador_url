const pg = require('pg');

const urlDb = "postgres://ucoxayqr:EADKLMuG9XecMukLpu1xHUNPBmlEYhSH@motty.db.elephantsql.com/ucoxayqr";
const connDB = new pg.Client(urlDb);

module.exports = connDB;