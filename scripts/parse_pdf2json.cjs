const fs = require('fs');
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    const rawText = pdfParser.getRawTextContent();
    fs.writeFileSync("./memmoread_extracted.txt", rawText);
    console.log('done, text length:', rawText.length);
});

pdfParser.loadPDF("../PDF/memmoread-oxford-3000.pdf");
