
export interface DepthSettings {
  offset: number; // 0-100, interpreted in prompt
}

export interface LightSettings {
  enabled: boolean;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  color: string; // hex color
  intensity: number; // 0-100
}
