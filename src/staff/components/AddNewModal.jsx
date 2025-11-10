

import React, { useState } from 'react';
import '../style/AddNewModal.css'; 
import MemberSearchPopup from './MemberSearchPopup';




// --- COMPONENT MODAL CHÍNH ---
const AddNewModal = ({ onClose, onSave, mockStaffList }) => {
    
    // State quản lý tab (Mặc định là 'Nhân viên')
    const [activeTab, setActiveTab] = useState('Nhân viên');
    
    // --- State cho Tab 1: Thêm Nhân viên ---
    const [hoTen, setHoTen] = useState('');
    const [ngaySinh, setNgaySinh] = useState('');
    const [sdt, setSdt] = useState('');
    const [email, setEmail] = useState('');
    const [gioiTinh, setGioiTinh] = useState('Nam'); // Giá trị mặc định
    const [diaChi, setDiaChi] = useState('');

    // --- State cho Tab 2: Thêm Nhóm ---
    const [tenNhom, setTenNhom] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // State quản lý popup tìm kiếm

    // --- HÀM XỬ LÝ (TAB 1) ---
    const handleSaveEmployee = () => {
        const employeeData = { hoTen, ngaySinh, sdt, email, gioiTinh, diaChi };
        
        // **ĐIỂM KẾT NỐI API BACKEND (POST /api/users/create):**
        // Cần API để tạo nhân viên mới
        onSave(employeeData, 'Nhân viên');
    };

    // --- HÀM XỬ LÝ (TAB 2) ---
    const handleSaveGroup = () => {
        const groupData = { tenNhom, members: selectedMembers };
        
        // **ĐIỂM KẾT NỐI API BACKEND (POST /groups/create):**
        // API này bạn đã có.
        onSave(groupData, 'Nhóm');
    };

    // Thêm thành viên vào danh sách (từ popup)
    const handleAddMemberToGroup = (member) => {
        // Chỉ thêm nếu chưa tồn tại
        if (!selectedMembers.find(m => m.id === member.id)) {
            setSelectedMembers([...selectedMembers, member]);
        }
        setIsSearchOpen(false); // Đóng popup
    };

    // Xóa thành viên khỏi danh sách
    const handleRemoveMemberFromGroup = (memberId) => {
        setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
    };

    // Hàm Save chính (dựa trên tab đang active)
    const handleSaveClick = () => {
        if (activeTab === 'Nhân viên') {
            handleSaveEmployee();
        } else {
            handleSaveGroup();
        }
    };


    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Ngăn click xuyên qua lớp phủ */}
            <div className="modal-content-staff" onClick={(e) => e.stopPropagation()}>
                
                {/* Header (Tabs) */}
                <div className="modal-tabs-staff">
                    <button 
                        className={`modal-tab-btn-staff ${activeTab === 'Nhân viên' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Nhân viên')}
                    >
                        Nhân viên
                    </button>
                    <button 
                        className={`modal-tab-btn-staff ${activeTab === 'Nhóm' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Nhóm')}
                    >
                        Nhóm
                    </button>
                </div>

                {/* Nội dung (Dựa trên Tab) */}
                <div className="modal-body-staff">
                    
                    {/* ---- TAB 1: THÊM NHÂN VIÊN (Bố cục mới) ---- */}
                    {activeTab === 'Nhân viên' && (
                        <div className="form-container-staff">
                            {/* Avatar */}
                            <div className="avatar-placeholder">
                              
                            </div>

                            {/* Lưới Form 2 cột */}
                            <div className="employee-form-grid">
                                <label htmlFor="hoTen">Họ tên:</label>
                                <input id="hoTen" type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} />

                                <label htmlFor="ngaySinh">Ngày sinh:</label>
                                <div className="date-input-wrapper">
                                    <input id="ngaySinh" type="date" value={ngaySinh} onChange={(e) => setNgaySinh(e.target.value)} />
                                </div>

                                <label htmlFor="sdt">SĐT:</label>
                                <input id="sdt" type="text" value={sdt} onChange={(e) => setSdt(e.target.value)} />

                                <label htmlFor="email">Email:</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                                <label>Giới tính:</label>
                                <div className="checkbox-group">
                                    <input type="checkbox" id="nam" checked={gioiTinh === 'Nam'} onChange={() => setGioiTinh('Nam')} />
                                    <label htmlFor="nam">Nam</label>
                                    <input type="checkbox" id="nu" checked={gioiTinh === 'Nữ'} onChange={() => setGioiTinh('Nữ')} />
                                    <label htmlFor="nu">Nữ</label>
                                </div>

                                <label htmlFor="diaChi">Địa chỉ:</label>
                                <input id="diaChi" type="text" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} />
                            </div>

                            {/* Nút Save/Cancel (Nằm trong form) */}
                            <div className="form-actions-staff">
                                <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
                                <button type="button" className="btn btn-save" onClick={handleSaveClick}>Save</button>
                            </div>
                        </div>
                    )}

                    {/* ---- TAB 2: THÊM NHÓM (Bố cục mới) ---- */}
                    {activeTab === 'Nhóm' && (
                        <div className="form-container-group">
                            {/* Tên nhóm */}
                            <div className="form-group-staff full-width">
                                <label>Tên nhóm:</label>
                                <input type="text" value={tenNhom} onChange={(e) => setTenNhom(e.target.value)} />
                            </div>
                            
                            {/* Thành viên */}
                            <div className="form-group-staff full-width">
                                <label>Thành viên:</label>
                                <div className="member-list-group">
                                    {selectedMembers.map(member => (
                                        <span key={member.id} className="employee-tag">
                                            {member.name}
                                            <button 
                                                type="button" 
                                                className="remove-employee-btn"
                                                onClick={() => handleRemoveMemberFromGroup(member.id)}
                                            >
                                                <img src="/images/error.png" alt="Xóa" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="add-member-popup-container">
                                    <button 
                                        type="button" 
                                        className="add-member-btn-group"
                                        onClick={() => setIsSearchOpen(true)}
                                    >
                                        + Add
                                    </button>

                                    {/* Popup Tìm kiếm (Hiển thị có điều kiện) */}
                                    {isSearchOpen && (
                                        <MemberSearchPopup 
                                            mockStaffList={mockStaffList}
                                            onAddMember={handleAddMemberToGroup}
                                            onClosePopup={() => setIsSearchOpen(false)}
                                        />
                                    )}
                                </div>
                            </div>

                             {/* Nút Save/Cancel (Nằm trong form) */}
                             <div className="form-actions-staff">
                                <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
                                <button type="button" className="btn btn-save" onClick={handleSaveClick}>Save</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AddNewModal;