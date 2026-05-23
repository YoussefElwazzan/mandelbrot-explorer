import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchMySnapshots() {
      try {
        const res = await fetch(`${API}/api/snapshots/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setSnapshots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMySnapshots();
  }, [token]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this snapshot?")) return;
    try {
      const res = await fetch(`${API}/api/snapshots/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setSnapshots((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Profile header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">👤 {user?.username}</h2>
          <p className="text-muted mb-0">{user?.email}</p>
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Log out
        </button>
      </div>

      <h4 className="mb-3">My snapshots ({snapshots.length})</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {snapshots.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>You haven't saved any snapshots yet.</p>
          <a href="/explorer" className="btn btn-primary">
            Open Explorer
          </a>
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
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title mb-1">{snap.title}</h6>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.78rem" }}
                  >
                    {snap.isPublic ? "🌐 Public" : "🔒 Private"} ·{" "}
                    {snap.palette} · {snap.maxIter} iter
                  </p>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    cx: {snap.coordinates?.cx?.toFixed(4)} cy:{" "}
                    {snap.coordinates?.cy?.toFixed(4)}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {new Date(snap.createdAt).toLocaleDateString()}
                  </small>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(snap._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
