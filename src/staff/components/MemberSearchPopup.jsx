

import React, { useState } from 'react';

const MemberSearchPopup = ({ mockStaffList, onAddMember, onClosePopup }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Lọc danh sách nhân viên dựa trên searchTerm
    const filteredStaff = mockStaffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
        
    );

    return (
        <div className="member-search-popup">
            <input
                type="text"
                placeholder="Searching..."
                className="member-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="member-search-list">
                {filteredStaff.length > 0 ? (
                    filteredStaff.map(staff => (
                        <li key={staff.id} onClick={() => onAddMember(staff)}>
                            <span>{staff.name}</span>
                        </li>
                    ))
                ) : (
                    <li className="no-results">Không tìm thấy nhân viên.</li>
                )}
            </ul>
        </div>
    );
};

export default MemberSearchPopup;