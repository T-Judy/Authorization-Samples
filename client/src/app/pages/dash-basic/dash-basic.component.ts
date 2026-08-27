import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dash-basic',
  standalone: true,
  template: `
    @if (auth.basicDashboard(); as dashboard) {
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0">Basic Auth Dashboard</h2>
          <p class="text-muted mb-0">Logged in as <strong>{{ dashboard.username }}</strong></p>
        </div>
        <button class="btn btn-outline-secondary" (click)="logout()">Logout</button>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header bg-danger text-white">Header Sent on Every Request</div>
            <div class="card-body">
              <p class="small text-muted">This header is attached to every API call you make:</p>
              <code class="d-block bg-light p-3 rounded" style="word-break: break-all">
                Authorization: Basic {{ dashboard.credentials }}
              </code>
              <hr />
              <p class="small text-muted mb-1">Decoded value:</p>
              <code class="d-block bg-light p-3 rounded">{{ dashboard.decoded }}</code>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">Security Properties</div>
            <div class="card-body">
              <table class="table table-sm mb-0">
                <tbody>
                  <tr>
                    <td class="text-muted">Credentials exposed</td>
                    <td><span class="badge bg-danger">Every request</span></td>
                  </tr>
                  <tr>
                    <td class="text-muted">Server-side storage</td>
                    <td><span class="badge bg-success">None</span></td>
                  </tr>
                  <tr>
                    <td class="text-muted">Token expiry</td>
                    <td><span class="badge bg-danger">Never</span></td>
                  </tr>
                  <tr>
                    <td class="text-muted">Revocation</td>
                    <td><span class="badge bg-warning text-dark">Change password or username</span></td>
                  </tr>
                  <tr>
                    <td class="text-muted">Lookup per request</td>
                    <td><span class="badge bg-danger">Yes; username and password check</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card">
            <div class="card-header">How This Worked</div>
            <div class="card-body small text-muted">
              <ol class="mb-0">
                <li>
                  You submitted the login form and the Express server's
                  <code>getUserByCredentials()</code> checked your credentials against its user table
                </li>
                <li>The browser kept your raw username and password in memory</li>
                <li>
                  Loading this dashboard sent a fresh request with
                  <code>Authorization: Basic {{ dashboard.credentials }}</code>
                </li>
                <li>
                  The server's <code>basicAuth</code> middleware decoded that header and re-checked
                  the credentials against the user table
                </li>
                <li>That check happens again on every request; there's no token or session to reuse</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <p class="text-muted small">Verifying credentials with the server…</p>
    }
  `,
})
export class DashBasicComponent implements OnInit {
  constructor(
    readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const ok = await this.auth.fetchBasicDashboard();
    if (!ok) this.router.navigate(['/basic/login']);
  }

  logout(): void {
    this.auth.logoutBasic();
    this.router.navigate(['/basic/login']);
  }
}
