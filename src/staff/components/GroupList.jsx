

import React, { useState } from 'react';

const GroupList = ({ groups, selectedStaffId, onSelectStaff, onDeleteStaff, onDeleteGroup, onAddMember }) => {

    // State quản lý xem nhóm nào đang được mở rộng
    const [expandedGroupId, setExpandedGroupId] = useState(null);
    // State quản lý menu 3 chấm của nhóm nào đang mở
    const [menuGroupId, setMenuGroupId] = useState(null);

    // Hàm toggle mở rộng thành viên
    const toggleExpand = (groupId) => {
        if (expandedGroupId === groupId) {
            setExpandedGroupId(null); 
        } else {
            setExpandedGroupId(groupId); 
        }
    };

   
    const toggleMenu = (e, groupId) => {
        e.stopPropagation(); 
        setMenuGroupId(menuGroupId === groupId ? null : groupId);
    };

    return (
        <div className="group-list-container">
            {groups.map(group => (
                <div key={group.id} className="group-item">
                    
                    {/* Header của Nhóm (3 chấm, Tên, Mũi tên) */}
                    <div className="group-item-header" onClick={() => toggleExpand(group.id)}>
                        <div className="group-actions">
                           
                            <button className="kebab-menu-btn" onClick={(e) => toggleMenu(e, group.id)}>
                                ⋮
                            </button>
                            
                            
                            {menuGroupId === group.id && (
                                <div className="kebab-dropdown">
                                    <button onClick={() => onAddMember(group.id)}>Add member</button>
                                    <button onClick={() => onDeleteGroup(group.id)}>Delete group</button>
                                </div>
                            )}
                        </div>
                        
                        <span className="group-name">{group.name}</span>
                        
                   
                        <span className={`group-toggle-arrow ${expandedGroupId === group.id ? 'expanded' : ''}`}>
                            ▼
                        </span>
                    </div>
                
                    {expandedGroupId === group.id && (
                        <div className="member-list">
                            {group.members.map(member => (
                                <div 
                                    key={member.id}
                                    onClick={() => onSelectStaff(member)}
                                    className={`staff-item ${selectedStaffId === member.id ? 'active' : ''}`}
                                >
                                    <div className="staff-item-info">
                                        <img src={member.avatar || '/images/default-avatar.png'} alt={member.name} className="staff-avatar" />
                                        <span className="staff-name">{member.name}</span>
                                    </div>
                                    <div className="staff-item-actions">
                                        <button 
                                            className="action-icon delete-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                onDeleteStaff(member.id);
                                            }}
                                        >
                                            <img src="/images/error.png" alt="Xóa" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GroupList;