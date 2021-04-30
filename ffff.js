const fs = require('fs'), url = require('url');

const filepath = "file://192.168.1.173/public/cbg_masterdoc/helpdesk/1651971_oabnsh36eljxc5a4fapph.xlsx";
const filepath2 = "file://192.168.1.173/public/cbg_masterdoc";

let a = new URL(filepath);

if(fs.existsSync(a)) {
	console.log('exists!');
} else {
	console.log('nope');
}

let bu = fs.readFileSync(a);
console.log(bu);
