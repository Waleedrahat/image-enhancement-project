import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ImageFile,
  PipelineSettings,
  EnhancementMode,
  QualityLevel,
  BackgroundAction,
  BackgroundType,
  ExportFormat,
  ExpiryDuration,
  PipelinePreset,
} from '@/types';

interface WorkspaceContextType {
  // Image state
  currentImage: ImageFile | null;
  setCurrentImage: (image: ImageFile | null) => void;
  
  // Pipeline settings
  settings: PipelineSettings;
  updateEnhancement: (updates: Partial<PipelineSettings['enhancement']>) => void;
  updateBackground: (updates: Partial<PipelineSettings['background']>) => void;
  updateSecurity: (updates: Partial<PipelineSettings['security']>) => void;
  resetSettings: () => void;
  
  // Export settings
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  shareLinkExpiry: ExpiryDuration;
  setShareLinkExpiry: (expiry: ExpiryDuration) => void;
  
  // Presets
  activePreset: PipelinePreset | null;
  applyPreset: (preset: PipelinePreset) => void;
  
  // View state
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
  comparisonPosition: number;
  setComparisonPosition: (position: number) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
}

const defaultSettings: PipelineSettings = {
  enhancement: {
    enabled: true,
    mode: 'auto',
    quality: 'balanced',
  },
  background: {
    enabled: false,
    action: 'remove',
    type: 'transparent',
    edgeSmoothing: 50,
    refineEdges: true,
  },
  security: {
    enabled: false,
  },
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const pipelinePresets: PipelinePreset[] = [
  {
    id: 'default',
    name: 'Default Balanced Pipeline',
    description: 'Best for most images - balanced quality and speed',
    settings: {
      enhancement: { enabled: true, mode: 'auto', quality: 'balanced' },
      background: { enabled: false, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: false },
    },
  },
  {
    id: 'quick',
    name: 'Quick Process',
    description: 'Fast processing for previews',
    settings: {
      enhancement: { enabled: true, mode: 'auto', quality: 'fast' },
      background: { enabled: false, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: false },
    },
  },
  {
    id: 'maximum',
    name: 'Maximum Quality',
    description: 'Best quality with all enhancements',
    settings: {
      enhancement: { enabled: true, mode: 'auto', quality: 'high' },
      background: { enabled: true, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: false },
    },
  },
  {
    id: 'secure-share',
    name: 'Secure Share',
    description: 'Enhanced with encryption for secure sharing',
    settings: {
      enhancement: { enabled: true, mode: 'auto', quality: 'balanced' },
      background: { enabled: false, action: 'remove', type: 'transparent', edgeSmoothing: 50, refineEdges: true },
      security: { enabled: true },
    },
  },
];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentImage, setCurrentImage] = useState<ImageFile | null>(null);
  const [settings, setSettings] = useState<PipelineSettings>(defaultSettings);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [shareLinkExpiry, setShareLinkExpiry] = useState<ExpiryDuration>('24h');
  const [activePreset, setActivePreset] = useState<PipelinePreset | null>(pipelinePresets[0]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(100);

  const updateEnhancement = useCallback((updates: Partial<PipelineSettings['enhancement']>) => {
    setSettings(prev => ({
      ...prev,
      enhancement: { ...prev.enhancement, ...updates },
    }));
    setActivePreset(null);
  }, []);

  const updateBackground = useCallback((updates: Partial<PipelineSettings['background']>) => {
    setSettings(prev => ({
      ...prev,
      background: { ...prev.background, ...updates },
    }));
    setActivePreset(null);
  }, []);

  const updateSecurity = useCallback((updates: Partial<PipelineSettings['security']>) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, ...updates },
    }));
    setActivePreset(null);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    setActivePreset(pipelinePresets[0]);
  }, []);

  const applyPreset = useCallback((preset: PipelinePreset) => {
    setSettings(prev => ({
      ...prev,
      ...preset.settings,
      enhancement: { ...prev.enhancement, ...preset.settings.enhancement },
      background: { ...prev.background, ...preset.settings.background },
      security: { ...prev.security, ...preset.settings.security },
    }));
    setActivePreset(preset);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        currentImage,
        setCurrentImage,
        settings,
        updateEnhancement,
        updateBackground,
        updateSecurity,
        resetSettings,
        exportFormat,
        setExportFormat,
        shareLinkExpiry,
        setShareLinkExpiry,
        activePreset,
        applyPreset,
        showComparison,
        setShowComparison,
        comparisonPosition,
        setComparisonPosition,
        zoomLevel,
        setZoomLevel,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
