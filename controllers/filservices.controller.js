const createError = require('http-errors'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    url = require('url'),
    _trim = require('lodash/trim'),
    fileservicesModel = require('../models/fileservices.sql');

let UPLOADS_DIR   = path.join(process.cwd(), "_uploads");
UPLOADS_DIR = "file://192.168.1.173/public/";
UPLOADS_DIR = 'file://192.168.1.179/Users/Public/Downloads/';

const CBG_MASTERDOC = "cbg_masterdoc";
const module_directories = {
    'helpdesk':     'helpdesk',
    'maintenance':  'maintenance',
    'mapfile':      'mapfile',    
    'sainventory':  'sainventory',
    'sarrs':        'sarrs',
    'sprout':       'sprout',
};

const fileservicesCtr = {
    getModulesList: (req,res, next) => {
        return res.json( {
            timestamp:res.locals.myVar,  
            modules: module_directories,
            activeDrivePath: res.locals.activeDrivePath
        } );
    },
    getDirectoryListing: (req, res, next) => {
        const {activeDrivePath} = res.locals;
        let directory = activeDrivePath, directoryListing = '';

        if( (os.platform() == 'win32') && (activeDrivePath.indexOf('file:') != 0) ) {
            directory = url.pathToFileURL(path.join(activeDrivePath, CBG_MASTERDOC) );
        }

        try {
            directoryListing = fs.readdirSync(directory);
        } catch(e) {
            console.log('fs.readdirSync.ERR', e);
            return next( createError(400, e.toString()) );
        }

        return res.json( {
            status:true,
            timeStamp:Date().toLocaleString(),
            directoryListing: directoryListing
        });
    },
    upload: (req, res, next) => {
        const {files, fields} = req;
        const {activeDrivePath} = res.locals;

        let today = new Date();
        let {username, module} = fields;
        username = (username || '').trim().toLowerCase().replace(/\W/g, '_');// + '__' + today.subtring(0,10);
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

        let newFilename = username + '_' + today.toISOString().substring(0,10) + path.extname(files.files.name);
        //let dstURL = new URL(UPLOADS_DIR + module_directories[module] + '/');
        //let dstFile = new URL(dstURL + newFilename);

        let destDir = destFile = '__';
        // going to use FILE: protocol
        if( (os.platform() == 'win32') && (activeDrivePath.indexOf('file:') != 0) ) {
            destDir = url.pathToFileURL(path.join(activeDrivePath, CBG_MASTERDOC,  module_directories[module] + '/') );
            destFile = url.pathToFileURL(path.join(activeDrivePath, CBG_MASTERDOC, module_directories[module], newFilename) );
        }

        /*
        return res.json( {filename:newFilename, activeDrivePath:activeDrivePath, 
            destDir:destDir, destFile:destFile,
            os:os.platform(), 
            timeStamp:Date().toLocaleString()} );
        */

        // let's create module folder if new upload; mode ignored on Windows
        try {
            !fs.existsSync(destDir) && fs.mkdirSync(destDir, {recursive:true});
        } catch(e) {
            console.log('mkdir.ERR', e);
            return next( createError(500, e.toString()) );
        }

        try {
            fs.copyFileSync(files.files.path, destFile );
        } catch(e) {
            console.log(`fs.copyFileSync.ERR`, e);
            return next( createError(500, e.toString()) );
        }

        try {
            console.log('unlink', files.files.path);
            fs.unlinkSync(files.files.path);
        } catch(e) {
            console.log('fs.unlinkSync.ERR', e);
            return next( createError(500, e.toString()) );
        }
        return res.json( {
            status:true,
            originalFilename:files.files.name,
            savedFilename: newFilename,
            activeDrivePath:activeDrivePath, 
            destDir:destDir, destFile:destFile,
            hash:files.files.hash,
            os:os.platform(), 
            timeStamp:Date().toLocaleString()} );

        res.json( {status:true, method:'upload', timeStamp:new Date().toUTCString(), 
            src:files.files.path,
            dst:dstFile} );
    },
    download: (req, res, next) => {
        let {filename, module, username} = req.fields;
        filename = _trim(filename);
        console.log(`ctr.download: "${filename}"`);

        if(filename = '') {
            return next( createError(400, 'Empty filename') );
        }

        res.json( {status:true, method:'download', timeStamp:new Date().toUTCString()} );
    }
}

module.exports = fileservicesCtr;

/*
message: 'ENOENT: no such file or directory, copyfile 'C:\\Users\\Paul\\AppData\\Local\\Temp\\upload_6f9b159bfb4cda7515ca0235ed7d9950' -> 'file://192.168.1.173/public/helpdesk/test_contract_drawings.xlsx''

*/