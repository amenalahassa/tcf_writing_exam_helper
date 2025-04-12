// src/types/config.ts
export interface AppConfig {
    openai: {
        apiKey: string;
        model: string;
    };
}

export interface FormConfig {
    minLength: number;
    maxLength: number;
}

export type EvaluationResult = {
    score: number;
    strongPoints: string[];
    weakPoints: string[];
}

export type WritingSituation = {
    prompt: string;
    requirements: string;
}