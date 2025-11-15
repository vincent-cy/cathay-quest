/**
 * Naevv AI Assistant Configuration
 * This file handles the configuration for the Naevv AI Assistant
 */

export interface NaevvConfig {
  apiKey: string | null;
  llmBoundary: string | null;
  isConfigured: boolean;
}

const defaultConfig: NaevvConfig = {
  apiKey: null,
  llmBoundary: null,
  isConfigured: false,
};

/**
 * Get Naevv configuration from localStorage
 */
export const getNaevvConfig = (): NaevvConfig => {
  const stored = localStorage.getItem("naevv_config");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse Naevv config:", error);
      return defaultConfig;
    }
  }
  return defaultConfig;
};

/**
 * Save Naevv configuration to localStorage
 */
export const saveNaevvConfig = (config: Partial<NaevvConfig>): NaevvConfig => {
  const currentConfig = getNaevvConfig();
  const updatedConfig: NaevvConfig = {
    ...currentConfig,
    ...config,
    isConfigured: !!(config.apiKey && config.llmBoundary),
  };
  localStorage.setItem("naevv_config", JSON.stringify(updatedConfig));
  return updatedConfig;
};

/**
 * Clear Naevv configuration
 */
export const clearNaevvConfig = (): void => {
  localStorage.removeItem("naevv_config");
};

/**
 * Check if Naevv is properly configured
 */
export const isNaevvConfigured = (): boolean => {
  const config = getNaevvConfig();
  return config.isConfigured && !!config.apiKey && !!config.llmBoundary;
};
