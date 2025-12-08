import React, { useState } from 'react';
import '../style/StaffPage.css';

const GroupList = ({ groups, selectedStaffId, onSelectStaff, onDeleteStaff, onDeleteGroup, onAddMember }) => {

    const [expandedGroupId, setExpandedGroupId] = useState(null);
    const [menuGroupId, setMenuGroupId] = useState(null);

    const toggleExpand = (groupId) => {
        setExpandedGroupId(prev => (prev === groupId ? null : groupId));
    };

    const toggleMenu = (e, groupId) => {
        e.stopPropagation();
        setMenuGroupId(prev => (prev === groupId ? null : groupId));
    };

    return (
        <div className="group-list-container">
            {!groups || groups.length === 0 ? (
                <div className="empty-text">Chưa có nhóm nào.</div>
            ) : (
                groups.map(group => {
                    const currentGroupId = group.id || group.group_id;
                    const memberCount = group.members ? group.members.length : 0;

                    return (
                        <div key={currentGroupId} className="group-item">
                            <div className="group-item-header" onClick={() => toggleExpand(currentGroupId)}>
                                <div className="group-actions">
                                    <button className="kebab-menu-btn" onClick={(e) => toggleMenu(e, currentGroupId)}>
                                        ⋮
                                    </button>
                                    
                                    {menuGroupId === currentGroupId && ( 
                                        <div className="kebab-dropdown">
                                            <button onClick={(e) => { e.stopPropagation(); onAddMember(currentGroupId); }}>
                                                + Thêm thành viên
                                            </button>
                                            <button className="btn-text-red" onClick={(e) => { e.stopPropagation(); onDeleteGroup(currentGroupId); }}>
                                                Xóa nhóm
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="group-info-row">
                                    <span className="group-name">{group.name}</span>
                                    <span className="member-count-badge">({memberCount})</span>
                                </div>

                                <span className={`group-toggle-arrow ${expandedGroupId === currentGroupId ? 'expanded' : ''}`}>
                                    ▼
                                </span>
                            </div>

                            {expandedGroupId === currentGroupId && (
                                <div className="member-list">
                                    {memberCount > 0 ? (
                                        group.members.map((member, index) => {
                                            
                                           
                                            const isManager = member.role === 'Manager'; 
                                            const managerStyle = {
                                                fontWeight: isManager ? '700' : '500',
                                                color: isManager ? '#000080' : '#333' 
                                            };
                                            
                                            return (
                                                <div 
                                                    key={member.id || index} 
                                                    className={`staff-item ${selectedStaffId === member.id ? 'active' : ''}`}
                                                    onClick={() => onSelectStaff(member)}
                                                >
                                                    <div className="staff-item-info">
                                                        <img 
                                                            src={member.avatar || '/images/default-avatar.png'} 
                                                            alt="avt" 
                                                            className="staff-avatar"
                                                            onError={(e) => e.target.src = '/images/default-avatar.png'} 
                                                        />
                                                        <div className="staff-text-info">
                                                            {/* Áp dụng Style Manager */}
                                                            <span className="staff-name" style={managerStyle}>
                                                                {member.name}
                                                            </span>
                                                            <span className="staff-email">
                                                                {member.email} ({member.role})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="staff-item-actions">
                                                        <button 
                                                            className="action-icon delete-icon"
                                                            title="Xóa khỏi nhóm"
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                alert("Tính năng xóa thành viên khỏi nhóm đang phát triển");
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{padding: '15px', textAlign: 'center', color: '#999', fontSize: '13px', fontStyle: 'italic'}}>
                                            Chưa có thành viên nào trong nhóm này.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default GroupList;