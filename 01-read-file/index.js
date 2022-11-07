const fs = require('fs');
const path = require('path');
const { stdout } = process;
const resText = path.join(__dirname, 'text.txt');
const resReadStream = fs.createReadStream(resText, 'utf-8');
resReadStream.on('data', data => stdout.write(data));


