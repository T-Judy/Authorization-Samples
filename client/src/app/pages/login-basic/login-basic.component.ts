import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-login-basic',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h2 class="mb-1">Basic Auth Login</h2>
        <p class="text-muted mb-4">Your credentials will be base64-encoded and sent on every request.</p>

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
              <button type="submit" class="btn btn-danger w-100">Login</button>
            </form>
            <p class="small text-muted mt-3 mb-0">Demo account: <code>demo</code> / <code>demo123</code></p>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">What happens when you submit</div>
          <div class="card-body small text-muted">
            <ol class="mb-0">
              <li>The Express server's <code>getUserByCredentials()</code> checks the username and password</li>
              <li>The browser keeps the raw username and password in memory</li>
              <li>
                Every future request attaches: <code>Authorization: Basic &lt;encoded&gt;</code>,
                re-checked server-side every time
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginBasicComponent {
  username = '';
  password = '';

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    readonly messages: MessagesService,
  ) {}

  async submit(): Promise<void> {
    this.messages.clear();
    const ok = await this.auth.loginBasic(this.username, this.password);
    if (ok) {
      this.router.navigate(['/basic/dashboard']);
    }
  }
}
