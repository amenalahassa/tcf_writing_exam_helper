import OpenAI from "openai";
import config from "../constants/config.json"
import format from 'string-format'
import {EvaluationResult, WritingSituation} from "./config";

export async function generateWritingSituation(openAiClient: OpenAI, openAiConfig: any): Promise<WritingSituation> {
    let parsedResponse: WritingSituation | any = {
        prompt: "Vous avez récemment visité un pays francophone. Racontez votre expérience à un ami en décrivant :\n- Un lieu que vous avez visité\n- Une spécialité culinaire que vous avez goûtée\n- Une rencontre intéressante",
        requirements: "Utilisez un langage clair et varié. Employez au moins 3 temps verbaux différents."
    };

    try {
        const response = await openAiClient.responses.create({
            model: openAiConfig.model,
            instructions: config.openai.writing_situation.instruction,
            input: config.openai.writing_situation.prompt,
            text: {
                "format": {
                    "type": "json_schema",
                    "name": "writing_situation",
                    "schema": config.openai.writing_situation.format,
                    "strict": true
                }
            }
        });

         parsedResponse = JSON.parse(response.output_text);
    }
    catch (error) {
        console.error("Error generating writing situation:", error);
        // throw new Error("Error generating writing situation");
    }

    return {
        prompt: parsedResponse.prompt,
        requirements: parsedResponse.requirements,
    }
}

export async function evaluateWriting(openAiClient: OpenAI, openAiConfig: any, context: any): Promise<EvaluationResult> {
    let parsedResponse: EvaluationResult | any = {
        score: 0,
        strongPoints: [],
        weakPoints: []
    }

    try {
        const response = await openAiClient.responses.create({
            model: openAiConfig.model,
            instructions: config.openai.evaluation.instruction,
            input: format(config.openai.evaluation.prompt, context),
            text: {
                "format": {
                    "type": "json_schema",
                    "name": "evaluation",
                    "schema": config.openai.evaluation.format,
                    "strict": true
                }
            }
        });

        parsedResponse = JSON.parse(response.output_text);
    }
    catch (error) {
        console.error("Error evaluating writing:", error);
        // throw new Error("Error evaluating writing");
    }

    return {
        score: parsedResponse.score,
        strongPoints: parsedResponse.strongPoints,
        weakPoints: parsedResponse.weakPoints,
    }
}