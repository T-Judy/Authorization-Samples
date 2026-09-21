import { Link, Route, Routes } from 'react-router-dom';
import { useMessages } from './context/MessagesContext.jsx';

import Home from './pages/Home.jsx';
import LoginBasic from './pages/LoginBasic.jsx';
import LoginBearer from './pages/LoginBearer.jsx';
import LoginJwt from './pages/LoginJwt.jsx';
import DashBasic from './pages/DashBasic.jsx';
import DashBearer from './pages/DashBearer.jsx';
import DashJwt from './pages/DashJwt.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const { error, info, clear } = useMessages();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">
            React Auth Demo
          </Link>
          <div className="navbar-nav flex-row gap-3">
            <Link to="/basic/login" className="nav-link">
              Basic
            </Link>
            <Link to="/bearer/login" className="nav-link">
              Bearer
            </Link>
            <Link to="/jwt/login" className="nav-link">
              JWT
            </Link>
          </div>
        </div>
      </nav>

      <main className="container pb-5">
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {error}
            <button type="button" className="btn-close" aria-label="Close" onClick={clear} />
          </div>
        )}
        {info && (
          <div className="alert alert-info alert-dismissible" role="alert">
            {info}
            <button type="button" className="btn-close" aria-label="Close" onClick={clear} />
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basic/login" element={<LoginBasic />} />
          <Route path="/basic/dashboard" element={<DashBasic />} />
          <Route path="/bearer/login" element={<LoginBearer />} />
          <Route path="/bearer/dashboard" element={<DashBearer />} />
          <Route path="/jwt/login" element={<LoginJwt />} />
          <Route path="/jwt/dashboard" element={<DashJwt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}