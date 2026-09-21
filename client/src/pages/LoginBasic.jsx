import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useMessages } from '../context/MessagesContext.jsx';

export default function LoginBasic() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const messages = useMessages();

  async function submit(e) {
    e.preventDefault();
    messages.clear();
    const ok = await auth.loginBasic(username, password);
    if (ok) {
      navigate('/basic/dashboard');
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-1">Basic Auth Login</h2>
        <p className="text-muted mb-4">
          Your credentials will be base64-encoded and sent on every request.
        </p>

        <div className="card">
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="form-control"
                  autoFocus
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-danger w-100">
                Login
              </button>
            </form>
            <p className="small text-muted mt-3 mb-0">
              Demo account: <code>demo</code> / <code>demo123</code>
            </p>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header">What happens when you submit</div>
          <div className="card-body small text-muted">
            <ol className="mb-0">
              <li>
                The Express server's <code>getUserByCredentials()</code> checks the username and
                password
              </li>
              <li>The browser keeps the raw username and password in memory</li>
              <li>
                Every future request attaches: <code>Authorization: Basic &lt;encoded&gt;</code>,
                re-checked server-side every time
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
