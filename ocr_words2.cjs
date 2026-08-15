const Tesseract = require('tesseract.js');
const path = require('path');

async function doOCR() {
  const file1 = path.join(process.cwd(), 'public', '1 Temp.png');
  const res1 = await Tesseract.recognize(file1, 'eng');
  
  if (res1.data && res1.data.words) {
      res1.data.words.forEach(w => {
          console.log(`[${w.bbox.x0}, ${w.bbox.y0}] ${w.text}`);
      });
  } else {
     console.log(Object.keys(res1.data));
  }
}

doOCR().catch(console.error);
