// Theme types

export interface ThemeBreakpoints {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}

export interface ThemeCustomizableField {
  type: 'color' | 'font' | 'size' | 'select';
  label: string;
  default: string;
  options?: string[]; // For select type
}

export interface ThemeManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  breakpoints?: ThemeBreakpoints;
  customizable?: Record<string, ThemeCustomizableField>;
}

export interface InstalledTheme {
  id: string;
  version: string;
  active: boolean;
  installedAt: string;
  installedBy: string;
  customizations: Record<string, string>;
  manifest: ThemeManifest;
  updatedAt?: string;
  updatedBy?: string;
  releaseUrl?: string;
}

export interface ThemeRegistryEntry {
  id: string;
  name: string;
  description: string;
  latestVersion: string;
  author: string;
  githubRepo: string;
  releaseUrl: string;
  previewUrl?: string;
}
