const BASE_URL = 'http://localhost:4000';

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.body = data;
    throw error;
  }
  return data;
}

export function jsonRequest(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  }).then(parseResponse);
}

// --- Basic Auth ---------------------------------------------------------
// There's no dedicated login endpoint: the same dashboard call both
// validates the credentials and returns the data to display.
export function fetchBasicDashboard(base64Credentials) {
  return jsonRequest('/api/basic/dashboard', {
    headers: { Authorization: `Basic ${base64Credentials}` },
  });
}

// --- Bearer Token --------------------------------------------------------
export function loginBearer(username, password) {
  return jsonRequest('/api/bearer/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function fetchBearerDashboard(token) {
  return jsonRequest('/api/bearer/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logoutBearer(token) {
  return jsonRequest('/api/bearer/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- JWT -------------------------------------------------------------------
export function loginJwt(username, password) {
  return jsonRequest('/api/jwt/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function fetchJwtDashboard(accessToken) {
  return jsonRequest('/api/jwt/dashboard', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function refreshJwt(refreshToken) {
  return jsonRequest('/api/jwt/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function logoutJwt() {
  return jsonRequest('/api/jwt/logout', { method: 'POST' });
}
