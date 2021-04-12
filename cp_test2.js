const fs = require('fs'), 
    os = require('os'),
    path = require('path'),
    url = require('url');

let srcDirsJSON = require('./public/data/tbl_cbg_web_server_info.json');
let srcDir = srcDirsJSON.filter( e => e.is_active == 1)[0];
console.log('j:', srcDir);
// SVGPathSegCurvetoQuadraticSmoothRel


try {
    console.log(srcDir.server_file_path, fs.realpathSync(srcDir.server_file_path) );
} catch(e) {
    console.log('ERR', e);
}
