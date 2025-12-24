import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        // שמירה נוספת לשימוש בקומפוננטים אחרים
        sessionStorage.setItem('userName', data.user.name);
        sessionStorage.setItem('userPhone', data.user.phone);
        
        if (data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'שגיאה בהתחברות');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "15%",
        width: "250px",
        height: "250px",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite"
      } as React.CSSProperties}></div>
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "20%",
        width: "180px",
        height: "180px",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite reverse"
      } as React.CSSProperties}></div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
      `}</style>
      <div className="card border-0" style={{
        borderRadius: "2.5rem",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        width: "100%",
        maxWidth: "450px"
      }}>
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 15px 35px rgba(102, 126, 234, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.3)"
            }}>
              <i className="bi bi-person-circle text-white" style={{ fontSize: "2rem" }}></i>
            </div>
            <h2 className="fw-bold mb-2" style={{ 
              color: "white",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              fontSize: "2rem"
            }}>
              Login
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>Welcome back!</p>
          </div>

          {error && (
            <div className="mb-4" style={{
              padding: "1rem 1.25rem",
              background: "rgba(220, 53, 69, 0.1)",
              border: "1px solid rgba(220, 53, 69, 0.3)",
              borderRadius: "1rem",
              color: "#dc3545",
              fontSize: "0.95rem",
              textAlign: "right",
              backdropFilter: "blur(15px)",
              boxShadow: "0 4px 15px rgba(220, 53, 69, 0.1)"
            }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label" style={{ color: "white", fontWeight: "500", marginBottom: "0.8rem", textAlign: "left", display: "block" }}>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ 
                  borderRadius: "1.2rem",
                  padding: "1rem 1.5rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  fontSize: "1.1rem",
                  direction: "ltr",
                  textAlign: "left"
                }}
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ color: "white", fontWeight: "500", marginBottom: "0.8rem", textAlign: "left", display: "block" }}>Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ 
                  borderRadius: "1.2rem",
                  padding: "1rem 1.5rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  fontSize: "1.1rem",
                  direction: "ltr",
                  textAlign: "left"
                }}
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ color: "white", fontWeight: "500", marginBottom: "0.8rem", textAlign: "left", display: "block" }}>Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ 
                    borderRadius: "1.2rem",
                    padding: "1rem 3.5rem 1rem 1.5rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    fontSize: "1.1rem",
                    direction: "ltr",
                    textAlign: "left"
                  }}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="btn position-absolute"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    padding: "8px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "1.2rem",
                    zIndex: 10
                  }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 mb-4"
              disabled={loading}
              style={{ 
                borderRadius: "1.2rem",
                padding: "1rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                color: "white",
                fontSize: "1.1rem",
                fontWeight: "600",
                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease"
              } as React.CSSProperties}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                 Connecting...
                </>
              ) : 'Log in'}
            </button>
          </form>

          <div className="text-center">
            <button
              className="btn btn-link"
              onClick={() => navigate('/register')}
              style={{
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            >
              Don't have an account? <span style={{ fontWeight: "600" }}>Register here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

