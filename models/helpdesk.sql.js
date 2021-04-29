const mysql = require('mysql'),
    conn = require('../controllers/dbconnection');

module.exports = {
    getAllFiles: (req, res, next) => {
        const sql = "SELECT * FROM cpsa.hd_attachments ORDER BY id;";
        return conn.query(sql);
    },
    _getFile: (fileId) => {        
        let id = parseInt(fileId);

        if( (id === 0) || isNaN(id) ) {
            return new Error(`Illegal fileId: "{fileId}"`);
        }
        const sql = "SELECT filename, filepath FROM cpsa.hd_attachments WHERE id = ?;";
        return conn.query(sql, id);
    },
    _saveFileInfo: (info) => {
        let { filename, filetype, filesize, filepath } = info;

        let fd = {
            filename:filename,
            filetype:filetype,
            filesize:parseInt(filesize),
            filepath:filepath
        };
        const sql = "INSERT INTO cpsa.hd_attachments SET ?;";
        
        return conn.query(sql, fd);        
    }
}
