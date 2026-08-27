import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { MessagesService } from './messages.service';

export interface BasicDashboard {
  username: string;
  credentials: string;
  decoded: string;
}

export interface BearerDashboard {
  username: string;
  token: string;
  header: string;
}

export interface JwtPayload {
  sub: number;
  username?: string;
  type: string;
  iat: number;
  exp: number;
}

export interface JwtDashboard {
  username: string;
  accessToken: string;
  header: string;
  payload: JwtPayload;
  iat: number;
  exp: number;
}

//Angular version of store - Don't do this in your project
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiBaseUrl;

  // ----- Basic Auth -----
  private basicUsername: string | null = null;
  private basicPassword: string | null = null;
  private readonly basicDashboardSignal = signal<BasicDashboard | null>(null);
  readonly basicDashboard = this.basicDashboardSignal.asReadonly();

  // ----- Bearer Token -----
  private bearerToken: string | null = null;
  private readonly bearerDashboardSignal = signal<BearerDashboard | null>(null);
  readonly bearerDashboard = this.bearerDashboardSignal.asReadonly();

  // ----- JWT -----
  private jwtAccessToken: string | null = null;
  private jwtRefreshToken: string | null = null;
  private readonly jwtDashboardSignal = signal<JwtDashboard | null>(null);
  readonly jwtDashboard = this.jwtDashboardSignal.asReadonly();

  constructor(
    private readonly http: HttpClient,
    private readonly messages: MessagesService,
  ) {}

  // ===================== Basic Auth =====================

  async loginBasic(username: string, password: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.post<{ username: string }>(`${this.baseUrl}/basic/login`, { username, password }),
      );
      this.basicUsername = username;
      this.basicPassword = password;
      return true;
    } catch (err) {
      this.handleError(err);
      return false;
    }
  }

  async fetchBasicDashboard(): Promise<boolean> {
    if (!this.basicUsername || !this.basicPassword) return false;
    try {
      const headers = new HttpHeaders({ Authorization: `Basic ${this.encodeBasic()}` });
      const data = await firstValueFrom(
        this.http.get<BasicDashboard>(`${this.baseUrl}/basic/dashboard`, { headers }),
      );
      this.basicDashboardSignal.set(data);
      return true;
    } catch (err) {
      this.handleError(err);
      this.basicDashboardSignal.set(null);
      return false;
    }
  }

  logoutBasic(): void {
    this.basicUsername = null;
    this.basicPassword = null;
    this.basicDashboardSignal.set(null);
  }

  private encodeBasic(): string {
    return btoa(`${this.basicUsername}:${this.basicPassword}`);
  }

  // ===================== Bearer Token =====================

  async loginBearer(username: string, password: string): Promise<boolean> {
    try {
      const data = await firstValueFrom(
        this.http.post<{ username: string; token: string }>(`${this.baseUrl}/bearer/login`, {
          username,
          password,
        }),
      );
      this.bearerToken = data.token;
      return true;
    } catch (err) {
      this.handleError(err);
      return false;
    }
  }

  async fetchBearerDashboard(): Promise<boolean> {
    if (!this.bearerToken) return false;
    try {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.bearerToken}` });
      const data = await firstValueFrom(
        this.http.get<BearerDashboard>(`${this.baseUrl}/bearer/dashboard`, { headers }),
      );
      this.bearerDashboardSignal.set(data);
      return true;
    } catch (err) {
      this.handleError(err);
      this.bearerDashboardSignal.set(null);
      return false;
    }
  }

  async logoutBearer(): Promise<void> {
    if (this.bearerToken) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.bearerToken}` });
      try {
        await firstValueFrom(this.http.post(`${this.baseUrl}/bearer/logout`, {}, { headers }));
      } catch {
        // Even if this fails, drop the token client-side.
      }
    }
    this.bearerToken = null;
    this.bearerDashboardSignal.set(null);
  }

  // ===================== JWT =====================

  async loginJwt(username: string, password: string): Promise<boolean> {
    try {
      const data = await firstValueFrom(
        this.http.post<{ username: string; accessToken: string; refreshToken: string }>(
          `${this.baseUrl}/jwt/login`,
          { username, password },
        ),
      );
      this.jwtAccessToken = data.accessToken;
      this.jwtRefreshToken = data.refreshToken;
      return true;
    } catch (err) {
      this.handleError(err);
      return false;
    }
  }

  async fetchJwtDashboard(): Promise<boolean> {
    if (!this.jwtAccessToken) return false;
    try {
      const data = await this.getJwtDashboardWithToken(this.jwtAccessToken);
      this.jwtDashboardSignal.set(data);
      return true;
    } catch (err) {
      const httpErr = err as HttpErrorResponse;
      // Access token expired
      if (httpErr?.status === 401 && this.jwtRefreshToken) {
        const refreshed = await this.refreshJwt();
        if (refreshed && this.jwtAccessToken) {
          try {
            const data = await this.getJwtDashboardWithToken(this.jwtAccessToken);
            this.jwtDashboardSignal.set(data);
            return true;
          } catch (retryErr) {
            this.handleError(retryErr);
          }
        }
      } else {
        this.handleError(err);
      }
      this.jwtDashboardSignal.set(null);
      return false;
    }
  }

  private getJwtDashboardWithToken(accessToken: string): Promise<JwtDashboard> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return firstValueFrom(this.http.get<JwtDashboard>(`${this.baseUrl}/jwt/dashboard`, { headers }));
  }

  private async refreshJwt(): Promise<boolean> {
    if (!this.jwtRefreshToken) return false;
    try {
      const data = await firstValueFrom(
        this.http.post<{ username: string; accessToken: string; refreshToken: string }>(
          `${this.baseUrl}/jwt/refresh`,
          { refreshToken: this.jwtRefreshToken },
        ),
      );
      this.jwtAccessToken = data.accessToken;
      this.jwtRefreshToken = data.refreshToken;
      return true;
    } catch (err) {
      this.handleError(err);
      return false;
    }
  }

  async logoutJwt(): Promise<void> {
    if (this.jwtRefreshToken) {
      try {
        await firstValueFrom(
          this.http.post(`${this.baseUrl}/jwt/logout`, { refreshToken: this.jwtRefreshToken }),
        );
      } catch {
        // Fail through
      }
    }
    this.jwtAccessToken = null;
    this.jwtRefreshToken = null;
    this.jwtDashboardSignal.set(null);
  }

  // The bucket

  private handleError(err: unknown): void {
    const httpErr = err as HttpErrorResponse;
    const serverMessage = (httpErr?.error as { error?: string } | undefined)?.error;
    this.messages.setError(serverMessage || httpErr?.message || 'Something went wrong. Please try again.');
  }
}
