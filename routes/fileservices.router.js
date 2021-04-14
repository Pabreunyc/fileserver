const express = require('express'),
    formidableMW = require('express-formidable');
const fileservicesCtr = require('../controllers/filservices.controller');


const router = express.Router();
console.log(__filename, __dirname);

router.use(formidableMW({
    hash:'md5',
    multiples: true
}) );
router.use((req, res, next) => {
    res.locals.myVar = new Date().toLocaleString();
    res.locals.drivePaths = drivePathsJSON;
    res.locals.activeDrivePath = drivePathsJSON.filter(e => e.is_active == 1)[0];

    console.log('[DEST_DIR]:', process.env.DEST_DIR);
    console.log('[WINDIR]:', process.env.WINDIR);
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
router.get('/download', fileservicesCtr.download);

router.get('/modules', fileservicesCtr.getModulesList);

module.exports = router;
