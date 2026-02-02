interface ErrorRecoveryConfig {
  maxRetries: number;
  retryDelayMs: number;
}

const DEFAULT_CONFIG: ErrorRecoveryConfig = {
  maxRetries: 3,
  retryDelayMs: 2000,
};

export class ConversationErrorHandler {
  private retryCount = 0;
  private config: ErrorRecoveryConfig;

  constructor(config: Partial<ErrorRecoveryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async handleError(error: Error, retryFn: () => Promise<void>): Promise<boolean> {
    console.error('Conversation error:', error.message);

    if (this.isRetryableError(error) && this.retryCount < this.config.maxRetries) {
      this.retryCount += 1;
      console.log(`Retrying... Attempt ${this.retryCount}/${this.config.maxRetries}`);

      await this.delay(this.config.retryDelayMs);

      try {
        await retryFn();
        this.retryCount = 0;
        return true;
      } catch (retryError) {
        return this.handleError(retryError as Error, retryFn);
      }
    }

    return false;
  }

  reset(): void {
    this.retryCount = 0;
  }

  private isRetryableError(error: Error): boolean {
    const retryableMessages = ['network', 'timeout', 'connection', 'webrtc'];
    const message = error.message.toLowerCase();

    return retryableMessages.some((fragment) => message.includes(fragment));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
