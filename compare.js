/*
  compare.js
  Testilo comparison script.
  Usage example: node compare 35k1r cp0
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const tableDir = process.env.COMPARISONDIR || 'reports/comparative';
const reportTimeStamp = process.argv[2];
const tableProcID = process.argv[3];

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Creates and saves a web page containing a comparative table.
const table = async () => {
  const tableDirAbs = `${__dirname}/${tableDir}`;
  const {getQuery} = require(`./procs/table/${tableProcID}/index`);
  const query = await getQuery();
  const pageRaw = await fs.readFile(`${__dirname}/procs/table/${tableProcID}/index.html`, 'utf8');
  const page = replaceHolders(pageRaw, query);
  await fs.writeFile(`${tableDirAbs}/${reportTimeStamp}.html`, page);
  console.log(`Page comparing ${reportTimeStamp} reports created and saved`);
};

// ########## OPERATION

table();
