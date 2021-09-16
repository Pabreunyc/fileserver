const express = require('express'),
    formidableMW = require('express-formidable'),
    jwt = require('jsonwebtoken'),
    mysql = require('mysql'),
    conn = require('../controllers/dbconnection');

const fileservicesCtr = require('../controllers/filservices.controller');
const drivePaths = require('../config/drive_paths_mock.json');

const router = express.Router();
//console.log(__filename, __dirname);

const useFormidableMW = (req, res, next) => {
    console.log('useFormidableMW');
    formidableMW({
        hash:'md5',
        multiples: true
    });
    return next;
}

router.use((req, res, next) => {
    console.log(`${Date.now()} - router.use: ${req.method}`);
    
    let activeDrivePath = drivePaths.filter(e => e.is_active == 1);
    activeDrivePath = activeDrivePath[activeDrivePath.length -1];
    res.locals.activeDrivePath = activeDrivePath.server_file_path.toLowerCase();
    
    next();
});

const mwFunc = (req, res, next) => {
    console.log('running mwFunc');
    return next();
}
/* GET users listing. */
router.route('/')
    .get( (req, res, next) => {
        res.send(`${req.method}: filservices API`);
    })
    .post((req,res,next) => {
        const { files, fields } = req;
        let x = Math.random();

        console.log('file:', files);

        res.send(`${req.method}: filservices API`);
    });

router.post('/upload', formidableMW({hash:'md5'}),  fileservicesCtr.upload);
router.post('/uploadMulti', formidableMW({hash:'md5', multiples:true}),  fileservicesCtr.uploadMulti);
router.post('/download', formidableMW(), fileservicesCtr.download);

router.get('/modules', mwFunc, fileservicesCtr.getModulesList);
router.get('/directory', fileservicesCtr.getDirectoryListing);

module.exports = router;
