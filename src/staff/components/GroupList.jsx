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
    
        setMenuGroupId(prev => (prev === groupId ? null : groupId));
    };

    return (
        <div className="group-list-container">
            {groups.map(group => {
                const currentGroupId = group.group_id || group.id;

                return (
                    <div 
                        key={currentGroupId} 
                        className="group-item"
                    >
                        <div className="group-item-header" onClick={() => toggleExpand(currentGroupId)}>
                            <div className="group-actions">
                                
                                {/* Nút 3 chấm */}
                                <button className="kebab-menu-btn" onClick={(e) => toggleMenu(e, currentGroupId)}>
                                    ⋮
                                </button>
                                
                                {/* Dropdown Menu */}
                                {/* So sánh chính xác với ID vừa lấy được */}
                                {menuGroupId === currentGroupId && ( 
                                    <div className="kebab-dropdown">
                                        <button onClick={(e) => {
                                            e.stopPropagation(); 
                                            onAddMember(currentGroupId);
                                        }}>Add member</button>
                                        
                                        <button onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteGroup(currentGroupId);
                                }}>Delete group</button>
                                    </div>
                                )}
                            </div>
                            
                            <span className="group-name">{group.name || group.group_name}</span>
                            
                            {/* Mũi tên Dropdown */}
                            <span className={`group-toggle-arrow ${expandedGroupId === currentGroupId ? 'expanded' : ''}`}>
                                ▼
                            </span>
                        </div>
                    
                        {/* Danh sách thành viên */}
                        {expandedGroupId === currentGroupId && (
                            <div className="member-list">
                                {group.members && group.members.length > 0 ? (
                                    group.members.map(member => (
                                        <div 
                                            key={member.id || member.user_id} // User ID cũng có thể khác nhau
                                            onClick={() => onSelectStaff(member)}
                                            className={`staff-item ${selectedStaffId === (member.id || member.user_id) ? 'active' : ''}`}
                                        >
                                            <div className="staff-item-info">
                                                <img src={member.avatar || '/images/default-avatar.png'} alt={member.name} className="staff-avatar" />
                                                <span className="staff-name">{member.name || member.full_name}</span>
                                            </div>
                                            <div className="staff-item-actions">
                                                <button 
                                                    className="action-icon delete-icon" 
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        onDeleteStaff(member.id || member.user_id);
                                                    }}
                                                >
                                                    <img src="/images/error.png" alt="Xóa" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{padding: '10px', fontSize: '13px', color: '#888', fontStyle: 'italic'}}>
                                        Chưa có thành viên nào.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default GroupList;