const createError = require('http-errors'),
    path = require('path'),
    url = require('url'),
    fileservicesModel = require('../models/fileservices.sql');

const fileservicesCtr = {
    upload: (req, res, next) => {
        const {files, fields} = req;
        console.log('ctr.upload.fields', fields);
        console.log('ctr.upload.files', files.file);

        res.json( {status:true, method:'upload', timeStamp:new Date().toUTCString()} );
    },
    download: (req, res, next) => {
        console.log('ctr.download', req.fields);

        res.json( {status:true, method:'download', timeStamp:new Date().toUTCString()} );
    }
}

module.exports = fileservicesCtr;