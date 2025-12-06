import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


import Sidebar from '../../dashboard/component/SideBar'; 

import '../../dashboard/style/DashBoard.css'; 

import '../style/JobsPage.css';

import AddJobModal from '../component/AddJobModal'; 

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 

const JobsPage = () => {
    
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [jobs, setJobs] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filter, setFilter] = useState('All'); 
    const [isLoading, setIsLoading] = useState(false); 


    const [isModalOpen, setIsModalOpen] = useState(false);

    
    const fetchJobs = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
            console.warn("Chưa đăng nhập (Thiếu Access Token)");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_ROOT}/api/projects/owner`, {
                headers: { 
                    'Authorization': `Bearer ${accessToken}` 
                }
            });

            const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
            
            const mappedJobs = data.map((item, index) => ({
                id: item._id || item.id || index,
                no: index + 1,
                task: item.name || item.title || 'No Title', 
                department: item.department || 'General',
                undertake: item.undertake || 'Unassigned',
                deadline: item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : '--/--',
                status: item.status || 'In Progress',
                feedback: 'Add'
            }));

            setJobs(mappedJobs);

        } catch (error) {
            console.error("Lỗi khi lấy danh sách công việc:", error);
            if (error.response && error.response.status === 401) {
                alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

   
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]); 

    
    const handleSaveJob = async (jobData) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId') || localStorage.getItem('_id'); 
        
        const workspaceId = localStorage.getItem('currentWorkspaceId');

        if (!accessToken) {
            alert("Bạn chưa đăng nhập!");
            return;
        }
    
        if (!workspaceId) {
            alert("Không tìm thấy thông tin Workspace! Vui lòng quay lại Dashboard để tải dữ liệu.");
            return;
        }

        const formData = new FormData();
        
      
        formData.append('name', jobData.title);
        formData.append('type', jobData.jobType); 
        formData.append('undertake', jobData.undertake);
        formData.append('deadline', jobData.deadline);
        formData.append('description', jobData.description);
        formData.append('owner_id', userId);
        formData.append('workspace_id', workspaceId); 
       

        if (jobData.files && jobData.files.length > 0) {
            jobData.files.forEach((file) => {
                formData.append('files', file); 
            });
        }

        console.log("Đang gửi FormData lên server...");

        const response = await axios.post(`${API_BASE_ROOT}/api/projects/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 200 || response.status === 201) {
            alert("Tạo công việc thành công!");
            handleCloseModal();
            fetchJobs(); 
        }

    } catch (error) {
        console.error("Lỗi khi lưu công việc:", error);
        if (error.response && error.response.data) {
            alert(`Lỗi Server: ${error.response.data.message}`);
        } else {
            alert("Lỗi Server! Không thể lưu công việc.");
        }
    }
};

    const filteredJobs = jobs.filter(job => {
        const matchesFilter = (filter === 'All' || job.department === filter);
        const matchesSearch = job.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              job.undertake.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });


    const getStatusClass = (status) => {
        if (status === 'Complete') return 'status-complete';
        if (status === 'In Progress') return 'status-progress';
        if (status === 'Late') return 'status-late';
        return '';
    };


    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);



    return (
        <div className="dashboard-container"> 
            <Sidebar /> 

            <div className="main-content">
                <header className="page-header">
                    <h1>Jobs</h1>
                </header>
                
                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Searching..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-bar">
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">Filter (All Departments)</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Economy">Economy</option>
                            <option value="Planner">Planner</option>
                        </select>
                    </div>


                    <button className="add-job-button" onClick={handleOpenModal}>
                        <span>+</span> New Project
                    </button>
                </div>

                {/* Table */}
                <div className="grid-item job-table-container">
                    {isLoading ? (
                        <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Task</th>
                                    <th>Department</th>
                                    <th>Undertake</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (
                                        <tr key={job.id}>
                                            <td>{job.no}</td>
                                            <td>{job.task}</td>
                                            <td>{job.department}</td>
                                            <td>{job.undertake}</td>
                                            <td>{job.deadline}</td>
                                            <td>
                                                <span className={`status-pill ${getStatusClass(job.status)}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td>
                                                <a href="#" className="feedback-link">{job.feedback}</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                                            Không tìm thấy công việc nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <AddJobModal 
                    onClose={handleCloseModal} 
                    onSave={handleSaveJob} 
                />
            )}
        </div>
    );
};

export default JobsPage;
