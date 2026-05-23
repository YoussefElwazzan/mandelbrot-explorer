import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Helper: adds 'active' class to the current page link
  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Mandelbrot Explorer
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {/* Left side links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={isActive("/")} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/explorer")} to="/explorer">
                Explorer
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/gallery")} to="/gallery">
                Gallery
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/about")} to="/about">
                About
              </Link>
            </li>
          </ul>

          {/* Right side: auth links */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className={isActive("/profile")} to="/profile">
                    👤 {user.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={isActive("/login")} to="/login">
                    Log in
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-light btn-sm" to="/register">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
