import React, { useState, useEffect } from 'react';
import '../style/AddJobModal.css';

// 1. QUAN TRỌNG: Nhận đúng props staffList và groupList
const AddJobModal = ({ onClose, onSave, staffList, groupList }) => {
 
    useEffect(() => {
        console.log("🛠️ Modal AddJob nhận được dữ liệu:");
        console.log("   - Staff:", staffList);
        console.log("   - Groups:", groupList);
    }, [staffList, groupList]);

    const [title, setTitle] = useState('');
    const [jobType, setJobType] = useState('Coding'); 

    const [undertakeValue, setUndertakeValue] = useState(''); 

    const [undertakeName, setUndertakeName] = useState(''); 

    const [priority, setPriority] = useState('Medium');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    // --- XỬ LÝ CHỌN NGƯỜI THỰC HIỆN ---
    const handleUndertakeChange = (e) => {
        const val = e.target.value;
        setUndertakeValue(val);

        if (!val) {
            setUndertakeName('');
            return;
        }

        const [type, id] = val.split('-');

 
        if (type === 'group') {
            const g = groupList.find(item => String(item.id) === String(id));
            if (g) setUndertakeName(g.name);
        } else if (type === 'user') {
            const u = staffList.find(item => String(item.id) === String(id));
            if (u) setUndertakeName(u.name);
        }
    };

    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleSaveClick = () => {
        if (!title.trim()) { alert("Vui lòng nhập tiêu đề!"); return; }
        if (!undertakeValue) { alert("Vui lòng chọn người thực hiện!"); return; }

        // Tách ID và Type để gửi ra ngoài
        const [assignType, assignId] = undertakeValue.split('-');

        const jobData = {
            title,
            type: jobType,
            undertake: undertakeName, 
            assignee: {         
                id: assignId,
                type: assignType 
            },
            priority,
            startDate,
            dueDate,
            description,
            files
        };
        
        onSave(jobData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header"><h2>Tạo project</h2></div>
                <div className="modal-body">
                    {/* Title */}
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" className="full-width-input title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tên dự án..." />
                    </div>

                    {/* Job Type */}
                    <div className="form-group">
                        <label>Type of job</label>
                        <select className="full-width-input" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                            <option value="Coding">Coding</option>
                            <option value="Design">Design</option>
                            <option value="Testing">Testing</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* --- CỘT UNDERTAKE (QUAN TRỌNG NHẤT) --- */}
                    <div className="form-row two-cols">
                        <div className="form-group">
                            <label>Undertake</label>
                            <select 
                                className="full-width-input"
                                value={undertakeValue}
                                onChange={handleUndertakeChange}
                            >
                                <option value="">-- Chọn Người/Nhóm --</option>

                                {/* 1. Render Nhóm */}
                                {groupList && groupList.length > 0 && (
                                    <optgroup label="Nhóm (Groups)">
                                        {groupList.map(g => (
                                            <option key={`group-${g.id}`} value={`group-${g.id}`}>
                                                👥 {g.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {/* 2. Render Nhân viên */}
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
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" className="full-width-input" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" className="full-width-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <textarea placeholder="Project Description..." className="description-input" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        <input type="file" multiple style={{marginTop:'10px'}} onChange={handleFileChange} />
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