import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

interface User {
  _id: string;
  name: string;
  phone: string;
  isAdmin: boolean;
}

interface HistoryItem {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    phone: string;
  } | null;
  prompt: string;
  response: string;
  category?: string;
  subcategory?: string;
  create_at: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allHistory, setAllHistory] = useState<HistoryItem[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, getAuthHeaders, loading: authLoading } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      
      // קבלת כל המשתמשים
      const usersResponse = await fetch(`${API_BASE_URL}/api/users`, { headers });
      const usersData = await usersResponse.json();
      
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      }

      // קבלת כל הפרומפטים
      const historyResponse = await fetch(`${API_BASE_URL}/api/prompts`, { headers });
      const historyData = await historyResponse.json();
      
      if (Array.isArray(historyData)) {
        setAllHistory(historyData);
      }
    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
      setUsers([]);
      setAllHistory([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      return;
    }
    if (!authLoading && isAdmin) {
      fetchData();
    }
  }, [isAdmin, authLoading, navigate, fetchData]);

  const filteredHistory = (() => {
    let filtered = allHistory;
    
    if (selectedUser) {
      filtered = filtered.filter(item => item.user_id?._id === selectedUser);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const userName = item.user_id?.name || '';
        const userPhone = item.user_id?.phone || '';
        return userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
               userPhone.includes(searchTerm);
      });
    }
    
    return [...filtered].reverse();
  })();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 style={{ color: "#475569" }}>טוען נתוני מנהל...</h4>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: "100vh",
      position: "relative"
    }}>
      {/* Subtle background pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)`,
        pointerEvents: "none"
      } as React.CSSProperties}></div>
      <style>{`
        .admin-main-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }
        .stat-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }
        .admin-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .admin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          color: white;
        }
        .admin-btn-outline {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #e2e8f0;
          color: #475569;
          transition: all 0.3s ease;
        }
        .admin-btn-outline:hover {
          background: #f8fafc;
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-2px);
        }
        .premium-input {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 2px solid #e2e8f0 !important;
          color: #1e293b !important;
        }
        .premium-input:focus {
          background: rgba(255, 255, 255, 1) !important;
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15) !important;
        }
        .history-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .history-card:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .user-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .user-card:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          transform: translateY(-2px);
        }
      `}</style>
      
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 admin-main-card" style={{
              borderRadius: "2rem"
            }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-4" style={{
                      width: "70px",
                      height: "70px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 15px 35px rgba(102, 126, 234, 0.3)"
                    }}>
                      <i className="bi bi-shield-check text-white" style={{ fontSize: "1.8rem" }}></i>
                    </div>
                    <h1 className="display-5 fw-bold mb-0" style={{ 
                      color: "#667eea"
                    }}>
                      פאנל מנהל
                    </h1>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn admin-btn-outline"
                      onClick={() => navigate('/')}
                      style={{ 
                        borderRadius: "1.2rem",
                        padding: "0.75rem 1.5rem",
                        fontWeight: "600",
                        border: "2px solid #e2e8f0"
                      } as React.CSSProperties}
                    >
                      <i className="bi bi-house-door me-2"></i>חזרה לדף הבית
                    </button>
                    <button 
                      className="btn"
                      onClick={() => {
                        sessionStorage.clear();
                        navigate('/login');
                      }}
                      style={{ 
                        borderRadius: "1.2rem",
                        padding: "0.75rem 1.5rem",
                        fontWeight: "600",
                        border: "2px solid #fecaca",
                        background: "#fef2f2",
                        color: "#dc2626"
                      } as React.CSSProperties}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>התנתק
                    </button>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="card border-0 stat-card" style={{ borderRadius: "1.5rem" }}>
                      <div className="card-body text-center p-4">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)"
                        }}>
                          <i className="bi bi-people text-white" style={{ fontSize: "1.5rem" }}></i>
                        </div>
                        <h2 className="fw-bold" style={{ color: "#1e293b", fontSize: "2.5rem" }}>{users.length}</h2>
                        <p className="mb-0 fw-semibold" style={{ color: "#64748b" }}>משתמשים רשומים</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 stat-card" style={{ borderRadius: "1.5rem" }}>
                      <div className="card-body text-center p-4">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
                          boxShadow: "0 10px 25px rgba(118, 75, 162, 0.3)"
                        }}>
                          <i className="bi bi-chat-dots text-white" style={{ fontSize: "1.5rem" }}></i>
                        </div>
                        <h2 className="fw-bold" style={{ color: "#1e293b", fontSize: "2.5rem" }}>{allHistory.length}</h2>
                        <p className="mb-0 fw-semibold" style={{ color: "#64748b" }}>שאלות בסך הכל</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 stat-card" style={{ borderRadius: "1.5rem" }}>
                      <div className="card-body text-center p-4">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                        }}>
                          <i className="bi bi-person-check text-white" style={{ fontSize: "1.5rem" }}></i>
                        </div>
                        <h2 className="fw-bold" style={{ color: "#1e293b", fontSize: "2.5rem" }}>{new Set(allHistory.map(h => h.user_id?._id).filter(Boolean)).size}</h2>
                        <p className="mb-0 fw-semibold" style={{ color: "#64748b" }}>משתמשים פעילים</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="d-flex gap-3 mb-4">
                    <button 
                      className="btn admin-btn"
                      onClick={() => setShowUsers(!showUsers)}
                      style={{ 
                        borderRadius: "1.2rem",
                        padding: "0.75rem 1.5rem",
                        fontWeight: "600",
                        fontSize: "1rem"
                      } as React.CSSProperties}
                    >
                      <i className="bi bi-people me-2"></i>
                      {showUsers ? 'היסטוריית שאלות' : 'משתמשים'}
                    </button>
                  </div>

                  {showUsers && (
                    <div className="mb-4">
                      <h4 className="mb-3" style={{ color: "#1e293b" }}>רשימת משתמשים</h4>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control premium-input"
                          placeholder="חיפוש משתמש לפי שם או טלפון..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          style={{ 
                            borderRadius: "1.2rem",
                            padding: "0.75rem 1.2rem",
                            fontSize: "1rem"
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        {users.filter(user => {
                          if (!userSearchTerm) return true;
                          return user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                                 user.phone.includes(userSearchTerm);
                        }).map(user => (
                          <div key={user._id} className="card mb-2 border-0 user-card" style={{
                            borderRadius: "1rem"
                          }}>
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1 fw-bold" style={{ color: "#1e293b" }}>{user.name} - {user.phone}</h6>
                                  <small style={{ color: "#64748b" }}>
                                    {user.isAdmin ? 'מנהל' : 'משתמש רגיל'}
                                  </small>
                                </div>
                                <button 
                                  className="btn admin-btn-outline btn-sm"
                                  onClick={() => {
                                    setSelectedUser(user._id);
                                    setShowUsers(false);
                                  }}
                                  style={{ borderRadius: "0.5rem" }}
                                >
                                  היסטוריית משתמש
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!showUsers && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="fw-bold" style={{ color: "#1e293b" }}>היסטוריית שאלות</h3>
                        {selectedUser && (
                          <button 
                            className="btn admin-btn-outline btn-sm"
                            onClick={() => {
                              setSelectedUser('');
                              setShowUsers(true);
                            }}
                            style={{ borderRadius: "0.5rem" }}
                          >
                            <i className="bi bi-arrow-left me-2"></i>
                            חזרה למשתמשים
                          </button>
                        )}
                        <select 
                          className="form-select w-auto premium-input"
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          style={{ borderRadius: "1rem" }}
                        >
                          <option value="">כל המשתמשים</option>
                          {Array.from(new Set(allHistory.map(h => h.user_id?._id).filter(Boolean))).map(userId => {
                            const historyItem = allHistory.find(h => h.user_id?._id === userId);
                            const userName = historyItem?.user_id?.name || 'משתמש לא ידוע';
                            const userPhone = historyItem?.user_id?.phone || 'טלפון לא ידוע';
                            return (
                              <option key={userId} value={userId as string}>
                                {userName} - {userPhone}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control premium-input"
                          placeholder="חיפוש לפי שם או טלפון..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ 
                            borderRadius: "1.2rem",
                            padding: "0.75rem 1.2rem",
                            fontSize: "1rem"
                          }}
                        />
                      </div>

                      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                        {filteredHistory.length === 0 ? (
                          <div className="text-center py-4">
                            <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#94a3b8" }}></i>
                            <p className="mt-2" style={{ color: "#64748b" }}>אין היסטוריה</p>
                          </div>
                        ) : (
                          filteredHistory.map((item) => (
                            <div key={item._id} className="card mb-3 border-0 history-card" style={{
                              borderRadius: "1.5rem"
                            }}>
                              <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div>
                                    <h6 className="mb-1 fw-bold" style={{ color: "#1e293b" }}>
                                      {item.user_id?.name || 'משתמש לא ידוע'} - {item.user_id?.phone || 'טלפון לא ידוע'}
                                    </h6>
                                    <small style={{ color: "#64748b" }}>
                                      {item.category && item.subcategory ? `${item.category} • ${item.subcategory}` : 'Learning Session'} • 
                                      {item.create_at ? new Date(item.create_at).toLocaleString('he-IL') : 'תאריך לא ידוע'}
                                    </small>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <strong style={{ color: "#374151" }}>שאלה:</strong> 
                                  <div style={{ color: "#1f2937", marginTop: "0.5rem", padding: "0.75rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>{item.prompt}</div>
                                </div>
                                <div>
                                  <strong style={{ color: "#374151" }}>תשובה:</strong> 
                                  <div style={{ color: "#1f2937", marginTop: "0.5rem", padding: "0.75rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>{item.response}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

