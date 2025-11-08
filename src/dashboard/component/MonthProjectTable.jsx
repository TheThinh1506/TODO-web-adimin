// src/dashboard/component/MonthProjectTable.jsx

import React from 'react';

// Component này nhận 'projects' (dữ liệu giả định) từ DashboardPage
const MonthProjectTable = ({ projects, onProjectClick }) => {
    
    // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
    // Dữ liệu 'projects' này sẽ được lấy từ API (ví dụ: GET /api/tasks/monthly-projects)
    // Hiện tại, chúng ta đang dùng dữ liệu giả định được truyền từ 'DashboardPage'.

    const getStatusClass = (status) => {
        if (status === 'Complete') return 'status-complete';
        if (status === 'In Progress') return 'status-progress';
        return ''; 
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, index) => (
                        <tr 
                            key={project.id || index} 
                            onClick={() => onProjectClick(project)} 
                            className="clickable-row"
                        >
                            <td>{project.name}</td>
                            <td>{project.assignedTo}</td>
                            <td>
                                <span className={`status-pill ${getStatusClass(project.status)}`}>
                                    {project.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MonthProjectTable;