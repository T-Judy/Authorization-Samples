import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Angular Auth Demo</a>
      </div>
    </nav>

    <div class="app-shell">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
