const express = require('express'),
    dbCtr = require('../controllers/db.controller');

const router = express.Router();

router.route('/')
    .get(dbCtr.base)
    .post(dbCtr.base);

router.post('/saveInfo', dbCtr.saveInfo);

router.get('/getFilesHelpdesk', dbCtr.getAllFiles);
router.get('/getFilesMaintenance', dbCtr.getAllFiles);

module.exports = router;