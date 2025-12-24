import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  category: string;
  subcategory: string;
  prompt: string;
}

const AIResponse: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const savedRef = useRef(false);
  const { user, token, getAuthHeaders } = useAuth();
  
  const state = location.state as LocationState | undefined;
  const { category, subcategory, prompt } = state || {};

  useEffect(() => {
    if (!category || !subcategory || !prompt) {
      navigate('/learning');
      return;
    }

    const generateResponse = async () => {
      try {
        // שליחת השאלה ל-OpenAI API עם קונטקסט
        const openaiResponse = await fetch(`${API_BASE_URL}/api/openai`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ 
            prompt, 
            category, 
            subcategory 
          })
        });
        
        const openaiData = await openaiResponse.json();
        
        if (openaiResponse.ok) {
          setAiResponse(openaiData.response);
        } else {
          // אם זו שגיאת AI, נציג הודעה מתאימה
          if (openaiData.isAIError) {
            const errorMessage = `⚠️ שגיאה בשירות ה-AI\n\n${openaiData.error}\n\nאנא נסה שוב מאוחר יותר או פנה לתמיכה טכנית.`;
            setAiResponse(errorMessage);
          } else {
            throw new Error(openaiData.error || 'שגיאה בקבלת תשובה מ-AI');
          }
        }
        
        const responseText = openaiData.response;
        
        // שמירה עם המשתמש הנוכחי
        if (user && token && !savedRef.current) {
          savedRef.current = true;
          try {
            // חיפוש המשתמש הנוכחי
            const userCheckResponse = await fetch(`${API_BASE_URL}/api/users/check`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ name: user.name, phone: user.phone })
            });
            const userData = await userCheckResponse.json();
            const currentUser = userData.exists ? userData.user : null;
            
            if (currentUser) {
              const promptData = {
                user_id: currentUser.id,
                prompt: prompt,
                response: responseText,
                category: category,
                subcategory: subcategory
              };
              
              await fetch(`${API_BASE_URL}/api/prompts`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(promptData)
              });
            }
          } catch (saveError) {
            console.error('שגיאה בשמירת פרומפט:', saveError);
          }
        }
        
      } catch (error) {
        console.error('שגיאה בשליחת הפרומפט:', error);
        const errorMessage = 'מצטער, אירעה שגיאה. נסה שוב.';
        setAiResponse(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    };

    generateResponse();
  }, [category, subcategory, prompt, navigate, user, token, getAuthHeaders]);

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh"
    }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card border-0 shadow-2xl" style={{
              borderRadius: "2rem",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)"
            }}>
              <div className="card-body p-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    }}>
                      <i className="bi bi-robot text-white" style={{ fontSize: "1.5rem" }}></i>
                    </div>
                    <div>
                      <h4 className="mb-0 fw-bold">AI Learning Assistant</h4>
                      <small className="text-muted">{category} • {subcategory}</small>
                    </div>
                  </div>
                  <div>
                    <button 
                      className="btn btn-outline-secondary me-2"
                      onClick={() => navigate('/history')}
                      style={{ borderRadius: "1rem" }}
                    >
                      <i className="bi bi-clock-history me-2"></i>History
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/learning')}
                      style={{ borderRadius: "1rem" }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>Back
                    </button>
                  </div>
                </div>

                <div className="card mb-4" style={{
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  borderRadius: "1.5rem",
                  border: "2px solid rgba(102, 126, 234, 0.2)"
                }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-question-circle me-2"></i>Your Question:
                    </h6>
                    <p className="mb-0" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                      {prompt}
                    </p>
                  </div>
                </div>

                <div className="card" style={{
                  background: aiResponse.includes('⚠️') ? 
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 101, 101, 0.1) 100%)" :
                    "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                  borderRadius: "1.5rem",
                  border: aiResponse.includes('⚠️') ? 
                    "2px solid rgba(239, 68, 68, 0.2)" :
                    "2px solid rgba(34, 197, 94, 0.2)"
                }}>
                  <div className="card-body p-4">
                    <h6 className={`fw-bold mb-3 ${aiResponse.includes('⚠️') ? 'text-danger' : 'text-success'}`}>
                      <i className={`bi ${aiResponse.includes('⚠️') ? 'bi-exclamation-triangle' : 'bi-lightbulb'} me-2`}></i>
                      {aiResponse.includes('⚠️') ? 'System Message:' : 'AI Response:'}
                    </h6>
                    {isGenerating ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5>Generating your personalized learning content...</h5>
                        <p className="text-muted">This may take a few moments</p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-3" style={{ 
                        background: aiResponse.includes('⚠️') ? 
                          "rgba(254, 242, 242, 0.8)" : 
                          "rgba(255, 255, 255, 0.7)" 
                      }}>
                        <p className="mb-0" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "1.1rem" }}>
                          {aiResponse}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!isGenerating && (
                  <div className="text-center mt-4">
                    <button 
                      className="btn btn-lg fw-bold text-white me-3"
                      onClick={() => navigate('/learning')}
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "1rem",
                        padding: "0.75rem 2rem"
                      } as React.CSSProperties}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Ask Another Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResponse;

