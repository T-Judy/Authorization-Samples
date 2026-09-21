import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <h1 className="mb-2">React Auth Demo Site</h1>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-danger text-white">Basic Auth</div>
            <div className="card-body">
              <p>
                Your username and password are base64-encoded and sent with{' '}
                <strong>every single request</strong> in the Authorization header. No tokens are
                issued.
              </p>
              <ul className="small text-muted">
                <li>No server-side storage needed</li>
                <li>Credentials exposed on every request</li>
                <li>No expiry or revocation</li>
                <li>
                  <strong>Must use HTTPS</strong> or you are more or less using plain text
                </li>
              </ul>
            </div>
            <div className="card-footer">
              <Link to="/basic/login" className="btn btn-danger w-100">
                Try Basic Auth
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">Bearer Token</div>
            <div className="card-body">
              <p>
                Login once, receive an opaque token string stored server-side. Send that token
                instead of credentials on every request.
              </p>
              <ul className="small text-muted">
                <li>Token stored in a token table, keyed by user</li>
                <li>Lookup on every request</li>
                <li>Easy to revoke; just delete the row</li>
                <li>No expiry by default (you will want to change this)</li>
              </ul>
            </div>
            <div className="card-footer">
              <Link to="/bearer/login" className="btn btn-success w-100">
                Try Bearer Token
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">Json Web Token (JWT)</div>
            <div className="card-body">
              <p>
                Login once, receive a cryptographically signed token that carries its own
                payload. It's verified with no lookup needed.
              </p>
              <ul className="small text-muted">
                <li>Stateless nothing stored server-side</li>
                <li>Access token expires in 15 minutes</li>
                <li>Refresh token expires in 7 days</li>
                <li>Harder to revoke than a bearer token</li>
              </ul>
            </div>
            <div className="card-footer">
              <Link to="/jwt/login" className="btn btn-primary w-100">
                Try JWT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
