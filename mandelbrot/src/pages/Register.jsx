import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ── Validation ──────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!formData.username || formData.username.trim().length < 3)
      errs.username = "Username must be at least 3 characters.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Enter a valid email address.";
    if (!formData.password || formData.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    return errs;
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      login(data.user, data.token);
      navigate("/explorer");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (name, label, type = "text") => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        value={formData[name]}
        onChange={handleChange}
        autoComplete={name}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 text-center">Create account</h3>

              {apiError && <div className="alert alert-danger">{apiError}</div>}

              <form onSubmit={handleSubmit} noValidate>
                {field("username", "Username")}
                {field("email", "Email address", "email")}
                {field("password", "Password", "password")}
                {field("confirmPassword", "Confirm password", "password")}

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-2"
                  disabled={loading}
                >
                  {loading ? "Creating account…" : "Sign up"}
                </button>
              </form>

              <p className="text-center mt-3 mb-0 text-muted">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
