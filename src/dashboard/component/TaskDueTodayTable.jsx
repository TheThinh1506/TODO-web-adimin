// src/dashboard/component/TaskDueTodayTable.jsx

import React from 'react';

// Component này nhận 'tasks' (dữ liệu giả định) từ DashboardPage
const TaskDueTodayTable = ({ tasks }) => {

    // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
    // Dữ liệu 'tasks' này sẽ được lấy từ API (ví dụ: GET /api/tasks/due-today)

    const getStatusClass = (status) => {
        if (status === 'Complete') return 'status-complete';
        if (status === 'In Progress') return 'status-progress';
        if (status === 'Late') return 'status-late';
        return ''; 
    };

    return (
        <div className="table-container tasks-due-table">
             <h3 className="card-title">Tasks Due Today</h3>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Date</th>
                        <th>Staff</th>
                        <th>Task</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Lặp qua dữ liệu tasks và render các hàng */}
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td>{task.time}</td>
                            <td>{task.date}</td>
                            <td>
                                {/* Tạm thời chỉ hiển thị tên */}
                                <span className="staff-name">{task.staff}</span>
                            </td>
                            <td>{task.task}</td>
                            <td>
                                <span className={`status-pill ${getStatusClass(task.status)}`}>
                                    {task.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskDueTodayTable;