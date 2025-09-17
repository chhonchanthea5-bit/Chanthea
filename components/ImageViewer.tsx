
import React from 'react';

interface ImageViewerProps {
  originalImage: string;
  depthMapImage: string | null;
  finalImage: string | null;
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


const ImageCard: React.FC<{ src: string | null; title: string; isPlaceholder?: boolean }> = ({ src, title, isPlaceholder }) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="w-full aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-700">
        {src ? (
          <img src={src} alt={title} className="w-full h-full object-contain" />
        ) : (
          isPlaceholder && <span className="text-gray-500 text-sm">Waiting for generation...</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    </div>
  );
};

export const ImageViewer: React.FC<ImageViewerProps> = ({
  originalImage,
  depthMapImage,
  finalImage,
  isLoading,
  loadingMessage,
}) => {
  const displayImage = finalImage || originalImage;
  const numImages = 1 + (depthMapImage ? 1 : 0);

  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center relative">
      <div className="relative w-full max-w-2xl aspect-video rounded-xl bg-black overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-700">
        <img src={displayImage} alt="Main display" className="w-full h-full object-contain" />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <LoadingSpinner />
            <p className="mt-4 text-lg font-semibold text-white animate-pulse">{loadingMessage}</p>
          </div>
        )}
      </div>
      <div className={`w-full max-w-2xl grid grid-cols-2 gap-4 transition-opacity duration-500 ${!depthMapImage ? 'opacity-0' : 'opacity-100'}`}>
        <ImageCard src={originalImage} title="Original" />
        <ImageCard src={depthMapImage} title="Depth Map" isPlaceholder={true} />
      </div>
    </div>
  );
};
