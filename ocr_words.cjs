const Tesseract = require('tesseract.js');
const path = require('path');

async function doOCR() {
  const file1 = path.join(process.cwd(), 'public', '1 Temp.png');

  console.log("OCR for 1 Temp.png:");
  const res1 = await Tesseract.recognize(file1, 'eng');
  res1.data.words.forEach(word => {
    console.log(`[${word.bbox.x0}, ${word.bbox.y0}] ${word.text}`);
  });
}

doOCR().catch(console.error);
