import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: string;
  name: string;
  options?: string[];
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

// Add custom CSS to force dropdown direction
const customStyle = `
  select.force-dropdown-down option {
    direction: ltr;
  }
  
  select.force-dropdown-down {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
`;

// Inject the style
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyle;
  document.head.appendChild(styleElement);
}

const Learning: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Categories`);
        const data = await response.json();
        if (Array.isArray(data)) {
            setCategories(data);
        }
      } catch (error) {
        console.error('שגיאה בטעינת הקטגוריות:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const userName = user?.name || sessionStorage.getItem('userName');

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        setSubcategoriesLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/subcategories/category/${selectedCategory}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSubcategories(data);
        } catch (error) {
          console.error('שגיאה בטעינת התת-קטגוריות:', error);
          setSubcategories([]);
        } finally {
          setSubcategoriesLoading(false);
        }
      } else {
        setSubcategories([]);
        setSubcategoriesLoading(false);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading your learning experience...</h4>
        </div>
      </div>
    );
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedOption("");
    setSubcategories([]);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const options = subcategories.length > 0 ? subcategories.map(sub => sub.name) : categories.find(cat => cat.name === selectedCategory)?.options || [];

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: "100vh",
      paddingBottom: "20rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Premium background effects */}
      <div style={{
        position: "absolute",
        top: "5%",
        left: "5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 10s ease-in-out infinite"
      } as React.CSSProperties}></div>
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "5%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 12s ease-in-out infinite reverse"
      } as React.CSSProperties}></div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
        }
        .premium-select {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 2px solid rgba(102, 126, 234, 0.2) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-select:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          background: rgba(255, 255, 255, 1) !important;
        }
        .premium-textarea {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 2px solid rgba(102, 126, 234, 0.2) !important;
          transition: all 0.3s ease;
        }
        .premium-textarea:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          background: rgba(255, 255, 255, 1) !important;
        }
      `}</style>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "30rem" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card border-0 glass-morphism" style={{
              borderRadius: "2.5rem"
            }}>
              <div className="card-body p-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="text-white">
                    <i className="bi bi-person-circle me-2"></i>
                    שלום {userName}
                  </div>
                  <button 
                    className="btn btn-lg fw-bold"
                    onClick={() => navigate('/history')}
                    style={{
                      borderRadius: "1.2rem",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease"
                    } as React.CSSProperties}
                  >
                    <i className="bi bi-journal-bookmark me-2"></i>ההיסטוריה שלי
                  </button>
                </div>
                
                <div className="text-center mb-5">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{
                    width: "100px",
                    height: "100px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
                    border: "3px solid rgba(255, 255, 255, 0.3)"
                  }}>
                    <i className="bi bi-brain text-white" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h1 className="display-4 fw-bold mb-3" style={{ 
                    color: "white",
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}>AI Learning Hub</h1>
                  <p className="lead mb-0" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2rem" }}>Unlock your potential with personalized AI-powered learning</p>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <div className="form-floating">
                      <select
                        id="category"
                        className="form-select form-select-lg premium-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                        style={{
                          borderRadius: "1.2rem",
                          fontSize: "1.1rem",
                          padding: "1.5rem 1.5rem 0.5rem 1.5rem",
                          height: "4rem"
                        }}
                      >
                        <option value="" disabled>Choose your learning path</option>
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <label htmlFor="category" className="fw-semibold text-muted">
                        <i className="bi bi-collection me-2"></i>Learning Category
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <select
                        id="option"
                        className="form-select form-select-lg premium-select force-dropdown-down"
                        value={selectedOption}
                        onChange={handleOptionChange}
                        required
                        disabled={!selectedCategory || subcategoriesLoading}
                        style={{
                          borderRadius: "1.2rem",
                          fontSize: "1.1rem",
                          padding: "1.5rem 1.5rem 0.5rem 1.5rem",
                          height: "4rem",
                          backgroundColor: !selectedCategory ? "rgba(248, 249, 250, 0.8)" : "",
                          position: "relative",
                          zIndex: 1
                        }}
                      >
                        <option value="">
                          {subcategoriesLoading ? 'Loading topics...' : 'Select your focus area'}
                        </option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <label htmlFor="option" className="fw-semibold text-muted">
                        <i className="bi bi-bookmark me-2"></i>Study Material
                      </label>
                    </div>
                  </div>

                  {selectedCategory && selectedOption && (
                    <div className="col-12">
                      <div className="card border-0" style={{
                        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                        borderRadius: "1.5rem"
                      }}>
                        <div className="card-body p-4">
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            if (selectedCategory && selectedOption && promptText.trim()) {
                              navigate('/ai-response', {
                                state: {
                                  category: selectedCategory,
                                  subcategory: selectedOption,
                                  prompt: promptText
                                }
                              });
                            }
                          }}>
                            <div className="form-floating mb-4">
                              <textarea
                                id="prompt"
                                className="form-control premium-textarea"
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                                required
                                placeholder="What would you like to learn about?"
                                style={{
                                  borderRadius: "1.2rem",
                                  minHeight: "160px",
                                  fontSize: "1.1rem",
                                  padding: "2rem 1.5rem 0.5rem 1.5rem"
                                }}
                              />
                              <label htmlFor="prompt" className="fw-semibold text-muted">
                                <i className="bi bi-chat-dots me-2"></i>Your Learning Question
                              </label>
                            </div>
                            <div className="d-grid">
                              <button 
                                type="submit" 
                                className="btn btn-lg fw-bold text-white w-100" 
                                disabled={!promptText.trim()}
                                style={{
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  border: "none",
                                  borderRadius: "1rem",
                                  padding: "1rem 2rem",
                                  fontSize: "1.1rem",
                                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                                  transition: "all 0.3s ease"
                                } as React.CSSProperties}
                              >
                                <i className="bi bi-rocket-takeoff me-2"></i>
                                Start Learning
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!selectedCategory && (
                  <div className="text-center mt-4">
                    <div className="row g-3">
                      <div className="col-4">
                        <div className="p-3 rounded-3" style={{ background: "rgba(102, 126, 234, 0.1)" }}>
                          <i className="bi bi-lightbulb text-primary" style={{ fontSize: "1.5rem" }}></i>
                          <div className="small fw-semibold mt-2 text-white">Smart</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-3 rounded-3" style={{ background: "rgba(118, 75, 162, 0.1)" }}>
                          <i className="bi bi-person-check text-primary" style={{ fontSize: "1.5rem" }}></i>
                          <div className="small fw-semibold mt-2 text-white">Personal</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-3 rounded-3" style={{ background: "rgba(102, 126, 234, 0.1)" }}>
                          <i className="bi bi-graph-up text-primary" style={{ fontSize: "1.5rem" }}></i>
                          <div className="small fw-semibold mt-2 text-white">Effective</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learning;

