const Tesseract = require('tesseract.js');
const path = require('path');

async function doOCR() {
  const file1 = path.join(process.cwd(), 'public', '1 Temp.png');
  const res1 = await Tesseract.recognize(file1, 'eng');
  console.log(res1.data.tsv);
}

doOCR().catch(console.error);
