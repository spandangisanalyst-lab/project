const sizeOf = require('image-size');
const path = require('path');

const dim1 = sizeOf(path.join(process.cwd(), 'public', '1 Temp.png'));
const dimId = sizeOf(path.join(process.cwd(), 'public', 'ID Card Temp.png'));

console.log("1 Temp:", dim1);
console.log("ID Card:", dimId);
