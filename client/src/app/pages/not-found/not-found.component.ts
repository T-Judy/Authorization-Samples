import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center" style="min-height: 60vh">
      <div class="card mx-auto" style="max-width: 640px">
        <div class="card-body text-center">
          <h1 class="display-5">404</h1>
          <p class="lead">Sorry, the page you requested was not found.</p>
          <p class="text-muted">
            You will be redirected to the home page in 3 seconds.
            <a routerLink="/">Click here</a> to go immediately.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.timer = setTimeout(() => this.router.navigate(['/']), 3000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }
}
