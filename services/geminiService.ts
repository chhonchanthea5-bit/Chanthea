
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { LightSettings, DepthSettings } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string): Part => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const generateDepthMap = async (
  imageBase64: string,
  mimeType: string,
  depthSettings: DepthSettings
): Promise<string> => {
  const model = 'gemini-2.5-flash-image-preview';

  const prompt = `Generate a detailed, high-contrast grayscale depth map for this image. White should represent objects closest to the camera, and black should represent objects farthest away. Adjust the depth focus based on this offset: ${depthSettings.offset} (where 0 is far focus, 100 is close focus). The output must be only the depth map image, with no surrounding text, borders, or labels.`;

  const imagePart = fileToGenerativePart(imageBase64, mimeType);

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [imagePart, { text: prompt }],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const imagePartResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
  if (imagePartResponse && imagePartResponse.inlineData) {
    return imagePartResponse.inlineData.data;
  }

  throw new Error('Could not generate depth map from the image.');
};

export const applyLighting = async (
  originalImageBase64: string,
  mimeType: string,
  lightSettings: LightSettings,
  depthMapBase64: string | null
): Promise<string> => {
  const model = 'gemini-2.5-flash-image-preview';
  
  const lightPositionX = lightSettings.x < 33 ? 'left' : lightSettings.x > 66 ? 'right' : 'center';
  const lightPositionY = lightSettings.y < 33 ? 'top' : lightSettings.y > 66 ? 'bottom' : 'middle';
  
  let positionDesc = `${lightPositionY}-${lightPositionX}`;
  if(positionDesc === 'middle-center') positionDesc = 'front';

  const intensityDesc = lightSettings.intensity < 33 ? 'soft' : lightSettings.intensity > 66 ? 'harsh' : 'moderate';
  
  let prompt = `Re-light this photo with a professional, cinematic quality.`;

  if (depthMapBase64) {
    prompt += ` Use the provided second image as a depth map to create realistic lighting and shadow falloff.`;
  }

  prompt += ` Add a custom light source with these properties:
- Color: A ${lightSettings.color} light.
- Position: Coming from the ${positionDesc} of the frame.
- Intensity: A ${intensityDesc} intensity.
The final result should be a beautifully re-lit version of the original photo. Output only the edited image.`;

  const parts: Part[] = [fileToGenerativePart(originalImageBase64, mimeType)];
  if(depthMapBase64) {
    parts.push(fileToGenerativePart(depthMapBase64, 'image/png'));
  }
  parts.push({text: prompt});

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const imagePartResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
  if (imagePartResponse && imagePartResponse.inlineData) {
    return imagePartResponse.inlineData.data;
  }
  
  throw new Error('Could not apply lighting to the image.');
};
