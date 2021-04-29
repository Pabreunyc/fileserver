const createError = require('http-errors'),    
    os = require('os'),
    _trim = require('lodash/trim');
const { isUndefined } = require('util');

const module_directories = require('../config/module_directories.json');
const sql = {
    helpdesk: require('../models/helpdesk.sql'),
    maintenance: require('../models/maintenance.sql')
};

const dbCtr = {
    base: (req, res, next) => {
        return res.json( {
            method: req.method,
            timeStamp:Date().toLocaleString()
        });
    },
    getAllFiles: async (req, res, next) => {
        let {url} = req;
        url = (url || '').trim().toLowerCase();

        let cmd = undefined;
        switch(url) {
            case "/getfileshelpdesk": {
                cmd = sql.helpdesk.getAllFiles; break;
            }
            case "/getfilesmaintenance": {
                cmd = sql.maintenance.getAllFiles; break;
            }            
        }

        if(cmd == undefined) {
            return next( createError(400, 'Illegal url or no lookup function found') );
        }
                
        try {
            let ret = await cmd();
            return res.json( ret );
        } catch(e) {
            console.log('this.getAllFiles.ERR', e);
            return next( createError(500, e.code ? e.code : e.toString()) );
        }
    },
    saveInfo: async (req,res, next) => {
    /**
     * module, filename, filetype, filesize, filepath
    **/
        let {module} = req.body, moduleSql, moduleCB;
        const { filename, filetype, filesize, filepath } = req.body;

        module = (module || '').trim().toLowerCase();
        moduleCB = module_directories[module] && module_directories[module].cb.save;
        if((module === '') || !moduleCB) {
            return next( createError(400, `Invalid Module: "${module}"`) );
        }
        let ret;
        try {
            ret = await sql[module][moduleCB](req.body);         
        } catch(e) {
            console.log('>>>ERR', e);
            return next( createError(500, e.code ? e.code : e.toString()) );
        }

        return res.json( {
            module: module,
            fileId: ret.insertId
        });
    },
    _getFileInfo: async (module, fileId) => {
        module = (module || '').trim().toLowerCase();
        fileId = parseInt(fileId);

        moduleCB = module_directories[module] && module_directories[module].cb.get;
        console.log('this._getFileInfo', moduleCB);
        let ret;
        try {
            ret = await sql[module][moduleCB](fileId);
            console.log('getFileInfo', ret);
            return ret;
        } catch(e) {
            console.log('this._getFileInfo.ERR', e);
            return next( createError(500, e.code ? e.code : e.toString()) );
        }

    }
}

module.exports = dbCtr;