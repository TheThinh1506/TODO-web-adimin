import React, { useState, useEffect } from 'react';
import Sidebar from '../component/SideBar';
import TaskProgressChart from '../component/TaskProgressChart';
import TodaysSummary from '../component/TodaySummary';
import MonthProjectTable from '../component/MonthProjectTable';
import TaskDueTodayTable from '../component/TaskDueTodayTable';
import ProjectTimeline from '../component/ProjectTimeline';
import axios from 'axios';
import '../style/DashBoard.css';

// CẤU HÌNH API
const API_BASE_ROOT = 'http://34.124.178.44:4000';
const API_BASE_URL = `${API_BASE_ROOT}/api`;

const DashboardPage = () => {
    // State quản lý dữ liệu
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectList, setProjectList] = useState([]); 
    const [projectTasks, setProjectTasks] = useState([]); 
    const [allUserTasks, setAllUserTasks] = useState([]); 
    const [loading, setLoading] = useState(false);

    const [workspaceInfo, setWorkspaceInfo] = useState({ name: 'Loading...', id: '...' });

  // 1. GỌI API KHI VÀO TRANG
    useEffect(() => {
        const fetchInitialData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
           
            const [projectsResult, workspaceResult] = await Promise.allSettled([
                axios.get(`${API_BASE_ROOT}/api/projects/owner`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }),
                
                
                axios.get(`${API_BASE_ROOT}/api/workspaces/mine`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                })
            ]);

            // --- XỬ LÝ KẾT QUẢ ---

            if (projectsResult.status === 'fulfilled') {
                
                const data = projectsResult.value.data;
                if (Array.isArray(data)) {
                    setProjectList(data);
                } else if (data && Array.isArray(data.data)) {
                    setProjectList(data.data);
                } else {
                    setProjectList([]); 
                }
            } else {
                console.warn("⚠️ Không lấy được Projects:", projectsResult.reason);
                setProjectList([]); 
            }

    
            if (workspaceResult && workspaceResult.status === 'fulfilled') {
                const responseBody = workspaceResult.value.data;
                let finalData = null;
           
                if (Array.isArray(responseBody)) {
                    finalData = responseBody.length > 0 ? responseBody[0] : null;
                } else if (responseBody && responseBody.data) {
                    finalData = responseBody.data;
                } else {
                    finalData = responseBody;
                }

                if (finalData) {
                    const wsId = finalData.workspace_id || finalData._id || finalData.id;
                    setWorkspaceInfo({
                        name: finalData.name || "My Workspace",
                        id: wsId || "N/A"
                    });
                    if (wsId) localStorage.setItem('currentWorkspaceId', wsId);
                }
            } else {
                console.warn(" Không lấy được Workspace.");
            }

        } catch (error) {
            console.error("Lỗi chung fetchInitialData:", error);
        }
    };

        fetchInitialData();
    }, []);

    // 2. XỬ LÝ KHI CLICK VÀO MỘT PROJECT
    const handleProjectClick = (project) => {
        const tasksOfProject = allUserTasks.filter(task => task.projectId === project._id);
        setSelectedProject(project);
        setProjectTasks(tasksOfProject);
        // navigate(`/project/${project._id}`); // Nếu bạn dùng router thì bỏ comment dòng này
    };

    const handleBackToHome = () => {
        setSelectedProject(null);
        setProjectTasks([]);
    };

    // Hàm copy ID nhanh
    const copyToClipboard = () => {
        if (workspaceInfo.id && workspaceInfo.id !== '---') {
            navigator.clipboard.writeText(workspaceInfo.id);
            alert("Đã copy Workspace ID: " + workspaceInfo.id);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content">
                {/* --- HEADER ĐƯỢC CẬP NHẬT --- */}
                <header className="page-header">
                    {/* Tiêu đề bên trái */}
                    <h1>{selectedProject ? selectedProject.name : 'Home'}</h1>

                    {/* Khung thông tin Workspace bên phải */}
                    <div className="workspace-info-card">
                        <div className="ws-details">
                            <span className="ws-name">{workspaceInfo.name}</span>
                            <div className="ws-id-row" onClick={copyToClipboard} title="Click to copy ID">
                                <span className="ws-id-label">ID:</span>
                                <span className="ws-id-value">{workspaceInfo.id}</span>
                                <span className="ws-copy-icon">❐</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- NỘI DUNG CHÍNH (Giữ nguyên logic cũ) --- */}
                {!selectedProject ? (
                    <div className="dashboard-grid">
                        
                        <div className="grid-item progress-chart-box">
                            <h3 className="card-title">Task Progress</h3>
                            <TaskProgressChart />
                        </div>

                        <div className="grid-item months-project-box">
                            <h3 className="card-title project-title">Month's Project</h3>
                            {loading ? (
                                <p>Loading projects...</p>
                            ) : (
                                <MonthProjectTable 
                                    projects={projectList} 
                                    onProjectClick={handleProjectClick} 
                                />
                            )}
                        </div>

                        <div className="grid-item due-tasks-box">
                            <TaskDueTodayTable tasks={allUserTasks} title="Due Tasks" /> 
                        </div>

                        <div className="grid-item summary-box">
                            <TodaysSummary tasks={allUserTasks} /> 
                        </div>
                    </div>
                ) : (
                    <div className="project-details-grid">
                        <div className="grid-item timeline-box">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px'}}>
                                <h3 className="card-title">Timeline</h3>
                                <button onClick={handleBackToHome} className="back-button" style={{cursor: 'pointer'}}>Back</button>
                            </div>
                            <ProjectTimeline project={selectedProject} tasks={projectTasks} />
                        </div>
                        
                        <div className="grid-item history-box">
                            <TaskDueTodayTable tasks={projectTasks} title="History" /> 
                        </div>
                    
                        <div className="grid-item summary-box">
                            <TodaysSummary tasks={projectTasks} /> 
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;