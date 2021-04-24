const mysql = require('mysql'),
    conn = require('../controllers/dbconnection');

module.exports = {
    getAllFiles: async () => {
        let ret = undefined;
        try {
            ret = await conn.query('SELECT * FROM cpsa.hd_attachments;');
        } catch(e) {
            console.log('=====', e);
            ret = e;
        }
        console.log('++++++++++++++++++++');
        return ret;
    }
}