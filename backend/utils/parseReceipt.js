const fs = require('fs');
const pdfParse = require('pdf-parse');

module.exports = async function parseReceipt(filePath) {
  // Basic example: if PDF -> extract text using pdf-parse. For images you'd call OCR like tesseract
  const buffer = fs.readFileSync(filePath);
  try {
    const data = await pdfParse(buffer);
    // naive: return full text for frontend to parse. For extra credit you can implement tabular CSV extraction.
    return { text: data.text };
  } catch (err) {
    // if not a PDF, return empty
    return { text: '' };
  }
};
