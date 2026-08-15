import { jsPDF } from 'jspdf';
import fs from 'fs';

const doc = new jsPDF();
doc.text("Test", 10, 10);
const buffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync('test_buffer.pdf', buffer);
console.log('Buffer size:', buffer.length);
