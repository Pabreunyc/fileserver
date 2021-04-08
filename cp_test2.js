const fs = require('fs'), 
    os = require('os'),
    path = require('path'),
    url = require('url');

let srcDir = [
    path.join(process.cwd(), '_uploads'),
    "y:",
    'file://192.168.1.179/Users/Public/Downloads/helpdesk/'
];

try {
    console.log(srcDir[2], fs.existsSync(new URL(srcDir[2])) );
} catch(e) {
    console.log('ERR', e);
}