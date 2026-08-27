import { Injectable, signal } from '@angular/core';

/**
 * Small shared store for transient error/status messages, equivalent to the
 * Pinia `messages` store used by the original Vue app's login pages.
 */
@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  setError(message: string): void {
    this.errorSignal.set(message);
  }

  clear(): void {
    this.errorSignal.set(null);
  }
}
