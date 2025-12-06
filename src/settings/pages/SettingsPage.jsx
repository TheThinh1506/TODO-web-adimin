import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../dashboard/component/SideBar';
import '../../dashboard/style/DashBoard.css'; 
import '../style/SettingsPage.css';
import NotificationSettings from '../components/NotificationSettings';


import { Search, User, Bell, HelpCircle, Camera } from 'lucide-react';

// **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
const API_BASE_ROOT = 'http://163.61.110.132:4000/api'; 

const SettingsPage = () => {
    
    // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
    const [activeTab, setActiveTab] = useState('Account'); // Tab đang chọn (Account/Notification/Support)
    
    // State lưu thông tin người dùng (Profile)
    const [profile, setProfile] = useState({
        fullName: '',        // Tên hiển thị
        department: '',      // Phòng ban
        userId: '',          // ID nhân viên
        email: '',           // Email
        mobile: '',          // Số điện thoại
        avatar: '/images/avatar.jpg' // Avatar mặc định
    });

    const [isLoading, setIsLoading] = useState(false);
    
    // Tham chiếu đến thẻ input file ẩn (để upload ảnh)
    const fileInputRef = useRef(null);


    // --- 2. HÀM GỌI API KHI TẢI TRANG (useEffect) ---
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                // **API CẦN BỔ SUNG: GET /api/auth/user-info (hoặc /api/user/profile)**
                // MỤC ĐÍCH: Lấy thông tin chi tiết của Admin đang đăng nhập.
                
                /* CODE GỌI API (Mẫu):
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(`${API_BASE_ROOT}/auth/user-info`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const data = response.data; 
                
                setProfile({
                    fullName: data.username,
                    department: data.department || 'Administration',
                    userId: data.user_id,
                    email: data.email,
                    mobile: data.phone_number,
                    avatar: data.avatar_url || '/images/avatar.jpg'
                });
                */

                // DÙNG MOCK DATA (Trong khi chờ API)
                setProfile({
                    fullName: 'Adam',
                    department: 'Administration',
                    userId: 'abcd1234',
                    email: 'Abcd@gmail.com',
                    mobile: '+0123456789',
                    avatar: '/images/avatar.jpg'
                });

            } catch (error) {
                console.error("Lỗi khi tải thông tin user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);


    // --- 3. CÁC HÀM XỬ LÝ SỰ KIỆN (LOGIC) ---

    // Xử lý thay đổi tên (Đồng bộ 2 chiều: Input -> State -> UI)
    const handleNameChange = (e) => {
        setProfile({ ...profile, fullName: e.target.value });
    };

    // Xử lý thay đổi các trường khác (Generic handler)
    const handleChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    // Mở hộp thoại chọn file ảnh khi click
    const handleTriggerFileSelect = () => {
        fileInputRef.current.click();
    };

    // Xử lý khi người dùng chọn file ảnh xong
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo URL tạm thời để xem trước ảnh ngay lập tức
            const previewUrl = URL.createObjectURL(file);
            setProfile({ ...profile, avatar: previewUrl });
            
            // **ĐIỂM KẾT NỐI API (UPLOAD ẢNH):**
            // Bạn cần gọi API để upload file ảnh này lên server ngay lập tức.
            /*
            const formData = new FormData();
            formData.append('avatar', file);
            axios.post(`${API_BASE_ROOT}/user/upload-avatar`, formData, { ... });
            */
        }
    };

    // Xử lý nút Save Changes
    const handleSaveChanges = () => {
        // **ĐIỂM KẾT NỐI API (CẬP NHẬT PROFILE):**
        // GỌI API: PUT /api/auth/update-profile
        // MỤC ĐÍCH: Gửi toàn bộ thông tin trong state 'profile' lên server để lưu.
        
        console.log("Đang lưu thông tin:", profile);
        alert("Đã lưu thay đổi thành công! (Mock)");
    };


    return (
        <div className="dashboard-container">
            {/* Sidebar bên trái */}
            <Sidebar /> 

            <div className="main-content">
                <header className="page-header">
                    <h1>Settings</h1>
                </header>

                {/* CONTAINER SETTINGS (BỐ CỤC 2 CỘT) */}
                <div className="settings-container">
                    
                    {/* --- CỘT TRÁI: MENU --- */}
                    <div className="settings-left-panel">
                        {/* Thanh tìm kiếm */}
                        <div className="settings-search">
                            <Search className="search-icon" size={18} />
                            <input type="text" placeholder="Search setting..." />
                        </div>

                        {/* Menu Items */}
                        <nav className="settings-menu">
                            <div 
                                className={`menu-item ${activeTab === 'Account' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Account')}
                            >
                                <User size={20} />
                                <span>Account</span>
                            </div>
                            
                            <div 
                                className={`menu-item ${activeTab === 'Notifications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Notifications')}
                            >
                                <Bell size={20} />
                                <span>Notifications</span>
                            </div>
                            
                            <div 
                                className={`menu-item ${activeTab === 'Support' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Support')}
                            >
                                <HelpCircle size={20} />
                                <span>Support</span>
                            </div>
                        </nav>
                    </div>

                    {/* --- CỘT PHẢI: NỘI DUNG CHI TIẾT --- */}
                    <div className="settings-right-panel">
                        {activeTab === 'Notifications' && (
        <NotificationSettings />
    )}
                        {/* HIỂN THỊ NỘI DUNG DỰA TRÊN TAB ACTIVE */}
                        {activeTab === 'Account' && (
                            <div className="account-content">
                                
                                {/* 1. PHẦN AVATAR & TÊN LỚN */}
                                <div className="profile-header">
                                    {/* Khối chứa ảnh (có hiệu ứng hover) */}
                                    <div className="avatar-wrapper" onClick={handleTriggerFileSelect}>
                                        <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
                                        
                                        {/* Lớp phủ icon Camera khi hover */}
                                        <div className="avatar-overlay">
                                            <Camera size={24} color="#FFF"/>
                                        </div>
                                    </div>
                                    
                                    {/* Input file ẩn (để xử lý logic chọn file) */}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleAvatarChange} 
                                        style={{ display: 'none' }} 
                                        accept="image/*"
                                    />

                                    {/* Tên hiển thị lớn */}
                                    <h2 className="profile-name-large">
                                        {profile.fullName || 'Your Full Name'}
                                    </h2>
                                    
                                    {/* Text 'Change your photo' */}
                                    <span className="change-photo-text" onClick={handleTriggerFileSelect}>
                                        Change your photo
                                    </span>
                                </div>

                                {/* 2. FORM ĐIỀN THÔNG TIN */}
                                <div className="profile-form">
                                    
                                    {/* Input Name */}
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input 
                                            type="text" 
                                            value={profile.fullName} 
                                            onChange={handleNameChange} // Gọi hàm đồng bộ tên
                                            className="input-underline"
                                        />
                                    </div>

                                    {/* Hàng đôi: Department & ID */}
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Department</label>
                                            <input 
                                                type="text" 
                                                value={profile.department} 
                                                onChange={(e) => handleChange('department', e.target.value)}
                                                className="input-underline"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>ID</label>
                                            <input 
                                                type="text" 
                                                value={profile.userId} 
                                                onChange={(e) => handleChange('userId', e.target.value)}
                                                className="input-underline"
                                                readOnly // ID thường không cho sửa
                                            />
                                            
                                        </div>
                                    </div>

                                    {/* Input Email */}
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            value={profile.email} 
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className="input-underline"
                                        />
                                    </div>

                                    {/* Input Mobile */}
                                    <div className="form-group">
                                        <label>Mobile</label>
                                        <input 
                                            type="text" 
                                            value={profile.mobile} 
                                            onChange={(e) => handleChange('mobile', e.target.value)}
                                            className="input-underline"
                                        />
                                    </div>

                                    {/* Nút Save */}
                                    <div className="form-actions">
                                        <button className="save-btn" onClick={handleSaveChanges}>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* (Các tab khác như Notifications, Support có thể thêm sau) */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;