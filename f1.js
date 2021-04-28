const fs = require('fs'),
    os = require('os'),
	path = require('path'),
	url = require('url');
	
const destDir = 'file://192.168.1.173//public/';
let tmp;

console.log(`Platform: "${os.platform}"`);

try {
	tmp = fs.existsSync(destDir);
	console.log(`"${destDir}" exists!`);
} catch(e) {
	console.log('ERR', e);
}

try {
	tmp = url.fileURLToPath(destDir + Date.now());
	console.log(`mkdir: "${tmp}"`);
	fs.mkdirSync(tmp);
} catch(e) {
	console.log('ERR', e.code);
    
}
