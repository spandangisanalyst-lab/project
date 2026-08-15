import { jsPDF } from 'jspdf';
import fs from 'fs';

try {
  const doc = new jsPDF();
  const imgData = fs.readFileSync('public/1.png').toString('base64');
  doc.addImage('data:image/png;base64,' + imgData, 'PNG', 0, 0, 210, 297);
  doc.text("HELLO WORLD", 10, 10);
  doc.save('test.pdf');
  console.log('PDF Generated Successfully');
} catch (e) {
  console.error(e);
}
