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

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Sleeping for 15 seconds to clear key rate limits...");
  await sleep(15000);

  const cleanTemplatePath = path.join(process.cwd(), 'public', 'ID Card Temp.png');
  const annotatedPath = path.join(process.cwd(), 'public', 'Screenshot 2026-05-26 at 01.27.48.png');

  if (!fs.existsSync(cleanTemplatePath) || !fs.existsSync(annotatedPath)) {
    console.error("Missing templates/screenshots!");
    return;
  }

  const prompt = `
  You are an expert design layout analyst. We are printing dynamic text elements on an ID card template of size 54.0mm width and 85.6mm height.

  We have:
  1. Annotated Screenshot: ${annotatedPath}
     In this screenshot, the user has circled text fields and placed arrows to show exactly where we should drag/place the text:
     - The printed phone number is "+91-08927119001". It is circled, with an arrow pointing down. We need to place it perfectly centered vertically with the "CONTACT NUMBER :" label and its colon on the left design.
     - The printed email is "surojitguhaneogi1000@gmail.com". It is circled, with an arrow pointing down. We need to align it perfectly next to the "EMAIL ID :" colon.
     - The printed events text is "100M FREESTYLE, 50M BUTTERFLY, 50M BACKSTROKE" in JetBrains Mono. It is circled, with an arrow pointing left and down. We need to align it perfectly next to the "EVENTS REGISTERED :" colon on the left.
     - Look at the circle drawn on bottom left with "QR" written inside and a line going to the bottom right QR code. Surojit is indicating that the QR code should be moved to the BOTTOM LEFT of the card. Let's find the correct coordinates for the QR code to sit beautifully in the bottom-left space, aligned with the rest of the layout (e.g. x around 5.0 to 10.0, y around 74.0 to 76.0, and size around 9.0).
     - Provide highly refined circular photo center {x, y} and photoRadius so that it fits exactly in the designated visual design at the top of the template.
     - Make sure name and club text centers are perfectly placed.

  Provide the exact coordinate mapping in JSON format matching the following schema structure:
  \`\`\`json
  {
    "idCard": {
      "name": { "x": number, "y": number },
      "club": { "x": number, "y": number },
      "phone": { "x": number, "y": number },
      "email": { "x": number, "y": number },
      "events": { "x": number, "y": number },
      "photoCenter": { "x": number, "y": number },
      "photoRadius": number,
      "qrBox": { "x": number, "y": number, "s": number }
    }
  }
  \`\`\`
  Only return the executable JSON block wrapped in triple backticks.
  `;

  console.log("Analyzing template and screenshot with Gemini...");
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      {
        inlineData: {
          mimeType: 'image/png',
          data: fs.readFileSync(cleanTemplatePath).toString('base64')
        }
      },
      {
        inlineData: {
          mimeType: 'image/png',
          data: fs.readFileSync(annotatedPath).toString('base64')
        }
      },
      { text: prompt }
    ]
  });

  console.log("ANALYSIS RESPONSE:\n", response.text);
}

run().catch(console.error);
