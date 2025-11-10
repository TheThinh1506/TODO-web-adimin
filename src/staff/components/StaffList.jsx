// src/staff/components/StaffList.jsx

import React from 'react';

const StaffList = ({ staffList, selectedStaffId, onSelectStaff, onDeleteStaff }) => {

    return (
        <div className="staff-list-container">
            {staffList.map(staff => (
                <div 
                    key={staff.id} 
                    // 1. KHI CLICK VÀO HÀNG, CHỌN NHÂN VIÊN
                    onClick={() => onSelectStaff(staff)}
                    className={`staff-item ${selectedStaffId === staff.id ? 'active' : ''}`}
                >
                    {/* Phần thông tin (avatar, tên) */}
                    <div className="staff-item-info">
                        <img src={staff.avatar || '/images/default-avatar.png'} alt={staff.name} className="staff-avatar" />
                        <span className="staff-name">{staff.name}</span>
                    </div>
                    
                    {/* Nút hành động (Xóa) */}
                    <div className="staff-item-actions">
                        
                        {/* 2. NÚT XÓA (SỬ DỤNG ICON X.PNG) */}
                        <button 
                            className="action-icon delete-icon" 
                            onClick={(e) => {
                                // 3. Ngăn sự kiện click lan ra thẻ <div> cha
                                e.stopPropagation(); 
                                onDeleteStaff(staff.id);
                            }}
                        >
                            <img src="/images/error.png" alt="Xóa" />
                        </button>
                        
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StaffList;