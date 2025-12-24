import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Set legacy localStorage for backward compatibility
    if (user) {
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userPhone', user.phone);
      localStorage.setItem('userKey', `${user.name}_${user.phone}`);
    }
  }, [user]);

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite"
      } as React.CSSProperties}></div>
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "10%",
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite reverse"
      } as React.CSSProperties}></div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        .premium-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4);
        }
        .outline-btn {
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          transition: all 0.3s ease;
        }
        .outline-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          color: white;
        }
      `}</style>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 glass-card" style={{
              borderRadius: "2.5rem",
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{
                    width: "100px",
                    height: "100px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
                    border: "3px solid rgba(255, 255, 255, 0.3)"
                  }}>
                    <i className="bi bi-mortarboard text-white" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h1 className="display-4 fw-bold mb-3" style={{ 
                    color: "white",
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}>ברוך הבא, {user?.name}!</h1>
                  <p className="lead mb-4" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2rem" }}>מה תרצה לעשות היום?</p>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <button 
                      onClick={() => navigate('/Learning')}
                      className="btn btn-lg w-100 text-white premium-btn"
                      style={{
                        borderRadius: "1.5rem",
                        padding: "2.5rem 2rem",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      } as React.CSSProperties}
                    >
                      <i className="bi bi-mortarboard d-block mb-3" style={{ fontSize: "2.5rem" }}></i>
                      <div>התחל ללמוד</div>
                      <small style={{ opacity: 0.8, fontSize: "0.9rem" }}>גלה עולמות חדשים</small>
                    </button>
                  </div>
                  
                  <div className="col-md-6">
                    <button 
                      onClick={() => navigate('/history')}
                      className="btn btn-lg w-100 outline-btn"
                      style={{
                        borderRadius: "1.5rem",
                        padding: "2.5rem 2rem",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      } as React.CSSProperties}
                    >
                      <i className="bi bi-journal-bookmark d-block mb-3" style={{ fontSize: "2.5rem" }}></i>
                      <div>היסטוריה</div>
                      <small style={{ opacity: 0.8, fontSize: "0.9rem" }}>עיין בלמידה שלך</small>
                    </button>
                  </div>
                  
                  {user?.isAdmin && (
                    <div className="col-md-12">
                      <button 
                        onClick={() => navigate('/admin')}
                        className="btn btn-lg w-100 outline-btn"
                        style={{
                          borderRadius: "1.5rem",
                          padding: "1.8rem",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          border: "2px solid rgba(34, 197, 94, 0.4)",
                          background: "rgba(34, 197, 94, 0.1)"
                        } as React.CSSProperties}
                      >
                        <i className="bi bi-shield-check me-3" style={{ fontSize: "1.8rem" }}></i>
                        פאנל מנהל
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={logout}
                    className="btn btn-link"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      fontSize: "1rem",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    יציאה
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

