/*
  table.js
  Testilo tabling script.
  Usage example: node table 35k1r ttp0
*/

// ########## IMPORTS

// Module to keep secrets.
require('dotenv').config();
// Module to read and write files.
const fs = require('fs/promises');

// ########## CONSTANTS

const tableDir = process.env.TABLEDIR || 'reports/comparative';
const reportTimeStamp = process.argv[2];
const tableProcID = process.argv[3];

// ########## FUNCTIONS

const table = async () => {
  const tableDirAbs = `${__dirname}/${tableDir}`;
  const {getTable} = require(`./procs/table/${tableProcID}`);
  const table = await getTable();
  await fs.writeFile(`${tableDirAbs}/${reportTimeStamp}.html`, table);
  console.log(`Table for scores of ${reportTimeStamp} reports created and saved`);
};

// ########## OPERATION

table();
