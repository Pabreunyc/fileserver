const express = require('express'),
    formidableMW = require('express-formidable');
const fileservicesCtr = require('../controllers/filservices.controller');

const router = express.Router();

router.use(formidableMW({
    hash:'md5',
    multiples: true
}) );

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

module.exports = router;
