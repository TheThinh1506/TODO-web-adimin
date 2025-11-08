

import React, {useState } from 'react';
import Sidebar from '../component/SideBar';
import TaskProgressChart from '../component/TaskProgressChart';
import TodaysSummary from '../component/TodaySummary';
import MonthProjectTable from '../component/MonthProjectTable';
import TaskDueTodayTable from '../component/TaskDueTodayTable';
import ProjectTimeline from '../component/ProjectTimeline';

import '../style/DashBoard.css';

// 3. COMPONENT CHÍNH
const DashboardPage = () => {
    // 3. TẠO STATE ĐỂ QUẢN LÝ CHẾ ĐỘ XEM
    // Nếu selectedProject là null -> Xem Dashboard chính
    // Nếu selectedProject có giá trị -> Xem Chi tiết Project
    const [selectedProject, setSelectedProject] = useState(null);

    // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
    // (Trong tương lai, dữ liệu này sẽ được lấy từ API bằng useEffect và useState)

    const handleProjectClick = (project) => {
        // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
        // Khi click, bạn cần gọi API để lấy dữ liệu Timeline và History cho project.id
        // Ví dụ: GET /api/projects/{project.id}/details
        
        // Tạm thời, chúng ta chỉ set project đã chọn
        setSelectedProject(project);
    };
    // Dữ liệu giả định (Mock Data) cho Month's Project (API Call 1)
    const monthsProjects = [
        { name: 'TO-DO APP', assignedTo: 'Group 4', status: 'In Progress' },
        { name: 'Gặp khách hàng', assignedTo: 'T.Tài', status: 'Complete' },
        { name: 'Báo cáo quý 4', assignedTo: 'T.Thịnh', status: 'Complete' },
    ];
    
    // Dữ liệu giả định cho Task Due Today (API Call 2)
    const dueTasks = [
        { time: '9:30 AM', date: '28/10/2025', staff: 'Thịnh', task: 'To-Do App', status: 'Late' },
        { time: '9:30 AM', date: '28/10/2025', staff: 'Tài', task: 'To-Do App', status: 'Complete' },
        { time: '10:30 AM', date: '28/10/2025', staff: 'Thái An', task: 'Báo cáo quý 4', status: 'Complete' },
        { time: '11:00 AM', date: '28/10/2025', staff: 'Tấn An', task: 'To-Do App', status: 'In Progress' },
    ];

    const handleBackToHome = () => {
        setSelectedProject(null);
    };
   return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content">
                <header className="page-header">
                  <h1>{selectedProject ? selectedProject.name : 'Home'}</h1>
                </header>

        
                
                {/* A. NẾU CHƯA CHỌN PROJECT (Hiển thị Dashboard chính) */}
                {!selectedProject ? (
                    <div className="dashboard-grid">
                        <div className="grid-item progress-chart-box">
                            <h3 className="card-title">Task Progress</h3>
                            <TaskProgressChart />
                        </div>
                        <div className="grid-item months-project-box">
                            <h3 className="card-title project-title">Month's Project</h3>
                            {/* Truyền hàm handleProjectClick xuống component con */}
                            <MonthProjectTable projects={monthsProjects} onProjectClick={handleProjectClick} /> 
                        </div>
                        <div className="grid-item due-tasks-box">
                            <TaskDueTodayTable tasks={dueTasks} /> 
                        </div>
                        <div className="grid-item summary-box">
                            <TodaysSummary tasks={dueTasks} /> 
                        </div>
                    </div>
                ) : (
                
                /* B. NẾU ĐÃ CHỌN PROJECT (Hiển thị Chi tiết Project) */
                    <div className="project-details-grid">
                        <div className="grid-item timeline-box">
                            <h3 className="card-title">Timeline</h3>
                            {/* Nút Back (ví dụ) */}
                            <button onClick={handleBackToHome} className="back-button">Back </button>
                            <ProjectTimeline project={selectedProject} />
                        </div>
                        
                        {/* Frame 2: History  */}
                        <div className="grid-item history-box">
                            {/* **ĐIỂM KẾT NỐI API:** Cần truyền dữ liệu History (thay vì dueTasks) vào đây.
                                Dữ liệu này lấy từ API khi click vào project.
                            */}
                            <TaskDueTodayTable tasks={dueTasks} title="History" /> 
                        </div>
                   
                        <div className="grid-item summary-box">
                            <TodaysSummary tasks={dueTasks} /> 
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;