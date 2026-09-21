import { createContext, useContext, useRef, useState } from 'react';
import * as api from '../api/client.js';
import { useMessages } from './MessagesContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const messages = useMessages();

  // Secrets themselves live in refs, not state: they only need to be read
  // inside functions (never rendered directly), and refs avoid any stale
  // closure issues between login and the dashboard's onMount fetch. This
  // mirrors "kept in memory" from the original app -- nothing is persisted
  // to localStorage, so a refresh clears everything, same as before.
  const basicCredentialsRef = useRef(null); // base64("username:password")
  const bearerTokenRef = useRef(null);
  const jwtTokensRef = useRef({ accessToken: null, refreshToken: null });

  const [basicDashboard, setBasicDashboard] = useState(null);
  const [bearerDashboard, setBearerDashboard] = useState(null);
  const [jwtDashboard, setJwtDashboard] = useState(null);

  // --- Basic Auth ----------------------------------------------------
  async function loginBasic(username, password) {
    const base64Credentials = btoa(`${username}:${password}`);
    try {
      const data = await api.fetchBasicDashboard(base64Credentials);
      basicCredentialsRef.current = base64Credentials;
      setBasicDashboard(data);
      return true;
    } catch (err) {
      messages.showError(err.message);
      return false;
    }
  }

  async function fetchBasicDashboard() {
    if (!basicCredentialsRef.current) return false;
    try {
      const data = await api.fetchBasicDashboard(basicCredentialsRef.current);
      setBasicDashboard(data);
      return true;
    } catch {
      setBasicDashboard(null);
      return false;
    }
  }

  function logoutBasic() {
    basicCredentialsRef.current = null;
    setBasicDashboard(null);
  }

  // --- Bearer Token ----------------------------------------------------
  async function loginBearer(username, password) {
    try {
      const { token } = await api.loginBearer(username, password);
      bearerTokenRef.current = token;
      const data = await api.fetchBearerDashboard(token);
      setBearerDashboard(data);
      return true;
    } catch (err) {
      messages.showError(err.message);
      return false;
    }
  }

  async function fetchBearerDashboard() {
    if (!bearerTokenRef.current) return false;
    try {
      const data = await api.fetchBearerDashboard(bearerTokenRef.current);
      setBearerDashboard(data);
      return true;
    } catch {
      setBearerDashboard(null);
      return false;
    }
  }

  async function logoutBearer() {
    if (bearerTokenRef.current) {
      try {
        await api.logoutBearer(bearerTokenRef.current);
      } catch {
        // token was likely already gone server-side; fine to ignore
      }
    }
    bearerTokenRef.current = null;
    setBearerDashboard(null);
  }

  // --- JWT ---------------------------------------------------------------
  async function loginJwt(username, password) {
    try {
      const { accessToken, refreshToken } = await api.loginJwt(username, password);
      jwtTokensRef.current = { accessToken, refreshToken };
      const data = await api.fetchJwtDashboard(accessToken);
      setJwtDashboard(data);
      return true;
    } catch (err) {
      messages.showError(err.message);
      return false;
    }
  }

  async function fetchJwtDashboard() {
    const { accessToken, refreshToken } = jwtTokensRef.current;
    if (!accessToken) return false;

    try {
      const data = await api.fetchJwtDashboard(accessToken);
      setJwtDashboard(data);
      return true;
    } catch (err) {
      // Access token expired: silently exchange the refresh token for a new
      // one, exactly like step 5 of "How This Worked" describes.
      if (err.body?.expired && refreshToken) {
        try {
          const { accessToken: newAccessToken } = await api.refreshJwt(refreshToken);
          jwtTokensRef.current.accessToken = newAccessToken;
          const data = await api.fetchJwtDashboard(newAccessToken);
          setJwtDashboard(data);
          return true;
        } catch {
          setJwtDashboard(null);
          return false;
        }
      }
      setJwtDashboard(null);
      return false;
    }
  }

  async function logoutJwt() {
    try {
      await api.logoutJwt();
    } catch {
      // stateless -- nothing server-side can really fail here
    }
    jwtTokensRef.current = { accessToken: null, refreshToken: null };
    setJwtDashboard(null);
  }

  const value = {
    basicDashboard,
    loginBasic,
    fetchBasicDashboard,
    logoutBasic,

    bearerDashboard,
    loginBearer,
    fetchBearerDashboard,
    logoutBearer,

    jwtDashboard,
    loginJwt,
    fetchJwtDashboard,
    logoutJwt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
