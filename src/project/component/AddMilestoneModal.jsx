import React, { useState } from 'react';
// Import CSS (Nếu bạn để CSS modal chung với MilestoneStyles thì import file đó)
import '../style/MilestoneStyles.css';

const AddMilestoneModal = ({ isOpen, onClose, projectId, onSaveSuccess }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nếu modal không mở thì không hiển thị gì cả
  if (!isOpen) return null;

  const handleSave = async () => {
    // 1. Validate dữ liệu
    if (!title.trim()) {
      alert("Vui lòng nhập tên Milestone!");
      return;
    }
    if (!startDate || !endDate) {
      alert("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc!");
      return;
    }

    setIsSubmitting(true);

    try {
      
      const payload = {
        project_id: projectId,
        name: title,
        start_date: startDate,
        end_date: endDate,
        status: 'pending'
      };

      console.log('Đang gửi dữ liệu:', payload);

      // --- KẾT NỐI API BACKEND TẠI ĐÂY ---
      // Ví dụ:
      // const response = await fetch('http://localhost:4000/api/milestones', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      
      // if (!response.ok) throw new Error('Lỗi server');

      // Giả lập delay 0.5s cho giống thật
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Thông báo thành công & Đóng modal
      alert("Thêm Milestone thành công!");
      if (onSaveSuccess) onSaveSuccess(); // Gọi hàm reload dữ liệu ở trang cha
      
      // Reset form
      setTitle('');
      setStartDate('');
      setEndDate('');
      onClose();

    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add milestone</h2>
        
        {/* Nhập Tên */}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input 
            type="text" 
            className="modal-input-text" 
            placeholder="Ví dụ: Thiết kế UI" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* Nhập Ngày Bắt Đầu */}
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input 
            type="date" 
            className="modal-input-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Nhập Ngày Kết Thúc */}
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input 
            type="date" 
            className="modal-input-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Nút bấm */}
        <div className="modal-actions">
          <button 
            className="btn-modal-save" 
            onClick={handleSave}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Saving...' : 'Add'}
          </button>
          
          <button 
            className="btn-modal-cancel" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMilestoneModal;