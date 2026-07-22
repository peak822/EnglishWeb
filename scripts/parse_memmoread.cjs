const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const pdfPath = path.join(__dirname, '../PDF/memmoread-oxford-3000.pdf');
const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync(path.join(__dirname, 'memmoread_text.txt'), data.text);
    console.log('Extracted text to memmoread_text.txt');
});
