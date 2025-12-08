import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_ROOT = 'http://34.124.178.44:4000';

const MonthProjectTable = ({ onProjectClick }) => {
    
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndFilterProjects = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return;

            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_ROOT}/api/projects/owner`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                const allProjects = response.data.projects || response.data.data || [];
                
                const today = new Date();
                const currentMonth = today.getMonth(); 
                const currentYear = today.getFullYear();

                const filteredProjects = allProjects.filter(project => {
                    const timePoint = project.start_date || project.created_at;
                    if (!timePoint) return false;

                    const startDate = new Date(timePoint);
                    const isInCurrentMonth = startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
                    
                    let isEndInMonth = false;
                    const endDateRaw = project.end_date || project.due_date;
                    if (endDateRaw) {
                        const endDate = new Date(endDateRaw);
                        isEndInMonth = endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
                    }

                    return isInCurrentMonth || isEndInMonth;
                });

                setProjects(filteredProjects);

            } catch (error) {
                console.error("Lỗi tải Month's Projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndFilterProjects();
    }, []);

    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toLowerCase();
        if (s === 'completed' || s === 'done') return 'status-complete';
        if (s === 'in progress' || s === 'active') return 'status-progress';
        return 'status-late'; 
    };

    return (
        /* 🔥 FIX CỨNG: Dùng style trực tiếp để ép chiều cao và thanh cuộn */
        <div 
            className="table-container" 
            style={{ 
                maxHeight: '300px',      /* Giới hạn chiều cao bảng khoảng 5-6 dòng */
                overflowY: 'auto',       /* Bắt buộc hiện thanh cuộn dọc */
                overflowX: 'hidden',     /* Ẩn thanh cuộn ngang */
                border: '1px solid #eee', /* Viền nhẹ cho đẹp */
                borderRadius: '8px'
            }}
        >
            {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Loading projects...</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    {/* Header cố định (Sticky) */}
                    <thead style={{ position: 'sticky', top: '0', backgroundColor: '#fff', zIndex: '10', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Owner</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(projects) && projects.length > 0 ? (
                            projects.map((project, index) => (
                                <tr 
                                    key={project.id || project._id || project.project_id || index} 
                                    onClick={() => onProjectClick && onProjectClick(project)} 
                                    className="clickable-row"
                                    style={{ cursor: 'pointer', borderBottom: '1px solid #f9f9f9' }} 
                                >
                                    <td style={{ padding: '10px' }}>
                                        <div style={{fontWeight: '500', color: '#333'}}>
                                            {project.name}
                                        </div>
                                        <div style={{fontSize: '11px', color: '#888'}}>
                                            Created: {new Date(project.created_at || project.start_date).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px' }}>{project.undertake || 'Me'}</td> 
                                    <td style={{ padding: '10px' }}>
                                        <span className={`status-pill ${getStatusClass(project.status || 'In Progress')}`}>
                                            {project.status || 'In Progress'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    Không tìm thấy dự án trong tháng này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MonthProjectTable;