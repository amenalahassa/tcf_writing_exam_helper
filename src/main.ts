

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to all DOM elements
    const configForm = document.getElementById('config-form') as HTMLFormElement;
    const minInput = document.getElementById('min-chars') as HTMLInputElement;
    const maxInput = document.getElementById('max-chars') as HTMLInputElement;
    const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
    const appContainer = document.getElementById('app') as HTMLDivElement;

    // Hide the textarea initially
    const textareaSection = document.getElementById('textarea-section') as HTMLDivElement;
    textareaSection.style.display = 'none';

    // Handle form submission
    configForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const minChars = parseInt(minInput.value) || 0;
        const maxChars = parseInt(maxInput.value) || Infinity;

        if (maxChars < minChars) {
            alert('Maximum characters cannot be less than minimum characters');
            return;
        }

        // Hide config form and show textarea
        configForm.style.display = 'none';
        textareaSection.style.display = 'block';

        // Initialize the character counter
        new CharacterCounter('text-input', 'counter', {
            minLength: minChars,
            maxLength: maxChars,
            warnThreshold: 0.8
        });
    });
});

interface CounterOptions {
    minLength?: number;
    maxLength?: number;
    warnThreshold?: number;
}

class CharacterCounter {
    private textarea: HTMLTextAreaElement;
    private counter: HTMLElement;
    private minLength: number;
    private maxLength: number;
    private warnThreshold: number;

    constructor(textareaId: string, counterId: string, options: CounterOptions = {}) {
        this.textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        this.counter = document.getElementById(counterId) as HTMLElement;
        this.minLength = options.minLength || 0;
        this.maxLength = options.maxLength || Infinity;
        this.warnThreshold = options.warnThreshold || 0.8;

        this.setupUI();
        this.setupEvents();
        this.updateCounter();
    }

    private setupUI(): void {
        // Add helper text showing the limits
        const limitsInfo = document.createElement('div');
        limitsInfo.style.marginBottom = '10px';
        limitsInfo.textContent = `Minimum: ${this.minLength} chars | Maximum: ${this.maxLength === Infinity ? 'none' : this.maxLength} chars`;
        this.textarea.before(limitsInfo);
    }

    private setupEvents(): void {
        this.textarea.addEventListener('input', () => this.updateCounter());
        this.textarea.addEventListener('paste', () => this.updateCounter());
        this.textarea.addEventListener('cut', () => this.updateCounter());
    }

    private updateCounter(): void {
        const length = this.textarea.value.length;
        let message = `${length}`;
        let color = '';

        // Check minimum length
        if (length < this.minLength) {
            color = 'red';
            message += ` (need ${this.minLength - length} more)`;
        }
        // Check maximum length
        else if (length > this.maxLength) {
            color = 'red';
            message += ` (${length - this.maxLength} over limit)`;
        }
        // Check warning threshold (only if we have a maxLength)
        else if (this.maxLength !== Infinity && length > this.maxLength * this.warnThreshold) {
            color = 'orange';
            const remaining = this.maxLength - length;
            message += remaining > 0 ? ` (${remaining} remaining)` : '';
        }

        this.counter.textContent = message;
        this.counter.style.color = color;

        // Optional: Add/remove a class to the textarea based on validation
        if (length < this.minLength || length > this.maxLength) {
            this.textarea.classList.add('invalid');
        } else {
            this.textarea.classList.remove('invalid');
        }
    }
}