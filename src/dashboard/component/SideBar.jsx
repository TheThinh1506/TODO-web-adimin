

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
const API_BASE_ROOT = 'http://34.124.178.44:4000'; 
 const API_BASE_URL = `${API_BASE_ROOT}/api/auth`;
const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [usr, setUser] = useState({ name: 'Loading...', id: '...' });

     useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                
                 const accessToken = localStorage.getItem('accessToken');
                 const user_response = await axios.get(`${API_BASE_URL}/user-info`, {
                     headers: { 'Authorization': `Bearer ${accessToken}` }
                 });
                
                // (Dùng Mock Data thay thế)
                const response = { data: { username: "Smith", email: "2352xxxx" } }; 
                
                setUser({ name: user_response.data.username, id: user_response.data.email });

            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        };
        fetchUserInfo();
    }, []); // Chạy 1 lần

    
    const handleSignOut = async () => {
        try {
           
            const accessToken = localStorage.getItem('accessToken');
             const refreshToken = localStorage.getItem('refreshToken');
             await axios.post(`${API_BASE_URL}/sign-out`, 
                 { refreshToken: refreshToken }, 
                 { headers: { 'Authorization': `Bearer ${accessToken}` } } 
             );

        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/'); 
        }
    };

 
    const isActive = (path) => {
        return location.pathname.startsWith(path); 
    };

    // (Dữ liệu user giả định giữ nguyên)
    const user = { name: 'TheThinh', id: '2352xxxx', avatarUrl: '/images/avatar.jpg' };
    const handleNotificationClick = () => {
        navigate('/notification');
    };
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
                   
                    <span>Projects</span>
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

                    <div 
                        className="notification-icon" 
                        onClick={handleNotificationClick}   
                        style={{ cursor: 'pointer' }}       
                    >
                        🔔
                    </div>
                </div>
                
                <div className="sign-out" onClick={handleSignOut}>

                    <span>Sign out</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;