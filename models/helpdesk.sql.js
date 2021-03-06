const mysql = require('mysql'),
    conn = require('../controllers/dbconnection');

module.exports = {
    getAllFiles: (req, res, next) => {
        const sql = "SELECT * FROM tbl_hd_attachments ORDER BY id DESC;";
        return conn.query(sql);
    },
    _getFile: (fileId) => {
    /**
     * MUST RETURN
     * filepath: full file path
     * fileId?: return fileId
     * filename?: saved filename only
    **/
        let id = parseInt(fileId);

        if( (id === 0) || isNaN(id) ) {
            return new Error(`Illegal fileId: "{fileId}"`);
        }
        const sql = "SELECT id AS fileId, filename, filepath FROM tbl_hd_attachments WHERE id = ?;";
        return conn.query(sql, id);
    },
    _saveFileInfo: (info) => {
        let { filename, filetype, filesize, filepath } = info;

        let fd = {
            ticketId: 0,
            userId: 0,
            filename:filename,
            filetype:filetype,
            filesize:parseInt(filesize),
            filepath:filepath
        };
        const sql = "INSERT INTO tbl_hd_attachments SET ?;";
        
        return conn.query(sql, fd);        
    }
}
