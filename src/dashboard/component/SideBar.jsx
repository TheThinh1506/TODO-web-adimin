

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    // (Hàm handleSignOut giữ nguyên)
     const handleSignOut = () => {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/'); 
    };

    // 3. Hàm helper để kiểm tra active (dựa trên đường dẫn URL)
    const isActive = (path) => {
        return location.pathname.startsWith(path); 
    };

    // (Dữ liệu user giả định giữ nguyên)
    const user = { name: 'TheThinh', id: '2352xxxx', avatarUrl: '/images/avatar.jpg' };

    return (
        <div className="sidebar">

            <div className="logo-section">
                <div className="task-logo-icon">
                    <img src="/images/task-icon.jpg" alt="Avatar" className="avatar" />
                </div>
                <h2 className="sidebar-logo-text">TO–DO</h2>
            </div>


            <nav className="nav-links">
                {/* 4. Cập nhật các tab để sử dụng navigate và kiểm tra active */}
                <div 
                    className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={() => navigate('/dashboard')}
                >
                    
                    <span>Dashboard</span>
                </div>
                
                <div 
                    className={`nav-item ${isActive('/staff') ? 'active' : ''}`}
                    onClick={() => navigate('/staff')} 
                >
                 
                    <span>Staff</span>
                </div>
                
               
                <div 
                    className={`nav-item ${isActive('/jobs') ? 'active' : ''}`} 
                    onClick={() => navigate('/jobs')} 
                >
                   
                    <span>Jobs</span>
                </div>
                
                <div 
                    className={`nav-item ${isActive('/setting') ? 'active' : ''}`}
                    onClick={() => navigate('/setting')} 
                >
               
                    <span>Setting</span>
                </div>
            </nav>
            
         
            <div className="sidebar-footer">
                <div className="user-profile">
                    <img src={user.avatarUrl} alt={user.name} className="footer-avatar" />
                    <div className="user-info">
                        <span className="footer-username">{user.name}</span>
                        <span className="footer-userid">{user.id}</span>
                    </div>

                    <div className="notification-icon">🔔</div>
                </div>
                
                <div className="sign-out" onClick={handleSignOut}>

                    <span>Sign out</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;