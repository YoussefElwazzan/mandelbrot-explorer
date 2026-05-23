import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container my-5 text-center">
      <h1 className="display-1 fw-bold text-muted">404</h1>
      <h3 className="mb-3">Page not found</h3>
      <p className="text-muted mb-4">
        This page doesn't exist. Maybe it got lost in an infinite zoom.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
