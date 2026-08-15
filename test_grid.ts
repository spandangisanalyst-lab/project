import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function main() {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const w = parseInt(doc.internal.pageSize.getWidth().toString()) || 210;
  const h = parseInt(doc.internal.pageSize.getHeight().toString()) || 297;

  try {
    const bgImg1 = fs.readFileSync(path.join(process.cwd(), 'public', '1 Temp.png')).toString('base64');
    doc.addImage('data:image/png;base64,' + bgImg1, 'PNG', 0, 0, w, h);
  } catch(e) { console.warn("Template 1 not found on disk"); }

  doc.setDrawColor(255, 0, 0);
  doc.setLineWidth(0.1);
  for (let x = 0; x < w; x += 10) {
      doc.line(x, 0, x, h);
      doc.text(x.toString(), x, 5);
  }
  for (let y = 0; y < h; y += 10) {
      doc.line(0, y, w, y);
      doc.text(y.toString(), 5, y);
  }

  fs.writeFileSync('grid_1.pdf', Buffer.from(doc.output('arraybuffer')));
  console.log("Grid 1 done");

  const doc2 = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  try {
    const bgImg2 = fs.readFileSync(path.join(process.cwd(), 'public', '2 Temp.png')).toString('base64');
    doc2.addImage('data:image/png;base64,' + bgImg2, 'PNG', 0, 0, w, h);
  } catch(e) { console.warn("Template 2 not found on disk"); }
  doc2.setDrawColor(255, 0, 0);
  doc2.setLineWidth(0.1);
  for (let x = 0; x < w; x += 10) {
      doc2.line(x, 0, x, h);
      doc2.text(x.toString(), x, 5);
  }
  for (let y = 0; y < h; y += 10) {
      doc2.line(0, y, w, y);
      doc2.text(y.toString(), 5, y);
  }
  fs.writeFileSync('grid_2.pdf', Buffer.from(doc2.output('arraybuffer')));
  console.log("Grid 2 done");

  const cW = 54;
  const cH = 85.6;
  const doc3 = new jsPDF({ orientation: 'p', unit: 'mm', format: [cW, cH] });
  try {
    const bgImg = fs.readFileSync(path.join(process.cwd(), 'public', 'ID Card Temp.png')).toString('base64');
    doc3.addImage('data:image/png;base64,' + bgImg, 'PNG', 0, 0, cW, cH);
  } catch(e) { console.warn("Template 3 not found on disk"); }
  doc3.setDrawColor(255, 0, 0);
  doc3.setLineWidth(0.1);
  doc3.setFontSize(5);
  for (let x = 0; x < cW; x += 5) {
      doc3.line(x, 0, x, cH);
      doc3.text(x.toString(), x, 2);
  }
  for (let y = 0; y < cH; y += 5) {
      doc3.line(0, y, cW, y);
      doc3.text(y.toString(), 2, y);
  }

  fs.writeFileSync('grid_id.pdf', Buffer.from(doc3.output('arraybuffer')));
  console.log("Grid ID done");
}

main().catch(console.error);
