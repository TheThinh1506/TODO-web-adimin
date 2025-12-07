import React, { useState } from 'react';
import axios from 'axios';
import '../style/MilestoneStyles.css';

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 

const AddMilestoneModal = ({ isOpen, onClose, projectId, onSaveSuccess }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    // 1. Validate: Admin bắt buộc phải nhập tên và thời gian quy định
    if (!name.trim()) { alert("Vui lòng nhập tên Milestone!"); return; }
    if (!startDate || !endDate) { alert("Vui lòng chọn khung thời gian!"); return; }
    if (new Date(startDate) > new Date(endDate)) { alert("Ngày bắt đầu không thể sau ngày kết thúc!"); return; }

    setIsSubmitting(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      // Payload: Chỉ chứa thông tin quản lý (chưa có task)
      const payload = {
        project_id: projectId,
        name: name,
        description: description || "",
        start_date: startDate,
        end_date: endDate,
        status: 'In Progress',
        progress: 0        
      };

      console.log(" Admin đang tạo Milestone Scope:", payload);


      const response = await axios.post(`${API_BASE_ROOT}/api/milestones/`, payload, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.status === 200 || response.status === 201) {
        alert("Đã tạo Milestone mới thành công!");
        if (onSaveSuccess) onSaveSuccess();
        
        
        setName(''); setDescription(''); setStartDate(''); setEndDate('');
        onClose();
      }

    } catch (error) {
      console.error("Lỗi tạo Milestone:", error);
      const msg = error.response?.data?.message || "Lỗi Server.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Create Milestone Scope</h2>
        
        <div className="form-group">
          <label className="form-label">Milestone Name</label>
          <input 
            type="text" className="modal-input-text" 
            placeholder="Ví dụ: Sprint 1 - Thiết kế Database" 
            value={name} onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group" style={{display:'flex', gap:'15px'}}>
            <div style={{flex:1}}>
                <label className="form-label">Start Date (Plan)</label>
                <input type="date" className="modal-input-date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
            </div>
            <div style={{flex:1}}>
                <label className="form-label">End Date (Plan)</label>
                <input type="date" className="modal-input-date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
            </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            className="modal-input-text" style={{height:'80px', resize:'none'}}
            placeholder="Mô tả phạm vi công việc..."
            value={description} onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-modal-save" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Scope'}
          </button>
          <button className="btn-modal-cancel" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMilestoneModal;