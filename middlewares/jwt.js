const jwtconfig = require('../config/jwt.config.json'),
    jwt = require('jsonwebtoken');

function generateToken()  {

}

const checkToken = (req, res, next) => {    
    if(req.headers.hasOwnProperty('authorization')) {
        console.log('jwt.js:', req.headers);
    }

    return next();
}

module.exports = {
    generateToken: generateToken,
    checkToken: checkToken
}