import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Gallery() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSnapshots() {
      try {
        const res = await fetch(`${API}/api/snapshots/public`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setSnapshots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSnapshots();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Loading gallery…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Community Gallery</h2>
        <Link to="/explorer" className="btn btn-primary">
          Open Explorer
        </Link>
      </div>

      {snapshots.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>No public snapshots yet. Be the first to share one!</p>
          <Link to="/explorer" className="btn btn-outline-primary">
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {snapshots.map((snap) => (
            <div key={snap._id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100">
                <img
                  src={snap.imageData}
                  className="card-img-top"
                  alt={snap.title}
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title mb-1">{snap.title}</h6>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.8rem" }}
                  >
                    by {snap.userId?.username || "Anonymous"}
                  </p>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Palette: {snap.palette} · Iter: {snap.maxIter}
                  </p>
                </div>
                <div
                  className="card-footer text-muted"
                  style={{ fontSize: "0.75rem" }}
                >
                  {new Date(snap.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
