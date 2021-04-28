const createError = require('http-errors'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    url = require('url'),
    _trim = require('lodash/trim');
const fileservicesSql = require('../models/fileservices.sql'),
    helpdeskSql = require('../models/helpdesk.sql'),
    maintenanceSql = require('../models/maintenance.sql');

const f1 = require('../models/fileservices.sql');
//let UPLOADS_DIR   = path.join(process.cwd(), "_uploads");
//UPLOADS_DIR = "file://192.168.1.173/public/";
//UPLOADS_DIR = 'file://192.168.1.179/Users/Public/Downloads/';

const CBG_MASTERDOC = "cbg_masterdoc";
const module_directories = {
    'helpdesk': {
        directory: 'helpdesk',
        cb: helpdeskSql._getFile
    },
    'maintenance': {
        directory: 'maintenance',
        cb: maintenanceSql._getFile
    },
    'mapfile': {
        directory: 'mapfile',
        cb: ''
    },
    'documents': 'docsFolder'
};

const fileservicesCtr = {
    getModulesList: (req,res, next) => {
        let m = module_directories;
        const mods = Object.keys(m).map(el => {
            return m[el].directory ? m[el].directory : m[el];
        });
        return res.json(mods);
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
    upload:async (req, res, next) => {
        const {files, fields} = req;
        const {activeDrivePath} = res.locals;
        const platform = os.platform();

        let today = new Date();
        let {username, module} = fields;
        username = (username || '').trim().toLowerCase().replace(/\W/g, '_');// + '__' + today.subtring(0,10);
        module = (module || '').trim().toLowerCase();

        if(username == '') {
            return next( createError(400, `Username required`) );
        }        
        if(!files.hasOwnProperty('files')) {
            return next( createError(400, `No file field included`) );
        }
        if(!module_directories.hasOwnProperty(module)) {
            return next( createError(400, `Module "${module}" not recognized`) );
        }
        //let newFilename = username + '_' + today.toISOString().substring(0,10) + path.extname(files.files.name);
        let newFilename = username + '_' + getId() + path.extname(files.files.name);
        let moduleDirectory = module_directories[module].directory ? module_directories[module].directory : module_directories[module];
        //let dstURL = new URL(UPLOADS_DIR + module_directories[module] + '/');
        //let dstFile = new URL(dstURL + newFilename);

        let destDir = destFile = '__';
        // using filepath so force FILE: protocol on win32
        if( (platform === 'win32') && (activeDrivePath.indexOf('file:') != 0) ) {
            destDir = url.pathToFileURL(path.join(activeDrivePath, CBG_MASTERDOC,  module_directories[module]) );
            destFile = url.pathToFileURL(path.join(activeDrivePath, CBG_MASTERDOC, module_directories[module], newFilename) );
        }
        if( (platform === 'win32') && (activeDrivePath.indexOf('file:') === 0) ) {            
            destDir = new URL( activeDrivePath + CBG_MASTERDOC + '/' + moduleDirectory );
            destFile = new URL( activeDrivePath + CBG_MASTERDOC + '/' + moduleDirectory + '/' + newFilename );
        }
        if( platform === 'linux' && (activeDrivePath.indexOf('file:') !== 0)) {
            destDir = path.join(activeDrivePath, CBG_MASTERDOC, moduleDirectory);
            destFile = path.join(destDir, newFilename);
        }
        if( (platform === 'linux') && (activeDrivePath.indexOf('file:') === 0) ) {
            return next( createError(500, "Invalid drive store. Contact Admin.") );
        }
        
        if(false) {
            return res.json( {
                filename:newFilename,
                activeDrivePath:activeDrivePath, 
                moduleDirectory: moduleDirectory,
                destDir:destDir, destFile:destFile,
                os:os.platform(), 
                timeStamp:Date().toLocaleString()
            } );
        }

        // let's create module folder if new upload; mode ignored on Windows
        try {
            !fs.existsSync(destDir) && fs.mkdirSync(destDir, {recursive:true});
        } catch(e) {
            console.log('mkdir.ERR', e);
            console.log(destDir.href);
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
            filesize:files.files.size,
            filetype:files.files.type,
            savedFilename: newFilename,
            activeDrivePath:activeDrivePath, 
            destDir:destDir, destFile:destFile,
            hash:files.files.hash,
            os:os.platform(), 
            timeStamp:Date().toLocaleString()} );
    },
    download: (req, res, next) => {
        let {filename, module, username} = req.fields;
        filename = _trim(filename);
        console.log(`ctr.download: "${filename}"`);

        if(filename = '') {
            return next( createError(400, 'Empty filename') );
        }

        res.json( {status:true, method:'download', timeStamp:new Date().toUTCString()} );
    },

    // ========================================================================    
}

module.exports = fileservicesCtr;

function getId(n) {
    //  http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}    
/*
message: 'ENOENT: no such file or directory, copyfile 'C:\\Users\\Paul\\AppData\\Local\\Temp\\upload_6f9b159bfb4cda7515ca0235ed7d9950' -> 'file://192.168.1.173/public/helpdesk/test_contract_drawings.xlsx''

*/