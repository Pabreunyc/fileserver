const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    url = require('url');

const SRCDIR = process.cwd();

const fileURL = 'file://192.168.1.173/public/', 
    localfileURL = 'file://localhost/mnt/cbg_masterdoc/',
    srcDir = path.join(SRCDIR, 'public/data'),
    destDir = 'Z:/public';
const file1 = 'foo_01.txt', urlfile = 'fmio-hiw-step5.png';


console.log('-------------------------------------------------------------------------------');
//console.log('Win32', path.win32);

const f1 = path.join(srcDir, file1),
    f2  = fileURL + urlfile;

console.log('f1:', f1, '>>', fs.existsSync(f1));

console.group('f2');
console.log(f2, '>>', fs.existsSync(f2));
console.log(f2, '>>', fs.existsSync(url.fileURLToPath(f2)) );
console.log(fileURL, '>>', fs.existsSync(url.fileURLToPath(fileURL)) );
console.groupEnd();

let f1parsed = path.parse(f1);
let fnew = f1parsed.name + '_' + Date.now() + f1parsed.ext;
let fdst = fileURL + fnew;
fdst = localfileURL + fnew;
console.log('f1parsed:', f1parsed, fnew, fdst);

//let x1 = new URL(localfileURL + 'destFile.txt');
//console.log('new:', localfileURL, x1 );
//console.log('read:', fs.readFileSync(x1) );
let x1 = new URL('file:///C:/Users/Paul/Desktop/Shows%20I%20Watch');
let x2 = new URL('file://192.168.1.170/mnt/cbg_masterdoc/destFile.txt');
let x3 = new URL(fileURL)
console.log('x1', x1);
console.log('read', fs.readFileSync(x1) );
console.log('x2', x2);
console.log('exists.x2', fs.existsSync(x2) );
try {
    fs.appendFileSync(x2, Date());
} catch(e) {
    console.log('append.x2', e);
}

let src1 = path.join(srcDir, 'foo_01.txt');
let dst1 = new URL('file://192.168.1.173/public/foo_' + Date.now() + '.txt');
console.log('s => d', src1, dst1);
try {
    fs.copyFileSync(src1, dst1);
} catch(e) {
    console.log('ERR', e);
}

try {
    let newFile = 'foo_' + Math.random() + '.txt';
    let sf = path.join(srcDir, 'foo_01.txt');
    let xbase = 'file://192.168.1.173/public/';
    xbase = 'file://192.168.1.179/Users/Public/Downloads/';
    let dd = new URL(xbase + 'helpdesk/');
    let df = new URL(xbase + newFile);
    let df2 = new URL(dd.href + newFile),
        df3 = dd.href + newFile;        
    
    console.group('COPY');
    console.log(dd.href); console.log(df.href); console.log(df2.href); console.log(df3); console.log(sf);
    console.groupEnd();

    //HTMLFormControlsCollection
    fs.mkdirSync(dd, {recursive:true, mode:0o777});
    //console.log(dd, fs.existsSync(dd) );

    fs.copyFileSync(sf, df2);

} catch(e) {
    console.log('new url', e);
}
console.log('outside:', df3);