import React, { useState } from 'react';
import axios from 'axios';
import '../style/AddGroupMemberModal.css';

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 

const AddGroupMemberModal = ({ onClose, groupId, existingStaffList }) => {
    
    const [inviteCode, setInviteCode] = useState(`GROUP-${groupId}-${Math.floor(Math.random()*1000)}`); 
    const [emailInput, setEmailInput] = useState('');
    const [invitedList, setInvitedList] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            const email = emailInput.trim();
            
            if (!email) return;

            if (invitedList.some(item => item.email === email)) {
                alert('Email này đã có trong danh sách chờ!');
                return;
            }

          
            const listToCheck = existingStaffList || [];
            const foundUser = listToCheck.find(
                u => u.email.toLowerCase() === email.toLowerCase()
            );

            if (!foundUser) {
                alert('Không tìm thấy nhân viên này trong Workspace!');
                return;
            }

       
            const newUser = {
                email: foundUser.email,
                name: foundUser.name || "No Name",
                userId: foundUser.id, 
                role: 'Member' 
            };

            setInvitedList([...invitedList, newUser]);
            setEmailInput('');
        }
    };

    // --- HÀM ĐỔI ROLE (MỚI THÊM VÀO) ---
    const handleRoleChange = (email, newRole) => {
        setInvitedList(prev => prev.map(item => 
            item.email === email ? { ...item, role: newRole } : item
        ));
    };

    const handleRemoveUser = (emailToRemove) => {
        setInvitedList(invitedList.filter(user => user.email !== emailToRemove));
    };

    // --- GỌI API ---
    const handleInviteClick = async () => {
        if (invitedList.length === 0) {
            alert("Danh sách trống!");
            return;
        }

        setIsLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');

            const promises = invitedList.map(user => {
                return axios.post(
                    `${API_BASE_ROOT}/api/groups/add-member`,
                    {
                        group_id: groupId,
                        member_email: user.email,
                        role: user.role 
                    },
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );
            });

            await Promise.all(promises);

            alert(" Đã thêm thành viên vào nhóm thành công!");
            onClose(); 

        } catch (error) {
            console.error("Lỗi thêm thành viên:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra.";
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '650px'}}>
                
                <div className="modal-header" style={{textAlign: 'center'}}>
                    <h2 className="modal-title">Add Member to Group</h2>
                </div>

                <div className="modal-body">
                    {/* Invite Code */}
                    <div className="invite-code-container">
                        <strong style={{marginRight: '10px'}}>Invite code:</strong>
                        <span style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>{inviteCode}</span>
                    </div>

                    {/* Input */}
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="full-width-input"
                            placeholder="Nhập email nhân viên & nhấn Enter..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>
                        Đã chọn {invitedList.length} người
                    </div>

                    {/* List Table */}
                    <div className="member-list-scroll">
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead style={{background: '#f8f9fa', position: 'sticky', top: 0}}>
                                <tr>
                                    <th style={{padding: '10px', textAlign: 'left'}}>Staff</th>
                                    <th style={{padding: '10px', textAlign: 'left', width: '120px'}}>Role</th>
                                    <th style={{padding: '10px', textAlign: 'center', width: '60px'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitedList.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#999'}}>(Trống)</td>
                                    </tr>
                                ) : (
                                    invitedList.map((user, index) => (
                                        <tr key={index} style={{borderBottom: '1px solid #eee'}}>
                                            <td style={{padding: '10px'}}>
                                                <div style={{fontWeight: 'bold'}}>{user.email}</div>
                                                <div style={{fontSize: '11px', color: '#666'}}>{user.name}</div>
                                            </td>
                                       
                                            <td style={{padding: '10px'}}>
                                                <select 
                                                    className="role-select-box"
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                                >
                                                    <option value="Member">Member</option>
                                                    <option value="Leader">Leader</option>
                                                </select>
                                            </td>
                                            <td style={{padding: '10px', textAlign: 'center'}}>
                                                <button onClick={() => handleRemoveUser(user.email)} className="btn-remove-icon">✕</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="modal-footer" style={{justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                    <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn btn-save" onClick={handleInviteClick} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Invite'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddGroupMemberModal;