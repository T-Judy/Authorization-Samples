import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function formatUnix(ts) {
  return new Date(ts * 1000)
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, ' UTC');
}

export default function DashJwt() {
  const auth = useAuth();
  const navigate = useNavigate();
  const dashboard = auth.jwtDashboard;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await auth.fetchJwtDashboard();
      if (!ok && !cancelled) navigate('/jwt/login');
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payloadJson = useMemo(
    () => (dashboard ? JSON.stringify(dashboard.payload, null, 2) : ''),
    [dashboard],
  );
  const expFormatted = useMemo(() => (dashboard ? formatUnix(dashboard.exp) : ''), [dashboard]);
  const iatFormatted = useMemo(() => (dashboard ? formatUnix(dashboard.iat) : ''), [dashboard]);
  const minutesRemaining = useMemo(
    () => (dashboard ? Math.max(0, Math.floor((dashboard.exp - Date.now() / 1000) / 60)) : 0),
    [dashboard],
  );

  async function logout() {
    await auth.logoutJwt();
    navigate('/jwt/login');
  }

  if (!dashboard) {
    return <p className="text-muted small">Verifying token with the server…</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">JWT Dashboard</h2>
          <p className="text-muted mb-0">
            Logged in as <strong>{dashboard.username}</strong>
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">Access Token</div>
            <div className="card-body">
              <p className="small text-muted">
                This signed token is sent on every request. It has three base64url parts
                separated by dots:
              </p>
              <code
                className="d-block bg-light p-3 rounded"
                style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}
              >
                {dashboard.accessToken}
              </code>
              <hr />
              <p className="small text-muted mb-1">Full authorization header:</p>
              <code
                className="d-block bg-light p-3 rounded"
                style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}
              >
                {dashboard.header}
              </code>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Decoded Payload</div>
            <div className="card-body">
              <pre className="bg-light p-3 rounded small mb-0">{payloadJson}</pre>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Token Lifetimes</div>
            <div className="card-body">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted">Access token expires</td>
                    <td>
                      <span className="badge bg-warning text-dark">15 minutes</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Refresh token expires</td>
                    <td>
                      <span className="badge bg-success">7 days</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">exp (Unix timestamp)</td>
                    <td>
                      <code>{dashboard.exp}</code> <span className="text-muted">({expFormatted})</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">iat (Unix timestamp)</td>
                    <td>
                      <code>{dashboard.iat}</code> <span className="text-muted">({iatFormatted})</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Minutes remaining</td>
                    <td>
                      <code>{minutesRemaining}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Security Properties</div>
            <div className="card-body">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted">Credentials exposed</td>
                    <td>
                      <span className="badge bg-success">Login only</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Server-side storage</td>
                    <td>
                      <span className="badge bg-success">None</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Access token expiry</td>
                    <td>
                      <span className="badge bg-success">15 minutes</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Revocation</td>
                    <td>
                      <span className="badge bg-danger">Hard; needs a blacklist</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Lookups per request</td>
                    <td>
                      <span className="badge bg-success">None</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-header">How This Worked</div>
            <div className="card-body small text-muted">
              <ol className="mb-0">
                <li>You submitted the login form and the Express server checked your credentials</li>
                <li>
                  It signed a header <code>{'{"alg":"HS256","typ":"JWT"}'}</code> and a payload
                  with your user id, <code>iat</code>, and <code>exp</code> using{' '}
                  <code>jsonwebtoken.sign()</code> and a secret kept in <code>server/.env</code>
                </li>
                <li>The access token and refresh token came back in the login response</li>
                <li>
                  Loading this dashboard sent <code>{dashboard.header}</code>; the server's{' '}
                  <code>jwtAuth</code> middleware re-computed the signature with{' '}
                  <code>jsonwebtoken.verify()</code> to confirm nothing was tampered with
                </li>
                <li>
                  When the access token expires, the refresh token is exchanged for a new one at{' '}
                  <code>/api/jwt/refresh</code>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
