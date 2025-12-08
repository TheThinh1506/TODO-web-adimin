import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboard/component/SideBar'; 
import '../../dashboard/style/DashBoard.css'; 
import '../style/JobsPage.css';
import AddJobModal from '../component/AddJobModal'; 

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 

const JobsPage = () => {
    const navigate = useNavigate();
    
    // --- STATE ---
    const [jobs, setJobs] = useState([]); 
    const [staffList, setStaffList] = useState([]); 
    const [groupList, setGroupList] = useState([]); 
    
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filter, setFilter] = useState('All'); 
    const [isLoading, setIsLoading] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- 1. HÀM TẢI DỮ LIỆU TỔNG HỢP ---
    const fetchAllData = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        const workspaceId = localStorage.getItem('currentWorkspaceId');
        
        if (!accessToken || !workspaceId) return;

        setIsLoading(true);
        try {
            const [projectsRes, usersRes, groupsRes] = await Promise.allSettled([
                axios.get(`${API_BASE_ROOT}/api/projects/owner`, { headers: { 'Authorization': `Bearer ${accessToken}` } }),
                axios.get(`${API_BASE_ROOT}/api/workspaces/${workspaceId}/list`, { headers: { 'Authorization': `Bearer ${accessToken}` } }),
                axios.get(`${API_BASE_ROOT}/api/workspaces/${workspaceId}/groups`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
            ]);

            // A. Xử lý Projects
            if (projectsRes.status === 'fulfilled') {
                const rawData = projectsRes.value.data.projects || projectsRes.value.data.data || [];
                const mappedJobs = rawData.map((item, index) => ({
                    id: item.project_id || item._id || item.id, 
                    no: index + 1,
                    task: item.name || item.title || 'No Name', 
                    department: item.department || 'General',
                    undertake: item.undertake || 'Me',
                    deadline: item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : '--/--',
                    status: item.status || 'In Progress',
                    feedback: 'View'
                }));
                setJobs(mappedJobs);
            }

            // B. Xử lý Staff List (giữ nguyên logic map)
            if (usersRes.status === 'fulfilled') {
                const rawUsers = usersRes.value.data.data || usersRes.value.data || [];
                const mappedUsers = rawUsers.filter(item => item).map(item => {
                    const u = item.User || item.user || item; 
                    const userId = u.user_id || u.id || u._id;
                    const userName = u.full_name || u.name || u.email || "Unnamed User";
                    return { id: userId, user_id: userId, name: userName, full_name: userName, email: u.email };
                }).filter(u => u.id);
                setStaffList(mappedUsers);
            }

            // C. Xử lý Group List (giữ nguyên logic map)
            if (groupsRes.status === 'fulfilled') {
                const rawGroups = groupsRes.value.data.data || groupsRes.value.data || [];
                const mappedGroups = rawGroups.map(g => ({
                    id: g.group_id || g.id,
                    group_id: g.group_id || g.id,
                    name: g.group_name || g.name
                }));
                setGroupList(mappedGroups);
            }

        } catch (error) {
            console.error("Lỗi chung khi tải dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    
    // --- 2. HÀM TẠO PROJECT & GÁN (ĐÃ FIX LỖI CRASH) ---
    const handleSaveJob = async (jobData) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const workspaceId = localStorage.getItem('currentWorkspaceId');
        
            let currentUserId = null;
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    // Dùng toán tử || để lấy ID từ bất kỳ key nào
                    currentUserId = parsed.user_id || parsed.id || parsed._id;
                } catch (e) {
                    console.error("Lỗi: JSON parse user info thất bại.", e);
                }
            }
            
            if (!accessToken || !currentUserId || !workspaceId) {
                alert("Lỗi: Thiếu thông tin người dùng hoặc Workspace. Vui lòng tải lại trang!");
                return;
            }

            // --- BƯỚC A: CHUẨN BỊ DATA TẠO PROJECT ---
            const formData = new FormData();
            formData.append('name', jobData.title); 
            formData.append('description', jobData.description || "Project description");
            formData.append('status', 'In Progress');
            
            // Map dữ liệu mới
            formData.append('undertake', jobData.undertake); 
            const sDate = jobData.startDate ? new Date(jobData.startDate) : new Date();
            let eDate = jobData.dueDate ? new Date(jobData.dueDate) : new Date(sDate.getTime() + 7*86400000);
            formData.append('start_date', sDate.toISOString()); 
            formData.append('end_date', eDate.toISOString());         
            formData.append('priority', jobData.priority || 'Medium'); 
            formData.append('type', jobData.type || 'General');
            
            // ID và Assignment
            formData.append('owner_id', currentUserId); 
            formData.append('workspace_id', workspaceId); 
            
            if (jobData.files && jobData.files.length > 0) {
                jobData.files.forEach((file) => formData.append('file', file));
            }

            console.log(" BƯỚC 1: Đang tạo Project...");
            const createRes = await axios.post(`${API_BASE_ROOT}/api/projects/create`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${accessToken}` }
            });

            const newProjectData = createRes.data.project || createRes.data.data || createRes.data || {};
            const newProjectId = newProjectData.project_id || newProjectData.id || newProjectData._id;

            if (!newProjectId) throw new Error("Lỗi: Không lấy được ID dự án mới! (BE không trả ID)");

            // --- GỌI API GÁN (ASSIGN) ---
            if (jobData.assignee) {
                const { id, type } = jobData.assignee;
                let assignUrl = '';
                let assignBody = {};

                console.log(`BƯỚC 2: Gán Project cho ${type} ID: ${id}`);

                if (type === 'group') {
                    assignUrl = `${API_BASE_ROOT}/api/projects/assign-group`;
                    assignBody = { project_id: newProjectId, group_id: id };
                } else if (type === 'user') {
                    assignUrl = `${API_BASE_ROOT}/api/projects/assign-user`;
                    assignBody = { project_id: newProjectId, user_id: id };
                }

                if (assignUrl) {
                    await axios.post(assignUrl, assignBody, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    console.log(" Đã gán thành công!");
                }
            }

            alert(" Tạo dự án và phân công thành công!");
            setIsModalOpen(false);
            fetchAllData(); 

        } catch (error) {
            console.error("Lỗi:", error);
            const msg = error.response?.data?.message || error.message;
            alert(`Lỗi Server: ${msg}`);
        }
    };

    // --- LOGIC UI KHÁC (Giữ nguyên) ---
    const filteredJobs = jobs.filter(job => {
        const matchesFilter = (filter === 'All' || job.department === filter);
        const matchesSearch = job.task.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toLowerCase();
        if (s === 'complete' || s === 'done') return 'status-complete';
        if (s === 'in progress' || s === 'active') return 'status-progress';
        return 'status-late';
    };

    const handleViewMilestone = (job) => {
        const projectId = job.id || job.project_id || job._id;
        navigate(`/milestone/${projectId}`, { state: { projectName: job.task } });
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="dashboard-container"> 
            <Sidebar /> 

            <div className="main-content">
                <header className="page-header">
                    <h1>Jobs Management</h1>
                </header>
                
                <div className="toolbar">
                    <div className="search-bar">
                        <input type="text" placeholder="Searching..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    
                    <div className="filter-bar">
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">All Departments</option>
                            <option value="IT">IT</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>

                    <button className="add-job-button" onClick={handleOpenModal}>
                        <span>+</span> New Project
                    </button>
                </div>

                <div className="grid-item job-table-container">
                    {isLoading ? (
                        <div style={{textAlign: 'center', padding: '20px'}}>⏳ Đang tải dữ liệu...</div>
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
                                    <th>Action</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (
                                        <tr key={job.id}>
                                            <td>{job.no}</td>
                                            <td onClick={() => handleViewMilestone(job)} style={{cursor: 'pointer', color: '#3497F9', fontWeight: '600', textDecoration: 'underline'}}>
                                                {job.task}
                                            </td>
                                            <td>{job.department}</td>
                                            <td>{job.undertake}</td>
                                            <td>{job.deadline}</td>
                                            <td><span className={`status-pill ${getStatusClass(job.status)}`}>{job.status}</span></td>
                                            <td><a href="#" className="feedback-link">{job.feedback}</a></td>
                                            <td style={{textAlign: 'center'}}>
                                                <button 
                                                    onClick={() => handleDeleteProject(job.id)}
                                                    style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#B3261E'}}
                                                    title="Xóa dự án"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Không tìm thấy dự án nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <AddJobModal 
                    onClose={handleCloseModal} 
                    onSave={handleSaveJob} 
                    staffList={staffList} 
                    groupList={groupList} 
                />
            )}
        </div>
    );
};

export default JobsPage;