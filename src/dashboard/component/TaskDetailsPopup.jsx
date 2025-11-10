

import React from 'react';
import '../style/TaskDetailsPopup.css'; 

const TaskDetailsPopup = ({ taskDetails, alignRight, onSubtaskToggle }) => {
    if (!taskDetails) return null;

    // --- TÍNH TOÁN LẠI PROGRESS VÀ STATUS (DỰA TRÊN DỮ LIỆU NHẬN VÀO) ---
    const subtasks = taskDetails.subtasks || [];
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(t => t.done).length;
    
    const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    const progressText = `${Math.round(progressPercent)}%`;
    
       const dynamicStatus = progressPercent === 100 ? 'Completed' : (progressPercent > 0 ? 'In Progress' : 'Todo');



    const popupClasses = `task-details-popup ${alignRight ? 'align-right' : ''}`;

    const getStatusClass = (status) => {
        if (status === 'Completed') return 'status-completed';
        // Mặc định là 'In Progress'
        return 'status-pending'; 
    };

    return (
        <div className={popupClasses}>
            {/* Hàng 1: Tên người phụ trách và Trạng thái */}
            <div className="popup-header">
                <span className="assignee-name">{taskDetails.assignee}</span>
                <span className={`status-badge ${getStatusClass(dynamicStatus)}`}>
                    <span className="status-dot"></span>
                    {dynamicStatus}
                </span>
            </div>
            
            {/* Hàng 2: Danh sách công việc con (Checklist) */}
            <ul className="subtask-list">
                {subtasks.map(subtask => (
                    <li key={subtask.id} className={subtask.done ? 'done' : ''}>
                        <input 
                            type="checkbox" 
                            checked={subtask.done} 
                            // Gọi hàm handler từ component cha khi click
                            onChange={() => onSubtaskToggle(subtask.id)}
                        />
                        <span>{subtask.text}</span>
                    </li>
                ))}
            </ul>
            
            <hr className="divider" />
            
            {/* Hàng 3: Thông tin chi tiết (Progress, Dates) */}
            <div className="popup-footer">
                <p><strong>Progress:</strong> {progressText}</p>
                <p><strong>Due date:</strong> {taskDetails.dueDate}</p>
                <p><strong>Completion date:</strong> {taskDetails.completionDate}</p>
            </div>
        </div>
    );
};

export default TaskDetailsPopup;