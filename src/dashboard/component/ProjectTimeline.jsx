// src/dashboard/component/ProjectTimeline.jsx

import React from 'react';
import '../style/Timeline.css'; 

const ProjectTimeline = ({ project }) => {

    // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
    // Dữ liệu 'milestones' (các mốc/công việc con) phải được lấy từ API.
    
    // Dữ liệu giả định (Mock Data)
    const milestones = [
        { name: 'Thiết kế UI', date: '2/10', status: 'Done', position: 10 },
        { name: 'Lập trình Back-End', date: '29/10', status: 'Done', position: 40 },
        { name: 'Lập trình Front-End', date: 'dd/mm', status: 'In Progress', position: 70 },
        { name: 'Test lần 1', date: 'dd/mm', status: 'Todo', position: 90 },
        { name: 'Deploy', date: 'dd/mm', status: 'Todo', position: 100 },
    ];

    // --- LOGIC TÍNH TOÁN TIẾN ĐỘ ---
    const totalTasks = milestones.length;
    const completedTasks = milestones.filter(task => task.status === 'Done').length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    // --- KẾT THÚC LOGIC ---

    return (
        <div className="timeline-wrapper">
            {/* Tên Project (Đã bị xóa ở bước trước, có thể thêm lại nếu muốn) */}
            {/* <h4 className="timeline-project-name">{project.name}</h4> */}
            
            {/* Đường kẻ ngang chính */}
            <div className="timeline-track">
                
                {/* Đường kẻ tiến độ (fill color) */}
                <div 
                    className="timeline-progress" 
                    style={{ width: `${progressPercentage}%` }}
                ></div> 
                
                {/* Render các mốc (Milestones) */}
                {milestones.map((milestone, index) => (
                    <div className="milestone" style={{ left: `${milestone.position}%` }} key={index}>
                        
                        {/* Chấm tròn (dot) */}
                        <div className={`milestone-dot ${milestone.status === 'Done' ? 'done' : ''}`}></div>
                        
                        {/* Thông tin mốc (text) */}
                        <div className={`milestone-info ${index % 2 === 1 ? 'position-below' : ''}`}>
                            <span className="milestone-name">{milestone.name}</span>
                            <span className="milestone-date">{milestone.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectTimeline;