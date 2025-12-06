import React, { useState, useRef } from 'react';
import '../style/AddJobModal.css'; 



const AddJobModal = ({ onClose, onSave }) => {
    // --- STATE QUẢN LÝ FORM ---
    const [title, setTitle] = useState('');
    

    const [jobType, setJobType] = useState(''); 
    const [otherJobType, setOtherJobType] = useState('');
    
    const [undertake, setUndertake] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    
    // State quản lý files đính kèm
    const [attachedFiles, setAttachedFiles] = useState([]);
    const fileInputRef = useRef(null);

    // --- HÀM XỬ LÝ FILE ---
    const handleAddDocumentClick = () => {
        fileInputRef.current.click(); 
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachedFiles(prev => [...prev, ...files]);
        }
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // --- HÀM SAVE ---
    const handleSave = () => {
        // 1. Validate cơ bản
        if (!title.trim()) {
            alert("Vui lòng nhập tiêu đề (Title)!");
            return;
        }
        if (!jobType) {
            alert("Vui lòng chọn loại công việc (Type of job)!");
            return;
        }
        if (jobType === 'Other' && !otherJobType.trim()) {
            alert("Vui lòng nhập tên loại công việc khác!");
            return;
        }

        // 2. Chuẩn bị dữ liệu
        const finalJobType = jobType === 'Other' ? otherJobType : jobType;

        const jobData = {
            title, 
            jobType: finalJobType, 
            undertake, 
            deadline, 
            description,
            files: attachedFiles // Gửi kèm files
        };

        if (jobType === 'Coding') {
            console.log("Log: Sẽ tạo repo Github ở bước này...");
        }

        // Gửi dữ liệu ra ngoài
        onSave(jobData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Modal Content giờ gọn gàng hơn */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Tạo project</h2>
                </div>

                {/* Body Form */}
                <div className="modal-body">
                    
                    {/* 1. Title */}
                    <div className="form-group">
                        <label htmlFor="jobTitle">Title</label>
                        <input 
                            id="jobTitle" 
                            type="text" 
                            className="full-width-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tên dự án..."
                        />
                    </div>

                    {/* 2. Type of Job */}
                    <div className="form-group">
                        <label htmlFor="jobType">Type of job</label>
                        <select 
                            id="jobType" 
                            className="full-width-input"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            style={{ color: jobType === '' ? '#888' : '#000' }}
                        >
                            <option value="" disabled hidden>Chọn loại công việc...</option>
                            <option value="Coding">Coding</option>
                            <option value="Presentation">Presentation</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Ô nhập text nếu chọn Other */}
                        {jobType === 'Other' && (
                            <input 
                                type="text" 
                                className="full-width-input other-input"
                                placeholder="Nhập loại công việc cụ thể..."
                                value={otherJobType}
                                onChange={(e) => setOtherJobType(e.target.value)}
                                style={{ marginTop: '10px' }}
                            />
                        )}
                    </div>

                    {/* 3. Undertake & Deadline (Chung 1 hàng) */}
                    <div className="form-row">
                        <div className="form-group half-width">
                            <label htmlFor="undertake">Undertake</label>
                            <select 
                                id="undertake"
                                value={undertake}
                                onChange={(e) => setUndertake(e.target.value)}
                                style={{ color: undertake === '' ? '#888' : '#000' }}
                            >
                                <option value="" disabled hidden>Chọn nhóm...</option>
                                <option value="frontend">Nhóm Front-end</option>
                                <option value="backend">Nhóm Back-end</option>
                                <option value="figma">Nhóm Figma</option>
                                <option value="tester">Nhóm Tester</option>
                            </select>
                        </div>

                        <div className="form-group half-width">
                            <label htmlFor="jobDeadline">Deadline</label>
                            <input 
                                id="jobDeadline" 
                                type="date" 
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 4. Description & Add Document */}
                    <div className="form-group description-container">
                        <label htmlFor="jobDescription">Project Description</label>
                        <div className="textarea-wrapper">
                            <textarea 
                                id="jobDescription"

                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả chi tiết về dự án..."
                            ></textarea>
                            
                            {/* Danh sách file đã chọn */}
                            {attachedFiles.length > 0 && (
                                <div className="file-preview-list">
                                    {attachedFiles.map((file, i) => (
                                        <div key={i} className="file-chip">
                                            <span>📄 {file.name}</span>
                                            <button onClick={() => handleRemoveFile(i)}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Nút Add Document */}
                            <button type="button" className="btn-add-doc" onClick={handleAddDocumentClick}>
                                + Add document
                            </button>
                            
                            {/* Input file ẩn */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".jpg,.png,.jpeg,.docx,.doc"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-save" onClick={handleSave}>Save</button>
                    <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>

                </div>
            </div>
        </div>
    );
};

export default AddJobModal;