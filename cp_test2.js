const fs = require('fs'), 
    os = require('os'),
    path = require('path'),
    url = require('url'),
    dotenv = require('dotenv');
dotenv.config();

let srcDirsJSON = require('./config/drive_paths_mock.json');
let srcDir = srcDirsJSON.filter( e => e.is_active == 1)[0];
console.log('srcDir', srcDir);

if(process.env.SRC_DIR) {
    console.log('>>>>', process.env.SRC_DIR);
    srcDir.server_file_path = process.env.SRC_DIR.trim();
}
// SVGPathSegCurvetoQuadraticSmoothRel


try {
    console.log(srcDir.server_file_path, fs.existsSync(srcDir.server_file_path) );
    let url1 = url.pathToFileURL(srcDir.server_file_path);
    console.log(url1, fs.existsSync(url1) );
} catch(e) {
    console.log('ERR', e);
}
