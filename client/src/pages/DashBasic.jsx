import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashBasic() {
  const auth = useAuth();
  const navigate = useNavigate();
  const dashboard = auth.basicDashboard;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await auth.fetchBasicDashboard();
      if (!ok && !cancelled) navigate('/basic/login');
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    auth.logoutBasic();
    navigate('/basic/login');
  }

  if (!dashboard) {
    return <p className="text-muted small">Verifying credentials with the server…</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Basic Auth Dashboard</h2>
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
            <div className="card-header bg-danger text-white">Header Sent on Every Request</div>
            <div className="card-body">
              <p className="small text-muted">This header is attached to every API call you make:</p>
              <code className="d-block bg-light p-3 rounded" style={{ wordBreak: 'break-all' }}>
                Authorization: Basic {dashboard.credentials}
              </code>
              <hr />
              <p className="small text-muted mb-1">Decoded value:</p>
              <code className="d-block bg-light p-3 rounded">{dashboard.decoded}</code>
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
                      <span className="badge bg-danger">Every request</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Server-side storage</td>
                    <td>
                      <span className="badge bg-success">None</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Token expiry</td>
                    <td>
                      <span className="badge bg-danger">Never</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Revocation</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        Change password or username
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Lookup per request</td>
                    <td>
                      <span className="badge bg-danger">Yes; username and password check</span>
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
                <li>
                  You submitted the login form and the Express server's{' '}
                  <code>getUserByCredentials()</code> checked your credentials against its user
                  table
                </li>
                <li>The browser kept your raw username and password in memory</li>
                <li>
                  Loading this dashboard sent a fresh request with{' '}
                  <code>Authorization: Basic {dashboard.credentials}</code>
                </li>
                <li>
                  The server's <code>basicAuth</code> middleware decoded that header and
                  re-checked the credentials against the user table
                </li>
                <li>That check happens again on every request; there's no token or session to reuse</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
