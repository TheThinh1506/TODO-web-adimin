// src/staff/components/StaffDetails.jsx

import React from 'react';

const StaffDetails = ({ staff }) => {
    
    // Nếu không có nhân viên nào được chọn, hiển thị thông báo
    if (!staff) {
        return <div className="details-wrapper">Vui lòng chọn một nhân viên.</div>;
    }
    
    // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
    // Dữ liệu 'staff' này có thể là dữ liệu rút gọn từ danh sách.
    // Bạn có thể cần gọi API (GET /api/user-info/{staff.id}) để lấy
    // thông tin đầy đủ nhất khi component này được tải.

    return (
        <div className="details-wrapper">
            <h2 className="details-title">Thông tin nhân viên</h2>

       
            {/* Header (Avatar và Tên) */}
            <div className="details-header">
                <img src={staff.avatar || '/images/default-avatar.png'} alt={staff.name} className="details-avatar" />
                <div className="details-header-text">
                    <span className="details-name">{staff.name}</span>
                    <span className="details-email">{staff.email}</span>
                </div>
            </div>

            <hr className="details-divider" />

            {/* Bảng thông tin chi tiết */}
            <div className="details-info-grid">
                <span className="info-label">Họ tên:</span>
                <span className="info-value">{staff.name}</span>
                
                <span className="info-label">Ngày sinh:</span>
                <span className="info-value">{staff.birthday}</span>

                <span className="info-label">SĐT:</span>
                <span className="info-value">{staff.phone}</span>

                <span className="info-label">Email:</span>
                <span className="info-value">{staff.email}</span>

                <span className="info-label">Giới tính:</span>
                <span className="info-value">{staff.gender}</span>

                <span className="info-label">Địa chỉ:</span>
                <span className="info-value">{staff.address}</span>
            </div>
     </div>
    );
};

export default StaffDetails;