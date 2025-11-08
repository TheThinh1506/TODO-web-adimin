// src/components/Sidebar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
// import icons... 

const Sidebar = () => {
    const navigate = useNavigate();
    
    const handleSignOut = () => {
        // **ĐIỂM KẾT NỐI API BACKEND:** Đăng xuất
        // GỌI API /auth/sign-out để hủy token trên server (sử dụng accessToken)
        // Dùng axios.post('API_URL/auth/sign-out', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/'); 
    };

    
    const user = { name: 'TheThinh', id: '2352xxxx', avatarUrl: '/images/avatar.jpg' };
    
    return (
        <div className="sidebar">
            
            {/* Logo */}
            <div className="logo-section">
                <div className="task-logo-icon">
                    <img src="/images/task-icon.jpg" alt="Avatar" className="avatar" />
                </div>
                 <h2 className="sidebar-logo-text">TO–DO</h2>
            </div>
            
            {/* Navigation Links */}
            <nav className="nav-links">
                <div className="nav-item active" onClick={() => navigate('/dashboard')}>
                    {/*  */}
                    <span>Dashboard</span>
                </div>
                <div className="nav-item">
                    {/*  */}
                    <span>Staff</span>
                </div>
                <div className="nav-item">
                    {/*  */}
                    <span>Schedule</span>
                </div>
                <div className="nav-item">
                    {/*  */}
                    <span>Setting</span>
                </div>
            </nav>
            
            {/* User Profile and Sign Out */}
            <div className="sidebar-footer">
                <div className="user-profile">
                    <img src={user.avatarUrl} alt={user.name} className="footer-avatar" />
                    <div className="user-info">
                        <span className="footer-username">{user.name}</span>
                        <span className="footer-userid">{user.id}</span>
                    </div>
                    {/* Icon thông báo (bell/notification) */}
                    <div className="notification-icon">🔔</div>
                </div>
                
                <div className="sign-out" onClick={handleSignOut}>
                    {/*  */}
                    <span>Sign out</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;