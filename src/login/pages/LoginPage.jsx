import React from 'react' ;
import LoginForm from "../components/LoginForm";
import "../styles/LoginPage.css";

const LoginPage = () => {
  return (
    <div className="app-container">
       
        <div className="login-main-wrapper">
            
            {/* KHỐI TRÁI: Logo và Slogan */}
            <div className="left-content">
                
                {/* ToDo Avatar Icon */}
                <div className="todo-icon">
                    {/*  */}
                    <img src="/images/task-icon.jpg" alt="Avatar" className="avatar" />
                </div>
                
                {/* Logo Text */}
                <h1 className="logo-text">TO DO</h1>

                {/* Slogan */}
                <div className="slogan-container">
                    <p className="slogan-line">Organize your life.</p>
                    <p className="slogan-line">Free your mind.</p>
                </div>
            </div>

            {/* KHỐI PHẢI: Form Đăng nhập */}
            <div className="right-content">
                <LoginForm />
            </div>
        </div>
    </div>
  );
};

export default LoginPage;