import React, { useState } from 'react';
import '../style/AddGroupModal.css'; 

const AddGroupModal = ({ onClose, onSave }) => {
    const [groupName, setGroupName] = useState('');

    const handleSave = () => {
        if (!groupName.trim()) {
            alert("Vui lòng nhập tên nhóm!");
            return;
        }
        // Gửi tên nhóm ra ngoài để xử lý API
        onSave(groupName);
        setGroupName('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-group-modal" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <h2 className="ag-title">Add Group</h2>

                {/* Input Tên Nhóm */}
                <div className="ag-input-section">
                    <label className="ag-label">Group Name</label>
                    <input 
                        type="text" 
                        className="ag-input" 
                        placeholder="Nhập tên nhóm..." 
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Footer Buttons */}
                <div className="ag-actions">
                    <button className="btn-ag btn-ag-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-ag btn-save" onClick={handleSave}>Save</button>
                </div>

            </div>
        </div>
    );
};

export default AddGroupModal;