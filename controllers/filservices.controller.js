const createError = require('http-errors'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    url = require('url'),
    mime = require('mime-types'),
    mysql = require('mysql'),
    conn = require('../controllers/dbconnection'),
    _trim = require('lodash/trim');
const fileservicesSql = require('../models/fileservices.sql'),
    helpdeskSql = require('../models/helpdesk.sql'),
    maintenanceSql = require('../models/maintenance.sql');
const dbCtr = require('./db.controller');
const module_directories = require('../config/module_directories.json');
const { runInNewContext } = require('vm');

//let UPLOADS_DIR   = path.join(process.cwd(), "_uploads");
//UPLOADS_DIR = "file://192.168.1.173/public/";

//const CBG_MASTERDOC = "cbg_masterdoc";
const CBG_MASTERDOC = "";

const fileservicesCtr = {
    getModulesList: (req,res, next) => {
        let m = module_directories;
        const mods = Object.keys(m).map(el => {
            return m[el].directory ? m[el].directory : m[el];
        });
        const m2 = Object.keys(m).filter(el =>
            m[el].hasOwnProperty('cb') && (typeof m[el].cb == 'object')
        );
        return res.json(m2);
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
        //let newFilename = username + '_' + getId() + path.extname(files.files.name);
        let timeStamp = Date.now();
        let newFilename = `${username}_${timeStamp}_${files.files.name}`;
        let moduleDirectory = module_directories[module].directory ? module_directories[module].directory : module_directories[module];
        
        let destDir = destFile = '__';
        // o Win32, forcing FILE: protocol
        if( (platform === 'win32') && (activeDrivePath.indexOf('file:') != 0) ) {
            destDir = url.pathToFileURL(path.join(activeDrivePath, CBG_MASTERDOC,  moduleDirectory) );
            destFile = url.pathToFileURL(path.join(activeDrivePath, CBG_MASTERDOC, moduleDirectory, newFilename) );
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
        console.log('upload', mime.lookup(files.files.name));
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
        /*
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
        */

        try {
            console.log('1');
            copyFileToDestination(files.files.path, destDir, destFile);
            console.log('2');
        } catch(e) {
            console.log('3', e);
            return next( createError(500, e.toString()) );
        }

        return res.json( {
            destFile: destFile,
            filename: files.files.name,
            hash: files.files.hash,
            owner: username,
            size: files.files.size,
            type: files.files.type,
            timeStamp:timeStamp
        })
        return res.json( {
            status:true,
            originalFilename:files.files.name,
            savedFilename: newFilename,
            filesize:files.files.size,
            filetype:files.files.type,            
            activeDrivePath:activeDrivePath, 
            destDir:destDir,             
            destFile:destFile,                        
            hash:files.files.hash,
            os:os.platform(), 
            timeStamp:timeStamp} );
    },
    download:async (req, res, next) => {
        let {module, fileId} = req.fields;
        module = (module || '').trim().toLowerCase();
        let id = parseInt(fileId);        

        if((id === 0) || isNaN(id) ){
            return next( createError(400, `Invalid FileId: "${fileId}"`) );
        }
        if( (module==='') || !module_directories.hasOwnProperty(module) ) {
            return next( createError(400, `Invalid module: "${module}"`) );
        }

        let ret = await dbCtr._getFileInfo(module, fileId);
        
        if(ret.length) {
            const {filepath, filename} = ret[0];

            try {
                let filepathURL = new URL(filepath);
                let saveFilename = filename ? filename : filepath.substring(filepath.lastIndexOf('/')+1);

                if( fs.existsSync(filepathURL) ) {
                    let fileMimetype = mime.lookup(filepathURL);
                    //console.log('mime:', mime.lookup(filepathURL));

                    //let buf = fs.readFileSync(filepathURL);
                    //runInNewContext
                    console.log('--1--');
                    
                    try {
                        const file = fs.readFileSync(filepathURL);
                        console.log('--2--');
                        console.log(`${saveFilename}: ${file.length}`);
                        res.attachment(saveFilename);
                        res.write(file);
                        return res.end();
                    } catch(err) {
                        console.log('readfileSync.ERR', err);
                        return next( createError(500, err.toString()) );
                    }
                   /*
                    let xfilePath = fs.createReadStream(filepathURL);
                    res.pipe(xfilePath);
                    xfilePath.on('finish', () => {
                        console.log(Date(), "finished");
                        xfilePath.close();
                    });
                    */
                    console.log('--3--');  
                } else {
                    return res.status(404).send(`No such file: "${saveFilename}"`);
                }
            } catch(e) {
                console.log('download.ERR', e);
                return next( createError(500, e.toString()) );
            }
        } else {
            return next( createError(404) );
        } 
    },

    // ========================================================================    
}

module.exports = fileservicesCtr;

function copyFileToDestination(origFile, destDir, destFile) {
    try {
        !fs.existsSync(destDir) && fs.mkdirSync(destDir, {recursive:true});
        fs.copyFileSync(origFile, destFile );
        fs.unlinkSync(origFile);
        return true;
    } catch(e) {
        console.log('UPLOAD.ERR', e);
        throw e;
    }
}
function getId(n) {
    //  http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
/*
message: 'ENOENT: no such file or directory, copyfile 'C:\\Users\\Paul\\AppData\\Local\\Temp\\upload_6f9b159bfb4cda7515ca0235ed7d9950' -> 'file://192.168.1.173/public/helpdesk/test_contract_drawings.xlsx''

*/