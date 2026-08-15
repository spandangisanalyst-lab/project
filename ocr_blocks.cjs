const Tesseract = require('tesseract.js');
const path = require('path');

async function doOCR() {
  const file1 = path.join(process.cwd(), 'public', '1 Temp.png');
  const res1 = await Tesseract.recognize(file1, 'eng');
  
  const idFile = path.join(process.cwd(), 'public', 'ID Card Temp.png');
  const res2 = await Tesseract.recognize(idFile, 'eng');
  
  console.log("=== 1 Temp.png ===");
  res1.data.blocks.forEach(b => {
      b.paragraphs.forEach(p => {
          p.lines.forEach(l => {
              console.log(`[${l.bbox.x0}, ${l.bbox.y0}] ${l.text.trim()}`);
          });
      });
  });
  
  console.log("=== ID Card Temp.png ===");
  res2.data.blocks.forEach(b => {
      b.paragraphs.forEach(p => {
          p.lines.forEach(l => {
              console.log(`[${l.bbox.x0}, ${l.bbox.y0}] ${l.text.trim()}`);
          });
      });
  });
}

doOCR().catch(console.error);
