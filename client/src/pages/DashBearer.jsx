import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashBearer() {
  const auth = useAuth();
  const navigate = useNavigate();
  const dashboard = auth.bearerDashboard;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await auth.fetchBearerDashboard();
      if (!ok && !cancelled) navigate('/bearer/login');
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await auth.logoutBearer();
    navigate('/bearer/login');
  }

  if (!dashboard) {
    return <p className="text-muted small">Looking up your token…</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Bearer Token Dashboard</h2>
          <p className="text-muted mb-0">
            Logged in as <strong>{dashboard.username}</strong>
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-success text-white">Your Token</div>
            <div className="card-body">
              <p className="small text-muted">
                This token lives in the server's in-memory token table and is sent on every
                request:
              </p>
              <code className="d-block bg-light p-3 rounded" style={{ wordBreak: 'break-all' }}>
                {dashboard.token}
              </code>
              <hr />
              <p className="small text-muted mb-1">Full authorization header:</p>
              <code className="d-block bg-light p-3 rounded" style={{ wordBreak: 'break-all' }}>
                {dashboard.header}
              </code>
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
                      <span className="badge bg-warning text-dark">One row per user</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Token expiry</td>
                    <td>
                      <span className="badge bg-danger">None by default</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Revocation</td>
                    <td>
                      <span className="badge bg-success">Easy; delete the row</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Lookups per request</td>
                    <td>
                      <span className="badge bg-warning text-dark">One token lookup</span>
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
                <li>You submitted the login form and the Express server verified your credentials</li>
                <li>
                  It ran the equivalent of <code>get_or_create</code> against its in-memory token
                  table (<code>server/src/data/tokens.js</code>)
                </li>
                <li>The token key came back in the login response and was kept in the auth context</li>
                <li>
                  Loading this dashboard sent <code>{dashboard.header}</code>, and the server's{' '}
                  <code>tokenAuth</code> middleware looked that key up in the token table
                </li>
                <li>Logging out deletes the row server-side so that the token stops working immediantly</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
