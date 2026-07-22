const fs = require('fs');
const path = require('path');

const logPath = 'C:\\\\Users\\\\UNS_CT\\\\.gemini\\\\antigravity-ide\\\\brain\\\\9ddfee33-29b7-4d08-a0b2-3a97a9f99620\\\\.system_generated\\\\logs\\\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

let ocrText = '';
for (const line of lines) {
    if (!line) continue;
    try {
        const obj = JSON.parse(line);
        if (obj.content && obj.content.includes('==Start of PDF==')) {
            ocrText += obj.content + '\n';
        }
    } catch (e) {}
}

fs.writeFileSync(path.join(__dirname, 'memmoread_ocr.txt'), ocrText);
console.log('Saved OCR text, length: ' + ocrText.length);
