import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="card mx-auto" style={{ maxWidth: '640px' }}>
        <div className="card-body text-center">
          <h1 className="display-5">404</h1>
          <p className="lead">Sorry, the page you requested was not found.</p>
          <p className="text-muted">
            You will be redirected to the home page in 3 seconds.{' '}
            <Link to="/">Click here</Link> to go immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
