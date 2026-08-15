const { jsPDF } = require('jspdf');
const fs = require('fs');

const doc = new jsPDF();
doc.rect(10, 10, 50, 50);
try {
  doc.circle(35, 35, 20);
  doc.clip();
  console.log("clip() success");
} catch(e) {
  console.log("clip() failed:", e.message);
}
