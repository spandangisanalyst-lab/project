// @ts-nocheck
import * as faceapi from '@vladmandic/face-api';
import { Canvas, Image, ImageData, loadImage } from 'canvas';
import fs from 'fs';

// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function run() {
    try {
        console.log("Loading models...");
        const modelPath = './node_modules/@vladmandic/face-api/model';
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        console.log("Models loaded successfully");

        // mock test
        // const img = await loadImage('someBase64');
        // const detections = await faceapi.detectAllFaces(img as any).withFaceLandmarks().withFaceDescriptors();
    } catch(err) {
        console.error(err);
    }
}
run();
