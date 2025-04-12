// src/utils/configLoader.ts
import { AppConfig } from '../types/config';
import configData from '../constants/env.json';

let loadedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
    if (!loadedConfig) {
        loadedConfig = configData as AppConfig;

        // Validate the config
        if (!loadedConfig.openai?.apiKey) {
            throw new Error('OpenAI API key is missing in configuration');
        }
    }
    return loadedConfig;
}