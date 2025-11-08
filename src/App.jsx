
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// 1. IMPORT TRANG DASHBOARD THẬT
import DashBoardPage from './dashboard/pages/DashBoardpage';




const isAuthenticated = () => {
    return localStorage.getItem('authToken') ? true : false;
};


const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return children;
};


function App() {

  
  return (
    // Bọc toàn bộ ứng dụng trong Router
    <Router>
      <Routes>
        {/* Tuyến đường Đăng nhập (Trang mặc định) */}
        <Route path="/" element={<LoginPage />} />

        {/* Tuyến đường Dashboard (Cần bảo vệ) */}
        <Route 
            path="/dashboard" 
            element={
               /* <ProtectedRoute>*/
                    <DashBoardPage />
              /*  </ProtectedRoute>*/
            } 
        />
      </Routes>
    </Router>
  );
}

export default App;