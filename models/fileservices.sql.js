const mysql = require('mysql'),
    conn = require('../controllers/dbconnection');

module.exports = {
    _getFile: async (fileId) => {
        return 666;
    },
    _saveFile: (d) => {
        return Math.random();
    },
    getAllFiles: async (fileId) => {
        let ret = undefined;
        console.log('this.getAllFiles', fileId);
        try {
            ret = await conn.query('SELECT * FROM hd_attachments;');
        } catch(e) {
            console.log('=====', e);
            ret = e;
        }
        console.log('++++++++++++++++++++');
        return ret;
    }
    
}