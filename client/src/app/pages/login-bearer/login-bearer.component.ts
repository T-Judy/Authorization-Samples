import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-login-bearer',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h2 class="mb-1">Bearer Token Login</h2>
        <p class="text-muted mb-4">
          Login once to receive a token. That token is used for all future requests.
        </p>

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
              <button type="submit" class="btn btn-success w-100">Login &amp; Get Token</button>
            </form>
            <p class="small text-muted mt-3 mb-0">Demo account: <code>demo</code> / <code>demo123</code></p>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">What happens when you submit</div>
          <div class="card-body small text-muted">
            <ol class="mb-0">
              <li>The Express server checks the username and password against its user table</li>
              <li>On success, it looks up or creates a token row for that user (get-or-create)</li>
              <li>The token key comes back in the response and is kept in the auth service</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginBearerComponent {
  username = '';
  password = '';

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    readonly messages: MessagesService,
  ) {}

  async submit(): Promise<void> {
    this.messages.clear();
    const ok = await this.auth.loginBearer(this.username, this.password);
    if (ok) {
      this.router.navigate(['/bearer/dashboard']);
    }
  }
}
