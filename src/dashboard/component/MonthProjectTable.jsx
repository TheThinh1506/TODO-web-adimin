import React from 'react';

const MonthProjectTable = ({ projects, onProjectClick }) => {
    
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
                    {Array.isArray(projects) && projects.length > 0 ? (
                        projects.map((project, index) => (
                            <tr 
                                key={project._id || index} 
                                onClick={() => onProjectClick && onProjectClick(project)} 
                                className="clickable-row"
                                style={{ cursor: 'pointer' }} 
                            >
                                <td>{project.name}</td>
                                
                                {/* Owner: Hiển thị tạm */}
                                <td>{project.ownerId ? 'Me' : '...'}</td> 
                                
                                <td>
                                    <span className={`status-pill ${getStatusClass(project.status || 'In Progress')}`}>
                                        {project.status || 'In Progress'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        /* Trường hợp projects là null, undefined, object lỗi, hoặc mảng rỗng */
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                No projects found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MonthProjectTable;