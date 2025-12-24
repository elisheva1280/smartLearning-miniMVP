import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

interface User {
  _id: string;
  name: string;
  phone: string;
}

const UsersComponent: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { getAuthHeaders } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users`, {
                    headers: getAuthHeaders()
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('API did not return an array:', data);
                    setUsers([]);
                }
            } catch (error) {
                console.error('שגיאה בטעינת המשתמשים:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [getAuthHeaders]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">טוען...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">משתמשים</h1>
                <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/admin')}
                >
                    <i className="bi bi-arrow-right me-2"></i>חזרה לפאנל מנהל
                </button>
            </div>
            <ul className="list-group shadow-sm" style={{ borderRadius: "1rem" }}>
                {users.length === 0 ? (
                    <li className="list-group-item text-center py-4">לא נמצאו משתמשים</li>
                ) : (
                    users.map(user => (
                        <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                            <div>
                                <span className="fw-bold">{user.name}</span>
                                <span className="text-muted ms-3">{user.phone}</span>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default UsersComponent;

