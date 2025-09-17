
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ImageViewer } from './components/ImageViewer';
import { ImageUploader } from './components/ImageUploader';
import { generateDepthMap, applyLighting } from './services/geminiService';
import type { LightSettings, DepthSettings } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [depthMapImage, setDepthMapImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [depthSettings, setDepthSettings] = useState<DepthSettings>({ offset: 50 });
  const [lightSettings, setLightSettings] = useState<LightSettings>({
    enabled: true,
    x: 25,
    y: 25,
    color: '#ffdd75',
    intensity: 75,
  });

  const handleImageUpload = (imageDataUrl: string, mimeType: string) => {
    setOriginalImage(imageDataUrl);
    setOriginalMimeType(mimeType);
    setDepthMapImage(null);
    setFinalImage(null);
    setError(null);
  };

  const handleAddDepth = useCallback(async () => {
    if (!originalImage || !originalMimeType) return;
    setIsLoading(true);
    setLoadingMessage('Generating 3D depth map...');
    setError(null);
    setFinalImage(null);
    try {
      const base64Data = originalImage.split(',')[1];
      const depthMapBase64 = await generateDepthMap(base64Data, originalMimeType, depthSettings);
      setDepthMapImage(`data:image/png;base64,${depthMapBase64}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate depth map. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalMimeType, depthSettings]);

  const handleApplyLight = useCallback(async () => {
    if (!originalImage || !originalMimeType) return;
    setIsLoading(true);
    setLoadingMessage('Applying custom lighting...');
    setError(null);
    try {
      const originalBase64 = originalImage.split(',')[1];
      const depthMapBase64 = depthMapImage ? depthMapImage.split(',')[1] : null;
      
      const finalImageBase64 = await applyLighting(
        originalBase64,
        originalMimeType,
        lightSettings,
        depthMapBase64
      );
      setFinalImage(`data:image/png;base64,${finalImageBase64}`);
    } catch (err) {
      console.error(err);
      setError('Failed to apply lighting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalMimeType, depthMapImage, lightSettings]);
  
  const resetApp = () => {
    setOriginalImage(null);
    setOriginalMimeType(null);
    setDepthMapImage(null);
    setFinalImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header onReset={resetApp} />
      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        <div className="flex-grow flex items-center justify-center p-4 lg:p-8 bg-black/20 overflow-auto">
          {originalImage ? (
            <ImageViewer
              originalImage={originalImage}
              depthMapImage={depthMapImage}
              finalImage={finalImage}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />
          ) : (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}
        </div>
        <ControlPanel
          isImageLoaded={!!originalImage}
          isDepthGenerated={!!depthMapImage}
          isLoading={isLoading}
          depthSettings={depthSettings}
          setDepthSettings={setDepthSettings}
          lightSettings={lightSettings}
          setLightSettings={setLightSettings}
          onAddDepth={handleAddDepth}
          onApplyLight={handleApplyLight}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
