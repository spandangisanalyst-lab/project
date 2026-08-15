import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
async function check() {
  const imagePart = {
    inlineData: { mimeType: 'image/png', data: fs.readFileSync('public/2.png').toString("base64") },
  };
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [{ parts: [ imagePart, { text: "Give me the exact numerical coordinates in percentages (X and Y) for the following dynamic text fields on this A4 receipt page: Participant Photo, Participant Name, Affiliation, Contact Number, Email ID, Events, QR Code." } ] }]
  });
  console.log(response.text);
}
check().catch(console.error);
