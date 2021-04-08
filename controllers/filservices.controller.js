const createError = require('http-errors'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    fileservicesModel = require('../models/fileservices.sql');

let UPLOADS_DIR   = path.join(process.cwd(), "_uploads");
UPLOADS_DIR = "file://192.168.1.173/public/";
UPLOADS_DIR = 'file://192.168.1.179/Users/Public/Downloads/';

let dd = new URL(xbase + 'helpdesk/');
let df = new URL(xbase + 'helpdesk/' + 'foo_' + Math.random() + '.txt');

const module_directories = {
    'helpdesk':     'helpdesk',
    'maintenance':  'maintenance',
    'mapfile':      'mapfile',    
    'sainventory':  'sainventory',
    'sarrs':        'sarrs',
    'sprout':       'sprout',
};

const fileservicesCtr = {
    upload: (req, res, next) => {
        const {files, fields} = req;
        let {username, module} = fields;
        username = (username || '').trim().toLowerCase();
        module = (module || '').trim().toLowerCase();

        if(username == '') {
            return next( createError(400, `Username required`) );
        }
        if(!module_directories.hasOwnProperty(module)) {
            return next( createError(400, `Module "${module}" not recognized`) );
        }
        if(!files.hasOwnProperty('files')) {
            return next( createError(400, `No file field included`) );
        }

        console.log(`username: "${username}", module:"${module}"`);
        console.log('file(s):', files.files);

        let dstDir = path.join(UPLOADS_DIR, module_directories[module]);
        dstDir = new URL(UPLOADS_DIR + module_directories[module] + '/');
        console.log('dstDir', UPLOADS_DIR + module_directories[module], dstDir);

        let dstURL = new URL(UPLOADS_DIR + module_directories[module] + '/');
        let dstFile = new URL(dstURL + )
        try {
            let x1 = fs.mkdirSync(dstDir, {recursive:true, mode:0o777});
            console.log('fs.mkdirSync', x1);
        } catch(e) {
            console.log('mkdir.ERR', e);
            return next( createError(500, e.toString()) );
        }

        try {
            fs.copyFileSync(files.files.path, dstDir+files.files.name );
        } catch(e) {
            console.log(`fs.copyFileSync.ERR`, e);
            return next( createError(500, e.toString()) );
        }

        res.json( {status:true, method:'upload', timeStamp:new Date().toUTCString(), 
            src:files.files.path,
            dst:dstDir} );
    },
    download: (req, res, next) => {
        console.log('ctr.download', req.fields);

        res.json( {status:true, method:'download', timeStamp:new Date().toUTCString()} );
    }
}

module.exports = fileservicesCtr;

/*
message: 'ENOENT: no such file or directory, copyfile 'C:\\Users\\Paul\\AppData\\Local\\Temp\\upload_6f9b159bfb4cda7515ca0235ed7d9950' -> 'file://192.168.1.173/public/helpdesk/test_contract_drawings.xlsx''

*/