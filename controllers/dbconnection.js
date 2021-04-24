var dbconfig = require('../config/db.config.json');
var mysql = require('mysql');
var util = require('util');

const DB = dbconfig.vm;

var dbpool = mysql.createPool({
    host     : DB.host,
    user     : DB.dbuser,
    password : DB.dbpwd,
    port     : DB.dbport,
    connectionLimit : DB.conLimit,
    multipleStatements : DB.multipleStatements
  });
// Ping database to check for common exception errors.
dbpool.getConnection((err, connection) => {
  if (err) {
    switch(err.code) {
        case 'ER_ACCESS_DENIED_ERROR': {
            console.log('Database access denied'); break;
        }
        case 'PROTOCOL_CONNECTION_LOST': {
            console.error('Database connection was closed.'); break;
        }
        case 'ER_CON_COUNT_ERROR': {
            console.error('Database has too many connections.'); break;
        }
        case 'ECONNREFUSED': {
            console.error('Database connection was refused.'); break;
        }
        default: {
            console.log('Database Error:', err.code); break;
        }
    }
  }
  
  if (connection) connection.release()

  return;
});
console.log('++++', dbpool);
// Promisify for Node.js async/await.
dbpool.query = util.promisify(dbpool.query);
dbpool.queryAsync = dbpool.query;

module.exports = dbpool;  