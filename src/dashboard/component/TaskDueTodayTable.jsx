import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_ROOT = 'http://34.124.178.44:4000';

const TaskDueTodayTable = () => {
    
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toLowerCase();
        if (s === 'complete' || s === 'done') return 'status-complete';
        if (s === 'in progress' || s === 'active') return 'status-progress';
        return 'status-late'; 
    };

    useEffect(() => {
        const fetchAndFilterTasks = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return;

            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_ROOT}/api/projects/owner`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                const allProjects = response.data.projects || response.data.data || [];

                // 1. LẤY NGÀY HÔM NAY CHUẨN (YYYY-MM-DD)
                // Dùng 'en-CA' để luôn lấy format Năm-Tháng-Ngày bất kể setting laptop
                const todayString = new Date().toLocaleDateString('en-CA'); 
                
                console.log("📅 Hôm nay (Target):", todayString);

                const todaysTasks = allProjects
                    .filter(project => {
                        // API trả về due_date hoặc end_date
                        const rawDate = project.due_date || project.end_date;
                        if (!rawDate) return false;

                        // 2. CHUẨN HÓA NGÀY API (YYYY-MM-DD)
                        // Cắt chuỗi ISO 10 ký tự đầu: "2025-12-08T..." -> "2025-12-08"
                        // Cách này an toàn nhất vì không bị ảnh hưởng bởi múi giờ trình duyệt
                        let projectDateString = String(rawDate).substring(0, 10);

                        return projectDateString === todayString;
                    })
                    .map(project => ({
                        id: project.id || project._id || project.project_id,
                        time: "09:00 AM",
                        date: new Date(project.due_date || project.end_date).toLocaleDateString('vi-VN'),
                        staff: project.undertake || "Me", // Đã cập nhật để nhận undertake từ API
                        task: project.name,
                        status: project.status || 'In Progress'
                    }));

                setTasks(todaysTasks);

            } catch (error) {
                console.error("Lỗi tải Tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndFilterTasks();
    }, []);


    return (
        <div className="table-container tasks-due-table">
            <h3 className="card-title">Tasks Due Today</h3>
            {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Loading...</div>
            ) : (
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
                        {tasks.length > 0 ? (
                            tasks.map((task, index) => (
                                <tr key={task.id || index}>
                                    <td>{task.time}</td>
                                    <td>{task.date}</td>
                                    <td><span className="staff-name">{task.staff}</span></td>
                                    <td>{task.task}</td>
                                    <td><span className={`status-pill ${getStatusClass(task.status)}`}>{task.status}</span></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888', fontStyle: 'italic' }}>
                                    Không có task nào hết hạn vào hôm nay ({new Date().toLocaleDateString('vi-VN')}).
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TaskDueTodayTable;