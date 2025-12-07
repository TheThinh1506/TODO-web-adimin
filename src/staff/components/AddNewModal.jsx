import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/AddNewModal.css'; 

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 

const AddNewModal = ({ onClose, onInviteSuccess }) => {
    
    const [inviteCode, setInviteCode] = useState('Loading...'); 
    const [emailInput, setEmailInput] = useState('');
    const [invitedList, setInvitedList] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    const currentWorkspaceId = localStorage.getItem('currentWorkspaceId');

    useEffect(() => {
        if (currentWorkspaceId) {
            setInviteCode(`WS-${currentWorkspaceId}-${Math.floor(Math.random() * 10000)}`);
        } else {
            setInviteCode("NO-WORKSPACE-ID");
        }
    }, [currentWorkspaceId]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(inviteCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const email = emailInput.trim();
            if (!email) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Email không hợp lệ!");
                return;
            }

            if (invitedList.some(item => item.email === email)) {
                alert('Email này đã có trong danh sách chờ!');
                return;
            }

            // Thêm vào danh sách (Mặc định Member, không cho chọn nữa)
            setInvitedList([
                ...invitedList, 
                { email: email, role: 'Member' }
            ]);
            setEmailInput(''); 
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setInvitedList(invitedList.filter(item => item.email !== emailToRemove));
    };

    const handleInviteClick = async () => {
        if (invitedList.length === 0) {
            alert("Vui lòng nhập ít nhất 1 email!");
            return;
        }
        if (!currentWorkspaceId) {
            alert("Lỗi: Không tìm thấy Workspace ID.");
            return;
        }

        setIsLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');

            const promises = invitedList.map(member => {
                return axios.post(
                    `${API_BASE_ROOT}/api/workspaces/${currentWorkspaceId}/add`,
                    { email: member.email, role: 'Member' }, // Mặc định role Member
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );
            });

            await Promise.all(promises);

            alert("✅ Đã thêm thành viên thành công!");
            if (onInviteSuccess) onInviteSuccess(); 
            onClose();

        } catch (error) {
            console.error("Lỗi thêm nhân viên:", error);
            const msg = error.response?.data?.message || "Lỗi Server.";
            alert(`Lỗi: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-member-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="am-title">Thêm Nhân Viên Mới</h2>

                {/* Phần Mã Mời */}
                <div className="invite-code-section">
                    <span className="invite-label">Mã mời:</span>
                    <div className="code-box" onClick={handleCopyCode}>
                        <span className="copy-icon">❐</span>
                        <span className="invite-code-text">{inviteCode}</span>
                        {isCopied && <span style={{marginLeft:'10px', color:'green', fontSize:'12px'}}>Đã chép!</span>}
                    </div>
                </div>
                <hr style={{margin: '15px 0', borderTop: '1px solid #eee'}}/>

                {/* Phần Nhập Email */}
                <div className="search-email-box">
                    <span className="search-icon">✉️</span>
                    <input 
                        type="text" className="email-input" 
                        placeholder="Nhập email nhân viên & nhấn Enter..."
                        value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                
                <div className="selected-count">Danh sách chờ: {invitedList.length} người</div>

                {/* Danh sách (BỎ CỘT ROLE SELECTION) */}
                <div className="member-list-frame">
                    <div className="list-header">
                        <span style={{textAlign: 'left', flex: 1}}>Email</span>
                        <span style={{textAlign: 'center', width: '50px'}}>Xóa</span>
                    </div>
                    
                    <div className="list-scroll-area">
                        {invitedList.length === 0 ? (
                            <div style={{textAlign:'center', color:'#888', padding:'20px'}}>(Chưa nhập email nào)</div>
                        ) : (
                            invitedList.map((item, index) => (
                                <div key={index} className="email-item">
                                    <span className="email-text" style={{flex: 1}}>{item.email}</span>
                                    <div style={{width: '50px', textAlign:'center'}}>
                                        <button className="btn-remove" onClick={() => handleRemoveEmail(item.email)}>✕</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="am-actions">
                    <button className="btn-am btn-am-cancel" onClick={onClose}>Hủy</button>
                    <button className="btn-am btn-invite" onClick={handleInviteClick} disabled={isLoading}>
                        {isLoading ? 'Đang thêm...' : 'Thêm ngay'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewModal;