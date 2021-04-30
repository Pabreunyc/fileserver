const mysql = require('mysql'),
    conn = require('../controllers/dbconnection');

module.exports = {
    getAllFiles: (req, res, next) => {
        const sql = "SELECT * FROM cpsa.tbl_maintenance_logs ORDER BY record_id;";
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
        const sql = `SELECT record_id AS fileId, file_full_path AS filepath file_name AS filename FROM cpsa.tbl_maintenance_logs WHERE record_id = ?;`;
        return conn.query(sql, id);
    },
    _saveFile: (info) => {
        const sql = "INSERT INTO cpsa.tbl_maintenance_logs SET ?;"

        return conn.query(sql, {
            file_source_path: "",
            file_full_path: info.filepath,
            file_name: info.filename,
            uploaded_by: 'paul.abreu'
        });
    }
}
