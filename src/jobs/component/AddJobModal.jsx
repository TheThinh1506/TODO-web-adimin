import React, { useState, useRef, useEffect } from 'react';
import '../style/AddJobModal.css';

// 1. Component nhận props staffList và groupList
const AddJobModal = ({ onClose, onSave, staffList, groupList }) => {
    
    // --- States ---
    const [title, setTitle] = useState('');
    const [jobType, setJobType] = useState('Coding'); 
    const [otherJobType, setOtherJobType] = useState(''); // Thêm state cho trường "Other"
    
    const [undertakeValue, setUndertakeValue] = useState(''); 
    const [undertakeName, setUndertakeName] = useState('');
    
    const [priority, setPriority] = useState('Medium');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    const fileInputRef = useRef(null);


    // --- HÀM XỬ LÝ CHỌN NGƯỜI THỰC HIỆN ---
    const handleUndertakeChange = (e) => {
        const val = e.target.value;
        setUndertakeValue(val);

        if (!val) { setUndertakeName(''); return; }

        // Tách chuỗi "type-id"
        const [type, id] = val.split('-');

        // Tìm tên hiển thị tương ứng
        if (type === 'group') {
            // Logic tìm kiếm trong groupList (Tên nhóm)
            const g = groupList.find(item => String(item.id) === String(id));
            if (g) setUndertakeName(g.name || g.group_name);
        } else if (type === 'user') {
            // Logic tìm kiếm trong staffList (Tên nhân viên)
            const u = staffList.find(item => String(item.id) === String(id));
            if (u) setUndertakeName(u.name || u.full_name || u.email);
        }
    };

    // --- HÀM SAVE ---
    const handleSaveClick = () => {
        if (!title.trim()) { alert("Vui lòng nhập tiêu đề!"); return; }
        if (!undertakeValue) { alert("Vui lòng chọn người thực hiện!"); return; }
        
        // Validate Other Type
        const finalType = jobType === 'Other' ? otherJobType : jobType;
        if (jobType === 'Other' && !finalType.trim()) {
            alert("Vui lòng nhập tên loại công việc khác!"); return;
        }

        const [assignType, assignId] = undertakeValue.split('-');

        const jobData = {
            title,
            type: finalType,
            undertake: undertakeName, 
            assignee: { id: assignId, type: assignType },
            priority, startDate, dueDate, description, files
        };
        
        onSave(jobData);
    };
    
    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header"><h2>Tạo project</h2></div>
                <div className="modal-body">
                    
                    {/* 1. TITLE */}
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" className="full-width-input title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tên dự án..." />
                    </div>

                    {/* 2. TYPE OF JOB */}
                    <div className="form-group">
                        <label>Type of job</label>
                        <select className="full-width-input" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                            <option value="Coding">Coding</option>
                            <option value="Presentation">Presentation</option>
                            <option value="Other">Other</option>
                        </select>
                        {/* Input Other */}
                        {jobType === 'Other' && (
                            <input type="text" className="full-width-input input-other-type" placeholder="Nhập loại công việc..." value={otherJobType} onChange={(e) => setOtherJobType(e.target.value)} />
                        )}
                    </div>

                    {/* 3. UNDERTAKE & PRIORITY (QUAN TRỌNG NHẤT) */}
                    <div className="form-row two-cols">
                        <div className="form-group">
                            <label>Undertake</label>
                            <select 
                                className="full-width-input"
                                value={undertakeValue}
                                onChange={handleUndertakeChange}
                            >
                                <option value="">-- Chọn Người/Nhóm --</option>

                                {/* 1. Render Nhóm (Dữ liệu thật) */}
                                {groupList && groupList.length > 0 && (
                                    <optgroup label="Nhóm (Groups)">
                                        {groupList.map(g => (
                                            <option key={`group-${g.id}`} value={`group-${g.id}`}>
                                                👥 {g.name || g.group_name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {/* 2. Render Nhân viên (Dữ liệu thật) */}
                                {staffList && staffList.length > 0 && (
                                    <optgroup label="Nhân viên (Staff)">
                                        {staffList.map(u => (
                                            <option key={`user-${u.id}`} value={`user-${u.id}`}>
                                                👤 {u.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {/* 3. Fallback khi không có dữ liệu */}
                                {(!groupList?.length && !staffList?.length) && (
                                    <option disabled>Đang tải hoặc chưa có dữ liệu...</option>
                                )}
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="form-group">
                            <label>Priority</label>
                            <select className="full-width-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="form-row two-cols">
                        <div className="form-group"><label>Start-date</label><input type="date" className="full-width-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                        <div className="form-group"><label>Due-date</label><input type="date" className="full-width-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
                    </div>

                    {/* Description */}
                    <div className="form-group description-group">
                        <textarea placeholder="Project Description..." className="description-input" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        
                        {/* Files preview and input logic */}
                        {files.length > 0 && (
                            <div className="selected-files">
                                {/* Map file chips */}
                            </div>
                        )}
                        <input type="file" multiple ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange} />
                        <button className="btn-add-document" onClick={() => fileInputRef.current.click()}>+ Add document</button>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-save" onClick={handleSaveClick}>Save</button>
                    <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddJobModal;