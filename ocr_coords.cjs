const Tesseract = require('tesseract.js');
const path = require('path');

async function doOCR() {
  const file1 = path.join(process.cwd(), 'public', '1 Temp.png');
  const idFile = path.join(process.cwd(), 'public', 'ID Card Temp.png');

  console.log("OCR for 1 Temp.png:");
  const res1 = await Tesseract.recognize(file1, 'eng');
  res1.data.lines.forEach(line => {
    console.log(`[${line.bbox.x0}, ${line.bbox.y0}] ${line.text}`);
  });

  console.log("\nOCR for ID Card Temp.png:");
  const resId = await Tesseract.recognize(idFile, 'eng');
  resId.data.lines.forEach(line => {
    console.log(`[${line.bbox.x0}, ${line.bbox.y0}] ${line.text}`);
  });
}

doOCR().catch(console.error);
