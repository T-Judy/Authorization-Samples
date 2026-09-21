import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useMessages } from '../context/MessagesContext.jsx';

export default function LoginBearer() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const messages = useMessages();

  async function submit(e) {
    e.preventDefault();
    messages.clear();
    const ok = await auth.loginBearer(username, password);
    if (ok) {
      navigate('/bearer/dashboard');
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-1">Bearer Token Login</h2>
        <p className="text-muted mb-4">
          Login once to receive a token. That token is used for all future requests.
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
              <button type="submit" className="btn btn-success w-100">
                Login &amp; Get Token
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
              <li>The Express server checks the username and password against its user table</li>
              <li>On success, it looks up or creates a token row for that user (get-or-create)</li>
              <li>The token key comes back in the response and is kept in the auth context</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
