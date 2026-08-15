const Tesseract = require('tesseract.js');
const path = require('path');

async function doOCR() {
  const file1 = path.join(process.cwd(), 'public', '1 Temp.png');
  const file2 = path.join(process.cwd(), 'public', '2 Temp.png');
  const idFile = path.join(process.cwd(), 'public', 'ID Card Temp.png');

  console.log("OCR for 1 Temp.png:");
  const res1 = await Tesseract.recognize(file1, 'eng');
  console.log(res1.data.text);
  
  console.log("\nOCR for 2 Temp.png:");
  const res2 = await Tesseract.recognize(file2, 'eng');
  console.log(res2.data.text);
  
  console.log("\nOCR for ID Card Temp.png:");
  const resId = await Tesseract.recognize(idFile, 'eng');
  console.log(resId.data.text);
}

doOCR().catch(console.error);
