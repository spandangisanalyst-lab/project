import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function run() {
  const templatePath = path.join(process.cwd(), 'public', 'ID Card Temp.png');

  if (!fs.existsSync(templatePath)) {
    console.error("Missing template ID Card Temp.png!");
    return;
  }

  const prompt = `
  Analyze this ID card template we use for a swimmer card of dimensions 54mm width by 85.6mm height.
  The user wants us to place dynamic text next to the pre-printed labels on this template.
  
  Please look for:
  - "CONTACT NUMBER" label - find its Y coordinate in mm (middle of the label / text line). Same for X coordinate where the empty space right of the ":" starts.
  - "EMAIL ID" label - find its Y coordinate in mm (middle of the label / text line). Same for X coordinate where the empty space right of the ":" starts.
  - "EVENTS REGISTERED" label - find its Y coordinate in mm (middle of the label / text line). Same for X coordinate where the empty space right of the ":" starts.
  - "QR" handwriting / placement box. Find where the QR code should be placed.
  - Swimmer name text and club name text near the center. Find their best coordinates.
  - Participant photo circle. Let's see if the photCenter X, Y and Radius of 13mm is perfectly aligned with the white circle design at the top. Find the exact center and radius of the white circle at the top in mm.

  Map all of these to a scale of [54, 85.6] (width: 54mm, height: 85.6mm).
  Provide the result in JSON format:
  \`\`\`json
  {
    "name": { "x": number, "y": number },
    "club": { "x": number, "y": number },
    "phone": { "x": number, "y": number },
    "email": { "x": number, "y": number },
    "events": { "x": number, "y": number },
    "photoCenter": { "x": number, "y": number },
    "photoRadius": number,
    "qrBox": { "x": number, "y": number, "s": number }
  }
  \`\`\`
  Only return the JSON block.
  `;

  console.log("Analyzing template image with Gemini...");

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      {
        inlineData: {
          mimeType: 'image/png',
          data: fs.readFileSync(templatePath).toString('base64')
        }
      },
      { text: prompt }
    ]
  });

  console.log("Gemini Response:\n", response.text);
}

run().catch(console.error);
