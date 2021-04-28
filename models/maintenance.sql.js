const mysql = require('mysql'),
    conn = require('../controllers/dbconnection');

module.exports = {
    _getFile: (fileId) => {
        return fileId;
    },
    _saveFileInfo: (info) => {
        return true;
    }
}
