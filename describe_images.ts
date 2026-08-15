import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

async function analyzeImage(imagePath: string, prompt: string) {
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: fs.readFileSync(imagePath).toString("base64"),
    },
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [{
      parts: [
        imagePart,
        { text: prompt }
      ]
    }]
  });
  console.log(`\n--- Analysis for ${imagePath} ---`);
  console.log(response.text);
}

async function main() {
  await analyzeImage('public/ID Card.png', "This is an ID Card template. Give me exact X and Y coordinates (in percentages or mm for standard A4) for where dynamic fields should be placed. Fields include: Participant Photo, Participant Name, Club Name, Age Group, DOB, Contact Number, Email ID, Events Registered, and QR Code.");
  await analyzeImage('public/1.png', "This is page 1 of a Registration Receipt template. Give me exact X and Y coordinates (in percentages or mm for A4) for: Registration ID, Registration Date, Participant Name, Club Name, Age Group, Phone, DOB, Email, and the start X/Y/row spacing for the Registered Events Table (Event Name, Heat Number, Lane Number).");
  await analyzeImage('public/2.png', "This is page 2 of a Registration Receipt template. What text/data if any goes here?");
}

main().catch(console.error);
