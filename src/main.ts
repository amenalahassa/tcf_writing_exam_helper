
interface CounterOptions {
    maxLength?: number;
    warnThreshold?: number;
}

class CharacterCounter {
    private textarea: HTMLTextAreaElement;
    private counter: HTMLElement;
    private maxLength: number | null;
    private warnThreshold: number;

    constructor(textareaId: string, counterId: string, options: CounterOptions = {}) {
        this.textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        this.counter = document.getElementById(counterId) as HTMLElement;
        this.maxLength = options.maxLength || null;
        this.warnThreshold = options.warnThreshold || 0.8; // 80% of maxLength

        this.setupEvents();
        this.updateCounter();
    }

    private setupEvents(): void {
        this.textarea.addEventListener('input', () => this.updateCounter());
        this.textarea.addEventListener('paste', () => this.updateCounter());
        this.textarea.addEventListener('cut', () => this.updateCounter());
    }

    private updateCounter(): void {
        const length = this.textarea.value.split(/\s+/).filter(word => word.length > 0).length;
        this.counter.textContent = length.toString();

        if (this.maxLength) {
            const percentage = length / this.maxLength;

            if (length > this.maxLength) {
                this.counter.style.color = 'red';
                this.counter.textContent += ` (${length - this.maxLength} over limit)`;
            } else if (percentage > this.warnThreshold) {
                this.counter.style.color = 'orange';
                this.counter.textContent += ` (${Math.round((1 - percentage) * 100)}% remaining)`;
            } else {
                this.counter.style.color = '';
            }
        }
    }
}

// Initialize the counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CharacterCounter('text-input', 'counter', {
        maxLength: 200,      // Optional: set a character limit
        warnThreshold: 0.75  // Optional: show warning at 75% of max
    });
});