
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 
const API_BASE_URL = `${API_BASE_ROOT}/api/auth`;

const LoginForm = () => {
    
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();
   

    useEffect(() => {
        if (error) { 
            const timerId = setTimeout(() => {
                setError(''); 
            }, 3000); 

           
            return () => {
                clearTimeout(timerId);
            };
        }
    }, [error]); 

    
    // HÀM XỬ LÝ ĐĂNG NHẬP
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setIsLoading(true);

        if (!account || !password) {
            setError('Vui lòng nhập đầy đủ Tài khoản và Mật khẩu.');
            setIsLoading(false);
            return;
        }

        try {
         
            const response = await axios.post(`${API_BASE_URL}/sign-in`, {
                email: account,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken); 
                
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

            
                <button type="submit" className="hidden-submit-button" disabled={isLoading} style={{display: 'none'}}>
                    Đăng nhập bằng Enter
                </button>
            </form>
</div>
    );
};

export default LoginForm;