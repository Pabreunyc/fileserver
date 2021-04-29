const express = require('express'),
    formidableMW = require('express-formidable'),
    drivePaths = require('../config/drive_paths_mock.json');
const fileservicesCtr = require('../controllers/filservices.controller');

const router = express.Router();
//console.log(__filename, __dirname);

router.use(formidableMW({
    hash:'md5',
    multiples: true
}) );
router.use((req, res, next) => {
    let activeDrivePath = drivePaths.filter(e => e.is_active == 1);
    activeDrivePath = activeDrivePath[activeDrivePath.length -1];
    res.locals.activeDrivePath = activeDrivePath.server_file_path.toLowerCase();
    next();
})
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

router.post('/upload', fileservicesCtr.upload);
router.post('/download', fileservicesCtr.download);

router.get('/modules', fileservicesCtr.getModulesList);
router.get('/directory', fileservicesCtr.getDirectoryListing);

module.exports = router;
