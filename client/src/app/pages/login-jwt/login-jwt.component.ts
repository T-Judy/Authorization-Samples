import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-login-jwt',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h2 class="mb-1">JWT Login</h2>
        <p class="text-muted mb-4">Login once to receive a signed access token and a refresh token.</p>

        @if (messages.error()) {
          <div class="alert alert-danger">{{ messages.error() }}</div>
        }

        <div class="card">
          <div class="card-body">
            <form (ngSubmit)="submit()">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input
                  name="username"
                  [(ngModel)]="username"
                  type="text"
                  class="form-control"
                  autofocus
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  name="password"
                  [(ngModel)]="password"
                  type="password"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
                {{ loading ? 'Signing in…' : 'Login & Get JWT' }}
              </button>
            </form>
            <p class="small text-muted mt-3 mb-0">Demo account: <code>demo</code> / <code>demo123</code></p>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">What happens when you submit</div>
          <div class="card-body small text-muted">
            <ol class="mb-0">
              <li>The Express server checks the username and password against its user table</li>
              <li>
                On success, it signs a token pair with <code>jsonwebtoken</code> using a secret
                that never leaves the server
              </li>
              <li>Nothing is written to a database</li>
              <li>
                The access token (15 min) and refresh token (7 days) come back in the response and
                are saved to the auth service
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginJwtComponent {
  username = '';
  password = '';
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    readonly messages: MessagesService,
  ) {}

  async submit(): Promise<void> {
    this.messages.clear();
    this.loading = true;
    const ok = await this.auth.loginJwt(this.username, this.password);
    this.loading = false;
    if (ok) {
      this.router.navigate(['/jwt/dashboard']);
    }
  }
}
