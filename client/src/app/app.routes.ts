import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginBasicComponent } from './pages/login-basic/login-basic.component';
import { LoginBearerComponent } from './pages/login-bearer/login-bearer.component';
import { LoginJwtComponent } from './pages/login-jwt/login-jwt.component';
import { DashBasicComponent } from './pages/dash-basic/dash-basic.component';
import { DashBearerComponent } from './pages/dash-bearer/dash-bearer.component';
import { DashJwtComponent } from './pages/dash-jwt/dash-jwt.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Angular Auth Demo' },

  { path: 'basic/login', component: LoginBasicComponent, title: 'Basic Auth Login' },
  { path: 'basic/dashboard', component: DashBasicComponent, title: 'Basic Auth Dashboard' },

  { path: 'bearer/login', component: LoginBearerComponent, title: 'Bearer Token Login' },
  { path: 'bearer/dashboard', component: DashBearerComponent, title: 'Bearer Token Dashboard' },

  { path: 'jwt/login', component: LoginJwtComponent, title: 'JWT Login' },
  { path: 'jwt/dashboard', component: DashJwtComponent, title: 'JWT Dashboard' },

  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
