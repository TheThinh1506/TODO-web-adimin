
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// **ĐIỂM KẾT NỐI API QUAN TRỌNG:** Thay thế bằng URL Backend Server của bạn.
const API_BASE_URL = 'http://localhost:8080/api'; 

const LoginForm = () => {
    
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();
    const recentlyUsedUser = {
    name: 'Smith',
    timeUsed: '5 ngày trước',
    avatarUrl: '/images/avatar.jpg' 
    };

    // HÀM XỬ LÝ ĐĂNG NHẬP
    const handleSubmit = async (e) => {
        e.preventDefault(); // <-- QUAN TRỌNG: Ngăn chặn tải lại trang
        // ... (Tất cả logic đăng nhập và gọi API giữ nguyên) ...
        setError('');
        setIsLoading(true);

        if (!account || !password) {
            setError('Vui lòng nhập đầy đủ Tài khoản và Mật khẩu.');
            setIsLoading(false);
            return;
        }

        try {
            // GỌI API ĐĂNG NHẬP SẼ ĐƯỢC KÍCH HOẠT KHI NHẤN ENTER
            const response = await axios.post(`${API_BASE_URL}/admin/login`, {
                account: account,
                password: password,
            });

            if (response.data && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userRole', response.data.role); 
                alert('Đăng nhập thành công!');
                navigate('/dashboard'); 
            } else {
                 setError('Phản hồi server không hợp lệ.');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi: Không thể kết nối hoặc tài khoản/mật khẩu không đúng.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-content-wrapper">
            <h2 className="form-title">Please enter your account</h2>
            
           
            <form onSubmit={handleSubmit} className="login-form-container">
                
                {/* Input Account */}
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Account"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        className="login-input"
                        disabled={isLoading}
                    />
                </div>
                
                {/* Input Password */}
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        disabled={isLoading}
                    />
                </div>
                
                {/* Hiển thị lỗi */}
                {error && <p className="error-message">{error}</p>}

                   
                {/* GIỮ NÚT SUBMIT ẨN: Đây là cách tốt nhất về mặt kỹ thuật */}
                <button type="submit" className="hidden-submit-button" disabled={isLoading} style={{display: 'none'}}>
                    Đăng nhập bằng Enter
                </button>
            </form>
</div>
    );
};

export default LoginForm;