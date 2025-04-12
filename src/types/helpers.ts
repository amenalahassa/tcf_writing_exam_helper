import OpenAI from "openai";

export function getOpenAIClient(apiKey: string): OpenAI {
    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // This is security risk, use with caution. Only for development purposes.
    });
}