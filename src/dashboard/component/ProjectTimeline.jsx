// src/dashboard/component/ProjectTimeline.jsx

import React, { useState, useEffect } from 'react';
import '../style/Timeline.css'; 
import TaskDetailsPopup from './TaskDetailsPopup';

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 
const API_BASE_URL = `${API_BASE_ROOT}/api`;
const INITIAL_MILESTONES = [
    { 
        id: 1, name: 'Thiết kế UI', date: '2/10', status: 'Done', position: 10,
        details: {
            assignee: 'An',
            status: 'Completed',
            subtasks: [
                { id: 1, text: 'Nghiên cứu tone màu...', done: true },
                { id: 2, text: 'Thiết kế format: font chữ...', done: true },
                { id: 3, text: 'Thiết kế logo app', done: true },
                { id: 4, text: 'Thiết kế bản nháp cho sitemap', done: true },
            ],
            progress: '100%',
            dueDate: '11h30 - 28/10/2025',
            completionDate: '18/10/2025'
        }
    },
    { 
        id: 2, name: 'Lập trình Front-End', date: '29/10', status: 'Done', position: 40,
        details: { assignee: 'Thịnh',
            status: 'Completed',
            subtasks: [
                { id: 5, text: 'Nghiên cứu tone màu...', done: true },
                { id: 6, text: 'Lập trình giao diện App', done: true },
                { id: 7, text: 'Nghiên cứu các API', done: true },
                { id: 8, text: 'Gọi API từ Back-end', done: true },
            ],
            progress: '100%',
            dueDate: '11h30 - 28/10/2025',
            completionDate: '18/10/2025'
        }
    },
    { 
        id: 3, name: 'Lập trình Back-End', date: 'dd/mm', status: 'Todo', position: 70,
        details: { assignee: 'Tài',
            status: 'In Progress', 
            subtasks: [
                { id: 9, text: 'Nghiên cứu Database', done: false }, 
                { id: 10, text: 'Thiết kế Database.', done: false },
                { id: 11, text: 'Thiết kế API', done: false },
                { id: 12, text: 'Thiết kế bản nháp', done: false },
            ],
            progress: '0%',
            dueDate: '11h30 - 28/10/2025',
            completionDate: '' 
        }
    },
    { 
        id: 4, name: 'Test lần 1', date: 'dd/mm', status: 'Todo', position: 90,
        details: { assignee: 'Tấn An',
            status: 'in progress', 
            subtasks: [
                { id: 13, text: 'Kiểm tra giao diện được code', done: false },
                { id: 14, text: 'Kiểm tra các chức năng', done: false },
                { id: 15, text: 'Kiểm tra dòng dữ liệu', done: false },
                { id: 16, text: 'Kiểm tra Server', done: false },
            ],
            progress: '0%',
            dueDate: '11h30 - 28/10/2025',
            completionDate: ''
        }
    },
];

const ProjectTimeline = ({ project }) => {
    
    const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
    const [hoveredTaskDetails, setHoveredTaskDetails] = useState(null);
    const [progressPercentage, setProgressPercentage] = useState(0);

    // Logic tính toán lại thanh tiến độ chính (màu xanh lá)
    // Chạy mỗi khi state 'milestones' thay đổi
    useEffect(() => {
        // Lọc ra các mốc đã 'Done' (tức là tất cả subtask đã xong)
        const doneMilestones = milestones.filter(m => m.status === 'Done');
        let lastDonePosition = 0;
        
        if (doneMilestones.length > 0) {
            // Tìm vị trí (position) lớn nhất trong số các mốc đã 'Done'
            lastDonePosition = Math.max(...doneMilestones.map(m => m.position));
        }
        
        setProgressPercentage(lastDonePosition);

    }, [milestones]); 

    // MỤC ĐÍCH: Cập nhật trạng thái "Done" / "Working" cho subtask.
    const handleSubtaskToggle = (milestoneId, subtaskId, newDoneStatus) => {
        
        
        const newStatus = newDoneStatus ? "Done" : "Working";
         axios.patch(`${API_BASE_URL}/tasks/${subtaskId}/status`, 
             { newStatus: newStatus },
             { headers: { 'Authorization': `Bearer ${accessToken}` } }
         );
        setMilestones(prevMilestones => {
            const newMilestones = prevMilestones.map(m => {
                // Tìm đúng mốc (milestone)
                if (m.id === milestoneId) {
                    
                    // Cập nhật subtask bên trong
                    const newSubtasks = m.details.subtasks.map(st => {
                        if (st.id === subtaskId) {
                            return { ...st, done: !st.done }; 
                        }
                        return st;
                    });

                    // KIỂM TRA LOGIC HOÀN THÀNH MỐC
                    const allDone = newSubtasks.every(st => st.done);
                    
                    return {
                        ...m,
                        details: { ...m.details, subtasks: newSubtasks },
                        status: allDone ? 'Done' : 'Todo', 
                    };
                }
                return m;
            });
            return newMilestones;
        });
    };

    return (
        <div className="timeline-wrapper">

            {/* Đường kẻ ngang chính */}
            <div className="timeline-track">

                <div 
                    className="timeline-progress" 
                    style={{ width: `${progressPercentage}%` }}
                ></div> 
                
                <div className="milestones-container">
                    {milestones.map((milestone, index) => (
                        <div 
                            className="milestone" 
                            style={{ left: `${milestone.position}%` }} 
                            key={milestone.id}
                            onMouseEnter={() => setHoveredTaskDetails(milestone.details)}
                            onMouseLeave={() => setHoveredTaskDetails(null)}
                        >
                            {/* Chấm tròn (dot) */}
                            <div className={`milestone-dot ${milestone.status === 'Done' ? 'done' : ''}`}>
                            </div>
                            
                            {/* Render Popup (Hiển thị có điều kiện) */}
                            {hoveredTaskDetails === milestone.details && (
                                <TaskDetailsPopup 
                                    taskDetails={hoveredTaskDetails} 
                                    alignRight={milestone.position > 70} 
                                    // Truyền hàm xử lý xuống
                                    onSubtaskToggle={(subtaskId) => handleSubtaskToggle(milestone.id, subtaskId)}
                                />
                            )}

                            {/* Thông tin mốc (Text) */}
                            <div className={`milestone-info ${index % 2 === 1 ? 'position-below' : ''}`}>
                                <span className="milestone-name">{milestone.name}</span>
                                <span className="milestone-date">{milestone.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div> 
        </div> 
    );
};

export default ProjectTimeline;