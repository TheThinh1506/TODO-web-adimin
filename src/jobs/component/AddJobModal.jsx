

import React, { useState } from 'react';
import '../style/AddJobModal.css'; 


const SubTaskRow = ({ task, index, onTaskChange, onRemoveTask, onAddEmployee, onRemoveEmployee }) => {
    return (
        <tr className="subtask-row">
            {/* STT */}
            <td>{index + 1}</td>
            
            {/* Task Name */}
            <td>
                <input 
                    type="text" 
                    placeholder="Tên sub-task..."
                    value={task.taskName}
                    onChange={(e) => onTaskChange(index, 'taskName', e.target.value)}
                    className="subtask-input task-name"
                />
            </td>

            {/* Employee */}
            <td>
                <div className="employee-list">
                    {/* Lặp qua danh sách nhân viên đã add */}
                    {task.employees.map((emp, empIndex) => (
                        <span key={empIndex} className="employee-tag">
                            {emp.name} 
                            
                            {/* NÚT X ĐỂ XÓA NHÂN VIÊN (ĐÃ THÊM) */}
                            <button 
                                type="button" 
                                className="remove-employee-btn" 
                                // Gọi hàm xóa, truyền cả index của task và index của employee
                                onClick={() => onRemoveEmployee(index, empIndex)} 
                            >
                                <img src="/images/error.png" alt="Xóa" />
                            </button>
                        </span>
                    ))}
                </div>
                {/* Nút Add Employee */}
                <button type="button" className="add-employee-btn" onClick={() => onAddEmployee(index)}>
                    + Add
                </button>
            </td>

            {/* Deadline */}
            <td>
                <input 
                    type="text" 
                    placeholder="dd/mm/yyyy"
                    value={task.deadline}
                    onChange={(e) => onTaskChange(index, 'deadline', e.target.value)}
                    className="subtask-input task-deadline"
                />
            </td>

            {/* Action (Xóa Subtask) */}
            <td>
                <button type="button" className="action-btn delete-btn" onClick={() => onRemoveTask(index)}>
                    🗑️
                </button>
            </td>
        </tr>
    );
};


// --- COMPONENT MODAL CHÍNH ---
const AddJobModal = ({ onClose, onSave }) => {
    
    // ... (các state: title, jobType, undertake, description, deadline) ...
    const [title, setTitle] = useState('');
    const [jobType, setJobType] = useState('Work');
    const [undertake, setUndertake] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    // State cho bảng bên phải (Chia việc)
    const [subtasks, setSubtasks] = useState([
        { id: 1, taskName: 'Thiết kế giao diện web', employees: [{name: 'Thái An'}, {name: 'Thịnh'}], deadline: '11/11/2025' }
    ]);

    // --- CÁC HÀM XỬ LÝ SUBTASK ---

    const handleTaskChange = (index, field, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index][field] = value;
        setSubtasks(newSubtasks);
    };

    const handleAddTaskRow = () => {
        setSubtasks([
            ...subtasks,
            { id: Date.now(), taskName: '', employees: [], deadline: '' }
        ]);
    };

    const handleRemoveTask = (index) => {
        const newSubtasks = subtasks.filter((_, i) => i !== index);
        setSubtasks(newSubtasks);
    };
const handleAddEmployee = (index) => {
        // **LOGIC NÂNG CAO:**
        alert(`Đang mở popup chọn nhân viên cho task ${index + 1}... (Chưa code)`);
    }
    // --- HÀM XỬ LÝ XÓA EMPLOYEE (ĐÃ THÊM) ---
    const handleRemoveEmployee = (taskIndex, employeeIndex) => {
        
        // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
        // (DELETE /api/tasks/{taskId}/employees/{employeeId})
        // Cần gọi API ở đây để xóa nhân viên khỏi subtask trong DB.

        setSubtasks(prevSubtasks => {
            // Tạo bản sao của mảng subtasks
            const newSubtasks = [...prevSubtasks];
            
            // Lấy danh sách employees của task đang xét
            const currentEmployees = newSubtasks[taskIndex].employees;
            
            // Tạo mảng employees mới, loại bỏ người bị xóa
            const newEmployees = currentEmployees.filter((_, i) => i !== employeeIndex);
            
            // Cập nhật lại mảng subtasks
            newSubtasks[taskIndex] = {
                ...newSubtasks[taskIndex],
                employees: newEmployees
            };
            
            return newSubtasks;
        });
    };

    // Hàm xử lý khi nhấn SAVE
    const handleSave = () => {
        const jobData = {
            title, jobType, undertake, deadline, description,
            subtasks: subtasks
        };
        onSave(jobData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Khung nội dung Modal */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-grid">
                    
                    {/* CỘT TRÁI: Thêm công việc */}
                    <div className="modal-left">
                        <h2 className="modal-title">Thêm công việc</h2>
                        
                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="jobTitle">Title</label>
                            <input 
                                id="jobTitle" 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Type of Job & Undertake (Cùng 1 hàng) */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="jobType">Type of job</label>
                                <select 
                                    id="jobType" 
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    disabled 
                                >
                                    <option value="Work">Work (Công việc nhóm)</option>
                                    <option value="Personal">Personal (Cá nhân)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="undertake">Undertake</label>
                                <select 
                                    id="undertake"
                                    value={undertake}
                                    onChange={(e) => setUndertake(e.target.value)}
                                >
                                    <option value="">Chọn nhóm...</option>
                                    <option value="frontend">Nhóm Front-end</option>
                                    <option value="backend">Nhóm Back-end</option>
                                    <option value="backend">Nhóm Figma</option>
                                    <option value="backend">Nhóm Tester</option>
                                </select>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="form-group">
                            <label htmlFor="jobDeadline">Deadline</label>
                            <input 
                                id="jobDeadline" 
                                type="date" 
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>

                        {/* Job Description */}
                        <div className="form-group">
                            <label htmlFor="jobDescription">Job Description</label>
                            <textarea 
                                id="jobDescription"
                                rows="5"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Đường kẻ phân cách */}
                    <div className="modal-divider"></div>

                    {/* CỘT PHẢI: Chia việc */}
                    <div className="modal-right">
                        <h2 className="modal-title">Chia việc</h2>
                        
                        <div className="subtask-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Task</th>
                                        <th>Employee</th>
                                        <th>Deadline</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subtasks.map((task, index) => (
                                        <SubTaskRow 
                                            key={task.id}
                                            task={task}
                                            index={index}
                                            onTaskChange={handleTaskChange}
                                            onRemoveTask={handleRemoveTask}
                                            onAddEmployee={handleAddEmployee}
                                            onRemoveEmployee={handleRemoveEmployee} // <-- Truyền hàm xuống
                                        />
                                    ))}
                                </tbody>
                            </table>
                            
                            <button type="button" className="add-row-btn" onClick={handleAddTaskRow}>
                                <span>+</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer: Nút Save/Cancel */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-save" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddJobModal;