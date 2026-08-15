import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
const imagePath = 'public/Screenshot 2026-05-26 at 01.26.45.png';
const imagePart = {
  inlineData: {
    mimeType: 'image/png',
    data: fs.readFileSync(imagePath).toString("base64"),
  },
};

async function check() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [{
      parts: [
        imagePart,
        { text: "This is a PDF template background. Please give me the exact X and Y coordinates (in percentages, or relative to A4 size 210x297mm) where I should overlay the data (Participant Name, Club Name, Age Group, Phone, DOB, Email) and where the Events Table should start." }
      ]
    }]
  });
  console.log(response.text);
}

check().catch(console.error);
