
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login/pages/LoginPage';

import DashBoardPage from './dashboard/pages/DashBoardpage';

import JobsPage from './jobs/pages/Jobspage';
import StaffPage from './staff/pages/StaffPage';
import SettingsPage from './settings/pages/SettingsPage';
import ProjectDetail from './project/pages/ProjectDetail';
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
              //  <ProtectedRoute>
                    <DashBoardPage />
              //  </ProtectedRoute>
            } 
        />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route 
            path="/jobs" // <-- Đổi từ /schedule
            element={
          //  <ProtectedRoute> 
              <JobsPage />
          //  </ProtectedRoute>
            } 
        />
        <Route 
            path="/staff" 
            element={
            // <ProtectedRoute>
              <StaffPage />
            // </ProtectedRoute>
            }    
        />
        <Route 
            path="/setting" 
            element={
            // <ProtectedRoute>
              <SettingsPage />
            // </ProtectedRoute>
            }
            />
      </Routes>
    </Router>
  );
}

export default App;