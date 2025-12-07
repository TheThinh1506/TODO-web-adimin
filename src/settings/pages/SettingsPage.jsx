import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../dashboard/component/SideBar';
import '../../dashboard/style/DashBoard.css'; 
import '../style/SettingsPage.css';
import NotificationSettings from '../components/NotificationSettings';
import axios from 'axios'; // Đảm bảo đã import axios

// Import thêm icon Github
import { Search, User, Bell, HelpCircle, Camera } from 'lucide-react';
import { FaGithub } from "react-icons/fa";

const API_BASE_ROOT = 'http://163.61.110.132:4000/api'; 


const GITHUB_CLIENT_ID = "Ov23liR8Ul1SptrfAce0"; 
const REDIRECT_URI = "http://localhost:5173/settings"; 

const SettingsPage = () => {
    
    const [activeTab, setActiveTab] = useState('Account');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // State Profile (Thêm trường isGithubConnected)
    const [profile, setProfile] = useState({
        fullName: '',
        department: '',
        userId: '',
        email: '',
        mobile: '',
        avatar: '/images/avatar.jpg',
        isGithubConnected: false 
    });

    // --- 1. USE EFFECT: LẤY THÔNG TIN & XỬ LÝ CALLBACK GITHUB ---
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const githubCode = queryParams.get('code');

        if (githubCode) {
            handleGithubCallback(githubCode);
        } else {
            fetchUserProfile();
        }
    }, []);


    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            // **API: GET /api/auth/user-info**
            /*
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_BASE_ROOT}/auth/user-info`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const data = response.data;
            setProfile({
                ...profile,
                fullName: data.username,
                // ... các trường khác
                isGithubConnected: data.github_id ? true : false // Kiểm tra xem user đã có github_id chưa
            });
            */

    
            setProfile({
                fullName: 'Adam',
                department: 'Administration',
                userId: 'abcd1234',
                email: 'Abcd@gmail.com',
                mobile: '+0123456789',
                avatar: '/images/avatar.jpg',
                isGithubConnected: false 
            });
        } catch (error) {
            console.error("Lỗi tải profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm gửi mã Code xuống Backend để lấy Access Token và Link tài khoản
    const handleGithubCallback = async (code) => {
        try {
            console.log("Nhận được GitHub Code:", code);
            const accessToken = localStorage.getItem('accessToken');

            // **API QUAN TRỌNG: POST /api/auth/link-github**
            // Body: { code: "mã_từ_github" }
            /*
            await axios.post(`${API_BASE_ROOT}/auth/link-github`, 
                { code },
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            alert("Liên kết GitHub thành công!");
            */
            
            alert(`Liên kết thành công với mã: ${code}`);
            setProfile(prev => ({ ...prev, isGithubConnected: true }));
            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
            console.error("Lỗi liên kết GitHub:", error);
            alert("Liên kết thất bại.");
        }
    };

    const handleConnectGithub = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
        window.location.href = githubAuthUrl;
    };

    const handleNameChange = (e) => setProfile({ ...profile, fullName: e.target.value });
    const handleChange = (field, value) => setProfile({ ...profile, [field]: value });
    const handleTriggerFileSelect = () => fileInputRef.current.click();
    
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setProfile({ ...profile, avatar: previewUrl });
        }
    };

    const handleSaveChanges = () => {
        console.log("Saving...", profile);
        alert("Saved!");
    };

    return (
        <div className="dashboard-container">
            <Sidebar /> 
            <div className="main-content">
                <header className="page-header">
                    <h1>Settings</h1>
                </header>

                <div className="settings-container">
                    {/* CỘT TRÁI (Giữ nguyên) */}
                    <div className="settings-left-panel">
                        <div className="settings-search">
                            <Search className="search-icon" size={18} />
                            <input type="text" placeholder="Search setting..." />
                        </div>
                        <nav className="settings-menu">
                            <div className={`menu-item ${activeTab === 'Account' ? 'active' : ''}`} onClick={() => setActiveTab('Account')}>
                                <User size={20} /> <span>Account</span>
                            </div>
                            <div className={`menu-item ${activeTab === 'Notifications' ? 'active' : ''}`} onClick={() => setActiveTab('Notifications')}>
                                <Bell size={20} /> <span>Notifications</span>
                            </div>
                            <div className={`menu-item ${activeTab === 'Support' ? 'active' : ''}`} onClick={() => setActiveTab('Support')}>
                                <HelpCircle size={20} /> <span>Support</span>
                            </div>
                        </nav>
                    </div>

                    {/* CỘT PHẢI */}
                    <div className="settings-right-panel">
                        {activeTab === 'Notifications' && <NotificationSettings />}
                        
                        {activeTab === 'Account' && (
                            <div className="account-content">
                                {/* Phần Avatar (Giữ nguyên) */}
                                <div className="profile-header">
                                    <div className="avatar-wrapper" onClick={handleTriggerFileSelect}>
                                        <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
                                        <div className="avatar-overlay"><Camera size={24} color="#FFF"/></div>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*"/>
                                    <h2 className="profile-name-large">{profile.fullName || 'Your Full Name'}</h2>
                                    <span className="change-photo-text" onClick={handleTriggerFileSelect}>Change your photo</span>
                                </div>

                                {/* Form Thông tin */}
                                <div className="profile-form">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" value={profile.fullName} onChange={handleNameChange} className="input-underline" />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Department</label>
                                            <input type="text" value={profile.department} onChange={(e) => handleChange('department', e.target.value)} className="input-underline" />
                                        </div>
                                        <div className="form-group">
                                            <label>ID</label>
                                            <input type="text" value={profile.userId} readOnly className="input-underline" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={profile.email} onChange={(e) => handleChange('email', e.target.value)} className="input-underline" />
                                    </div>

                                    <div className="form-group">
                                        <label>Mobile</label>
                                        <input type="text" value={profile.mobile} onChange={(e) => handleChange('mobile', e.target.value)} className="input-underline" />
                                    </div>

                                    {/* --- PHẦN MỚI: LINKED ACCOUNTS --- */}
                                    <div className="linked-accounts-section">
                                        <label className="section-label">Linked Accounts</label>
                                        
                                        {profile.isGithubConnected ? (
                                            <div className="connected-badge">
                                                <Github size={20} />
                                                <span>GitHub Connected</span>
                                                <button className="unlink-btn" onClick={() => alert("Chức năng hủy liên kết chưa làm")}>Unlink</button>
                                            </div>
                                        ) : (
                                            <button className="github-connect-btn" onClick={handleConnectGithub}>
                                                <FaGithub size={20} />
                                                <span>Connect GitHub Account</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;