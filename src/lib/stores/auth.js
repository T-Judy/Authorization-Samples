import { writable, get } from 'svelte/store';
import { messages } from './messages.js';

const initialState = {
	// Basic auth
	basicCreds: null, 
	basicDashboard: null,

	// Bearer token
	bearerToken: null,
	bearerDashboard: null,

	// JWT
	jwtAccessToken: null,
	jwtRefreshToken: null,
	jwtDashboard: null
};

function createAuthStore() {
	const { subscribe, update } = writable({ ...initialState });

	function state() {
		return get({ subscribe });
	}

	// ---------- Basic Auth ----------

	async function loginBasic(username, password) {
		try {
			const res = await fetch('/api/basic/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			const data = await res.json();
			if (!res.ok) {
				messages.setError(data.error ?? 'Login failed');
				return false;
			}
			update((s) => ({ ...s, basicCreds: { username, password } }));
			return true;
		} catch {
			messages.setError('Network error contacting the server');
			return false;
		}
	}

	async function fetchBasicDashboard() {
		const { basicCreds } = state();
		if (!basicCreds) return false;

		const encoded = btoa(`${basicCreds.username}:${basicCreds.password}`);

		try {
			const res = await fetch('/api/basic/dashboard', {
				headers: { Authorization: `Basic ${encoded}` }
			});
			if (!res.ok) {
				update((s) => ({ ...s, basicCreds: null, basicDashboard: null }));
				return false;
			}
			const data = await res.json();
			update((s) => ({ ...s, basicDashboard: data }));
			return true;
		} catch {
			return false;
		}
	}

	function logoutBasic() {
		update((s) => ({ ...s, basicCreds: null, basicDashboard: null }));
	}

	// ---------- Bearer Token ----------

	async function loginBearer(username, password) {
		try {
			const res = await fetch('/api/bearer/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			const data = await res.json();
			if (!res.ok) {
				messages.setError(data.error ?? 'Login failed');
				return false;
			}
			update((s) => ({ ...s, bearerToken: data.token }));
			return true;
		} catch {
			messages.setError('Network error contacting the server');
			return false;
		}
	}

	async function fetchBearerDashboard() {
		const { bearerToken } = state();
		if (!bearerToken) return false;

		try {
			const res = await fetch('/api/bearer/dashboard', {
				headers: { Authorization: `Bearer ${bearerToken}` }
			});
			if (!res.ok) {
				update((s) => ({ ...s, bearerToken: null, bearerDashboard: null }));
				return false;
			}
			const data = await res.json();
			update((s) => ({ ...s, bearerDashboard: data }));
			return true;
		} catch {
			return false;
		}
	}

	async function logoutBearer() {
		const { bearerToken } = state();
		if (bearerToken) {
			try {
				await fetch('/api/bearer/logout', {
					method: 'POST',
					headers: { Authorization: `Bearer ${bearerToken}` }
				});
			} catch {
				// fail through and clear local state regardless
			}
		}
		update((s) => ({ ...s, bearerToken: null, bearerDashboard: null }));
	}

	// ---------- JWT ----------

	async function loginJwt(username, password) {
		try {
			const res = await fetch('/api/jwt/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			const data = await res.json();
			if (!res.ok) {
				messages.setError(data.error ?? 'Login failed');
				return false;
			}
			update((s) => ({
				...s,
				jwtAccessToken: data.accessToken,
				jwtRefreshToken: data.refreshToken
			}));
			return true;
		} catch {
			messages.setError('Network error contacting the server');
			return false;
		}
	}

	async function refreshJwt() {
		const { jwtRefreshToken } = state();
		if (!jwtRefreshToken) return false;

		try {
			const res = await fetch('/api/jwt/refresh', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken: jwtRefreshToken })
			});
			if (!res.ok) return false;
			const data = await res.json();
			update((s) => ({ ...s, jwtAccessToken: data.accessToken }));
			return true;
		} catch {
			return false;
		}
	}

	async function fetchJwtDashboard() {
		const { jwtAccessToken } = state();
		if (!jwtAccessToken) return false;

		const request = (token) =>
			fetch('/api/jwt/dashboard', { headers: { Authorization: `Bearer ${token}` } });

		let res = await request(jwtAccessToken);

		// Access token expired
		if (res.status === 401) {
			const refreshed = await refreshJwt();
			if (refreshed) {
				res = await request(state().jwtAccessToken);
			}
		}

		if (!res.ok) {
			update((s) => ({
				...s,
				jwtAccessToken: null,
				jwtRefreshToken: null,
				jwtDashboard: null
			}));
			return false;
		}

		const data = await res.json();
		update((s) => ({ ...s, jwtDashboard: data }));
		return true;
	}

	async function logoutJwt() {
		const { jwtRefreshToken } = state();
		try {
			await fetch('/api/jwt/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken: jwtRefreshToken })
			});
		} catch {
			// fail through
		}
		update((s) => ({ ...s, jwtAccessToken: null, jwtRefreshToken: null, jwtDashboard: null }));
	}

	return {
		subscribe,
		loginBasic,
		fetchBasicDashboard,
		logoutBasic,
		loginBearer,
		fetchBearerDashboard,
		logoutBearer,
		loginJwt,
		fetchJwtDashboard,
		refreshJwt,
		logoutJwt
	};
}

export const auth = createAuthStore();
