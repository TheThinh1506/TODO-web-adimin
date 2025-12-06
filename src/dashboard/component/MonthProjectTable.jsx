import React from 'react';
// Nếu bạn có file CSS riêng cho table thì import vào đây, ví dụ:
// import '../style/DashBoard.css';

const MonthProjectTable = ({ projects, onProjectClick }) => {
    
    // Hàm phụ trợ để map status từ API sang class CSS
    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toLowerCase();
        if (s === 'completed' || s === 'done') return 'status-complete';
        if (s === 'in progress' || s === 'active') return 'status-progress';
        return 'status-late'; 
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {/* SỬA LỖI: Kiểm tra !projects trước để tránh crash nếu API chưa trả về dữ liệu */}
                    {!projects || projects.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                No projects found
                            </td>
                        </tr>
                    ) : (
                        projects.map((project, index) => (
                            <tr 
                                key={project._id || index} 
                                onClick={() => onProjectClick && onProjectClick(project)} 
                                className="clickable-row"
                                style={{ cursor: 'pointer' }} // Thêm style này để người dùng biết click được
                            >
                                <td>{project.name}</td>
                                
                                {/* Owner: Hiển thị tạm 'Me' nếu có ID */}
                                <td>{project.ownerId ? 'Me' : '...'}</td> 
                                
                                <td>
                                    <span className={`status-pill ${getStatusClass(project.status || 'In Progress')}`}>
                                        {project.status || 'In Progress'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MonthProjectTable;