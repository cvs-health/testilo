/*
  compare.js
  Testilo comparison script.
  Usage example: node compare cp12a candidates
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const comparisonDir = process.env.COMPARISONDIR || 'reports/comparative';
const compareProcID = process.argv[2];
const comparisonNameBase = process.argv[3];

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Creates and saves a web page containing a comparative table.
const compare = async () => {
  const comparisonDirAbs = `${__dirname}/${comparisonDir}`;
  const {getQuery} = require(`./procs/compare/${compareProcID}/index`);
  const query = await getQuery();
  const pageRaw = await fs.readFile(`${__dirname}/procs/compare/${compareProcID}/index.html`, 'utf8');
  const page = replaceHolders(pageRaw, query);
  await fs.writeFile(`${comparisonDirAbs}/${comparisonNameBase}.html`, page);
  console.log(`Page ${comparisonNameBase}.html created and saved`);
};

// ########## OPERATION

compare();
