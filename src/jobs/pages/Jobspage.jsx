

import React, { useState, useEffect } from 'react';
import axios from 'axios';


import Sidebar from '../../dashboard/component/SideBar'; 

import '../../dashboard/style/DashBoard.css'; 

import '../style/JobsPage.css'; 

import AddJobModal from '../component/AddJobModal'; 

// **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
const API_BASE_ROOT = 'http://163.61.110.132:4000'; 

const JobsPage = () => {
    
    // 2. STATE QUẢN LÝ DỮ LIỆU
    const [jobs, setJobs] = useState([]); // State lưu danh sách công việc
    const [searchTerm, setSearchTerm] = useState(''); // State cho thanh tìm kiếm
    const [filter, setFilter] = useState('All'); // State cho bộ lọc
    const [isLoading, setIsLoading] = useState(false); // State tải dữ liệu

    // 3. STATE QUẢN LÝ MODAL (MỚI)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dữ liệu giả định (Mock Data) - Sẽ được thay thế bằng API
    const mockJobs = [
        { id: 1, no: '1', task: 'To-Do App', department: 'Administrator', undertake: 'Thái An', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

        { id: 2, no: '2', task: 'To-Do App', department: 'Finance', undertake: 'Thịnh', deadline: '28/10/2025', status: 'Late', feedback: 'Add' },

        { id: 3, no: '3', task: 'Báo cáo quý 4', department: 'Finance', undertake: 'Tài', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

        { id: 4, no: '4', task: 'To-Do App', department: 'Marketing', undertake: 'Tấn An', deadline: '28/10/2025', status: 'In Progress', feedback: 'Add' },

        { id: 5, no: '5', task: 'To-Do App', department: 'Human Resources', undertake: 'Tài', deadline: '28/10/2025', status: 'In Progress', feedback: 'Add' },

        { id: 6, no: '6', task: 'Báo cáo quý 5', department: 'Administrator', undertake: 'Thịnh', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

        { id: 7, no: '7', task: 'To-Do App', department: 'Economy', undertake: 'Thịnh', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

        { id: 8, no: '8', task: 'To-Do App', department: 'Finance', undertake: 'Thái An', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

        { id: 9, no: '9', task: 'To-Do App', department: 'Finance', undertake: 'Thịnh', deadline: '28/10/2025', status: 'Late', feedback: 'Add' },

        { id: 10, no: '10', task: 'Báo cáo quý 4', department: 'Finance', undertake: 'Tài', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

        { id: 11, no: '11', task: 'To-Do App', department: 'Marketing', undertake: 'Tấn An', deadline: '28/10/2025', status: 'In Progress', feedback: 'Add' },

        { id: 12, no: '12', task: 'To-Do App', department: 'Human Resources', undertake: 'Tài', deadline: '28/10/2025', status: 'In Progress', feedback: 'Add' },

        { id: 13, no: '13', task: 'Báo cáo quý 5', department: 'Administrator', undertake: 'Thịnh', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

        { id: 14, no: '14', task: 'To-Do App', department: 'Economy', undertake: 'Thịnh', deadline: '28/10/2025', status: 'Complete', feedback: 'Add' },

    ];

    // 4. HÀM GỌI API (useEffect)
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            
            // **ĐIỂM KẾT NỐI API BACKEND:** (GET /api/tasks/all)
            try {
                // (Code gọi API thật sẽ được kích hoạt sau)
                
                // Dùng dữ liệu giả định (Mock Data)
                setJobs(mockJobs);

            } catch (error) {
                console.error("Lỗi khi lấy danh sách công việc:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []); 

    // 5. LOGIC LỌC (Filter) VÀ TÌM KIẾM (Search)
    const filteredJobs = jobs.filter(job => {
        const matchesFilter = (filter === 'All' || job.department === filter);
        const matchesSearch = job.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              job.undertake.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // 6. HÀM HELPER (Hỗ trợ)
    const getStatusClass = (status) => {
        if (status === 'Complete') return 'status-complete';
        if (status === 'In Progress') return 'status-progress';
        if (status === 'Late') return 'status-late';
        return '';
    };

    // 7. HÀM XỬ LÝ MODAL
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveJob = (jobData) => {
        // **ĐIỂM KẾT NỐI API BACKEND (POST /api/tasks/create):**
        // Đây là nơi bạn sẽ gọi API để gửi 'jobData' lên server.
        
        // **API CẦN BỔ SUNG:** Cần API (POST /groups/create) hoặc 
        // (POST /tasks/create) để xử lý dữ liệu 'jobData'.
        
        console.log("Dữ liệu công việc mới đã lưu:", jobData);
        
        // Sau khi lưu thành công, đóng Modal và làm mới danh sách (tạm thời)
        // (Bạn nên gọi lại API fetchJobs() để cập nhật)
        handleCloseModal();
    };

    return (
        <div className="dashboard-container"> 
            <Sidebar /> 

            <div className="main-content">
                <header className="page-header">
                    <h1>Jobs</h1>
                </header>
                
                {/* Thanh công cụ (Toolbar) */}
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
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">Filter (All Departments)</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Economy">Economy</option>
                            <option value="Planner">Planner</option>
                        </select>
                    </div>

                    {/* Nút Thêm Công Việc */}
                    <button className="add-job-button" onClick={handleOpenModal}>
                        <span>+</span> Add new tasks
                    </button>
                </div>

                {/* Bảng dữ liệu chính (Job Table) */}
                <div className="grid-item job-table-container">
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
                            {filteredJobs.map((job) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RENDER MODAL (Hiển thị có điều kiện) */}
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
