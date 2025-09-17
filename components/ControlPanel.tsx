
import React from 'react';
import type { LightSettings, DepthSettings } from '../types';
import { Slider } from './Slider';

interface ControlPanelProps {
  isImageLoaded: boolean;
  isDepthGenerated: boolean;
  isLoading: boolean;
  depthSettings: DepthSettings;
  setDepthSettings: React.Dispatch<React.SetStateAction<DepthSettings>>;
  lightSettings: LightSettings;
  setLightSettings: React.Dispatch<React.SetStateAction<LightSettings>>;
  onAddDepth: () => void;
  onApplyLight: () => void;
  error: string | null;
}

const DepthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m21.17 16.83-8.17-8.17-8.17 8.17"></path>
    <path d="m2 12.5 10 10 10-10"></path>
  </svg>
);

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path><path d="M10 22h4"></path>
  </svg>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; isDisabled?: boolean }> = ({ title, icon, children, isDisabled }) => (
  <div className={`border-b border-gray-700/50 pb-6 mb-6 ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
      {icon}
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isImageLoaded,
  isDepthGenerated,
  isLoading,
  depthSettings,
  setDepthSettings,
  lightSettings,
  setLightSettings,
  onAddDepth,
  onApplyLight,
  error,
}) => {
  return (
    <aside className="w-full lg:w-80 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 p-6 overflow-y-auto flex-shrink-0">
      <div className="h-full flex flex-col">
        <Section title="3D Depth" icon={<DepthIcon />} isDisabled={!isImageLoaded || isLoading}>
          <Slider
            label="Depth Offset"
            value={depthSettings.offset}
            onChange={(e) => setDepthSettings(prev => ({ ...prev, offset: parseInt(e.target.value) }))}
            min={0}
            max={100}
            valueLabel={`${depthSettings.offset}`}
          />
          <button
            onClick={onAddDepth}
            disabled={!isImageLoaded || isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            {isDepthGenerated ? 'Update Depth' : 'Add 3D Depth'}
          </button>
        </Section>

        <Section title="Custom Light" icon={<LightbulbIcon />} isDisabled={!isImageLoaded || isLoading}>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Enable Light</label>
            <button
              onClick={() => setLightSettings(p => ({ ...p, enabled: !p.enabled }))}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${lightSettings.enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${lightSettings.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className={!lightSettings.enabled ? 'opacity-40 pointer-events-none' : ''}>
            <Slider
              label="Light X-Position"
              value={lightSettings.x}
              onChange={(e) => setLightSettings(p => ({ ...p, x: parseInt(e.target.value) }))}
            />
            <Slider
              label="Light Y-Position"
              value={lightSettings.y}
              onChange={(e) => setLightSettings(p => ({ ...p, y: parseInt(e.target.value) }))}
            />
            <Slider
              label="Intensity"
              value={lightSettings.intensity}
              onChange={(e) => setLightSettings(p => ({ ...p, intensity: parseInt(e.target.value) }))}
              valueLabel={`${lightSettings.intensity}%`}
            />
            <div className="flex items-center justify-between">
              <label htmlFor="light-color" className="text-sm text-gray-300">Light Color</label>
              <input
                id="light-color"
                type="color"
                value={lightSettings.color}
                onChange={(e) => setLightSettings(p => ({ ...p, color: e.target.value }))}
                className="w-10 h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </Section>
        
        <div className="mt-auto">
         {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <button
            onClick={onApplyLight}
            disabled={!isImageLoaded || isLoading}
            className="w-full bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
          >
            Apply Effects
          </button>
        </div>
      </div>
    </aside>
  );
};
