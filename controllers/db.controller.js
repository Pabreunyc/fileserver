const createError = require('http-errors'),    
    os = require('os'),
    _trim = require('lodash/trim');

const helpdeskSql = require('../models/fileservices.sql'),
    maintenanceSql = require('../models/maintenance.sql');

const module_directories = {
    'helpdesk': helpdeskSql._getFile,
    'maintenance':  maintenanceSql._getFile,
    'mapfile': undefined,
    'documents': undefined
};
const dbCtr = {
    base: (req, res, next) => {
        return res.json( {
            method: req.method,
            timeStamp:Date().toLocaleString()
        });
    },

    saveInfo: (req,res, next) => {
    /**
     * module, filename, filetype, filesize, filepath
    **/
        const {module} = req.body;
        const { filename, filetype, filesize, filepath } = req.body;


        return res.json( {
            body: req.body
        });
    }
}

module.exports = dbCtr;