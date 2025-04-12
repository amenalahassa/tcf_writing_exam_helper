import {getConfig} from './utils/env';
import {getOpenAIClient} from "./types/helpers";
import {EvaluationResult, FormConfig, WritingSituation} from "./types/config";
import {evaluateWriting, generateWritingSituation} from "./types/openai";


class TCFWritingHelper {
    private config: FormConfig = { minLength: 100, maxLength: 300 };
    private currentSituation: WritingSituation | null = null;

    // Éléments du DOM
    private situationTextEl: HTMLElement;
    private configForm: HTMLFormElement;
    private writingSection: HTMLElement;
    private resultSection: HTMLElement;
    private textarea: HTMLTextAreaElement;
    private counterEl: HTMLElement;
    private scoreDisplay: HTMLElement;
    private feedbackText: HTMLElement;
    private envKey: any;
    private openAiClient: any;

    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.generateSituation();
        this.envKey = getConfig();
        this.openAiClient = getOpenAIClient(this.envKey.openai.apiKey);
    }

    private initializeElements(): void {
        this.situationTextEl = document.getElementById('situation-text')!;
        this.configForm = document.getElementById('config-form') as HTMLFormElement;
        this.writingSection = document.getElementById('writing-section')!;
        this.resultSection = document.getElementById('result-section')!;
        this.textarea = document.getElementById('text-input') as HTMLTextAreaElement;
        this.counterEl = document.getElementById('counter')!;
        this.scoreDisplay = document.getElementById('score-display')!;
        this.feedbackText = document.getElementById('feedback-text')!;
    }

    private setupEventListeners(): void {
        this.configForm.addEventListener('submit', (e) => this.handleConfigSubmit(e));
        document.getElementById('regenerate-btn')!.addEventListener('click', () => this.generateSituation());
        document.getElementById('restart-btn')!.addEventListener('click', () => this.restartExercise());
        document.getElementById('submit-btn')!.addEventListener('click', () => this.submitForEvaluation());

        this.textarea.addEventListener('input', () => this.updateCounter());
        this.textarea.addEventListener('paste', () => this.updateCounter());
        this.textarea.addEventListener('cut', () => this.updateCounter());
    }

    private async generateSituation(): Promise<void> {
        this.situationTextEl.textContent = "Génération de la situation...";

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            this.currentSituation = await generateWritingSituation(this.openAiClient, this.envKey.openai);

            this.situationTextEl.innerHTML = `
                <p><strong>Consigne :</strong> ${this.currentSituation.prompt}</p>
                <p><strong>Exigences :</strong> ${this.currentSituation.requirements}</p>
              `;
        } catch (error) {
            this.situationTextEl.textContent = "Erreur lors de la génération de la situation. Veuillez réessayer.";
            console.error(error);
        }
    }

    private handleConfigSubmit(e: Event): void {
        e.preventDefault();

        const minChars = parseInt((document.getElementById('min-chars') as HTMLInputElement).value) || 0;
        const maxCharsInput = (document.getElementById('max-chars') as HTMLInputElement).value;
        const maxChars = maxCharsInput ? parseInt(maxCharsInput) : Infinity;

        if (maxChars < minChars) {
            alert('Le nombre maximum de caractères ne peut pas être inférieur au minimum');
            return;
        }

        this.config = { minLength: minChars, maxLength: maxChars };
        this.configForm.classList.add('hidden');
        this.writingSection.classList.remove('hidden');
        this.textarea.value = '';
        this.updateCounter();
    }

    private updateCounter(): void {
        const length = this.textarea.value.length;
        let message = `${length}`;
        let color = '';

        if (length < this.config.minLength) {
            color = '#e74c3c';
            message += ` (${this.config.minLength - length} caractères manquants)`;
        } else if (length > this.config.maxLength) {
            color = '#e74c3c';
            message += ` (${length - this.config.maxLength} caractères en trop)`;
        } else if (this.config.maxLength !== Infinity && length > this.config.maxLength * 0.8) {
            color = '#f39c12';
            const remaining = this.config.maxLength - length;
            message += remaining > 0 ? ` (${remaining} restants)` : '';
        }

        this.counterEl.textContent = message;
        this.counterEl.style.color = color;
        this.textarea.classList.toggle('invalid', length < this.config.minLength || length > this.config.maxLength);
    }

    private async submitForEvaluation(): Promise<void> {
        const text = this.textarea.value.trim();

        if (text.length < this.config.minLength) {
            alert(`Votre texte est trop court. Il doit contenir au moins ${this.config.minLength} caractères.`);
            return;
        }

        if (text.length > this.config.maxLength) {
            alert(`Votre texte est trop long. Il ne doit pas dépasser ${this.config.maxLength} caractères.`);
            return;
        }

        if (!this.currentSituation) {
            alert("Veuillez générer une situation d'écriture avant de soumettre votre texte.");
            return;
        }

        this.writingSection.classList.add('hidden');
        this.resultSection.classList.remove('hidden');
        this.scoreDisplay.textContent = "Évaluation en cours...";
        this.feedbackText.textContent = "";

        // Envoi du texte à OpenAI pour évaluation
        const context = {
            writing_situation: this.currentSituation?.prompt,
            user_writing_task: text
        }

        try {
            // Simulation d'un appel API à OpenAI pour l'évaluation
            // En production, remplacer par un vrai appel API
            await new Promise(resolve => setTimeout(resolve, 2000));

            const evaluationResult = await evaluateWriting(this.openAiClient, this.envKey.openai, context);

            this.displayEvaluationResult(evaluationResult);
        } catch (error) {
            this.scoreDisplay.textContent = "Erreur lors de l'évaluation";
            this.feedbackText.textContent = "Une erreur s'est produite lors de l'évaluation de votre texte. Veuillez réessayer.";
            console.error(error);
        }
    }

    private displayEvaluationResult(result: EvaluationResult): void {
        this.scoreDisplay.innerHTML = `Note: <span style="color: ${this.getScoreColor(result.score)}">${result.score}/10</span>`;
        if (result.strongPoints.length > 0 && result.weakPoints.length > 0) {
            const weekPoints = result.weakPoints.map(point => `<li>${point}</li>`).join('');
            const strongPoints = result.strongPoints.map(point => `<li>${point}</li>`).join('');
            this.feedbackText.innerHTML = `
            <h3>Points forts :</h3>
            <ul>${strongPoints}</ul>
            <h3>Points à améliorer :</h3>
            <ul>${weekPoints}</ul>
        `;
        }
        else {
            this.feedbackText.innerHTML = `
            <h3>Resultat de l'évaluation :</h3>
            <p>Aucun point fort identifié.</p>
        `;
        }

    }

    private getScoreColor(score: number): string {
        if (score >= 8) return '#27ae60';
        if (score >= 5) return '#f39c12';
        return '#e74c3c';
    }

    private restartExercise(): void {
        this.resultSection.classList.add('hidden');
        this.configForm.classList.remove('hidden');
        this.generateSituation();
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new TCFWritingHelper();
});