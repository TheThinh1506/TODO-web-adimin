import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../dashboard/component/SideBar';
import AddMilestoneModal from '../component/AddMilestoneModal';
import '../style/MilestoneStyles.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // --- DỮ LIỆU GIẢ LẬP NHIỀU DÒNG ĐỂ TEST SCROLL DỌC ---
  const historyData = [
    { id: 1, time: '9:30 AM', date: '28/10/2025', staff: 'Thịnh', task: 'Thiết kế UI', status: 'Complete' },
    { id: 2, time: '10:00 AM', date: '28/10/2025', staff: 'Tài', task: 'Backend API', status: 'Pending' },
    { id: 3, time: '11:30 AM', date: '29/10/2025', staff: 'An', task: 'Database Fix', status: 'Complete' },
    { id: 4, time: '01:00 PM', date: '30/10/2025', staff: 'Bình', task: 'Testing', status: 'Pending' },
    { id: 5, time: '02:30 PM', date: '30/10/2025', staff: 'Thịnh', task: 'Deploy', status: 'Complete' },
    { id: 6, time: '03:30 PM', date: '30/10/2025', staff: 'Tài', task: 'Review Code', status: 'Complete' },
    { id: 7, time: '04:00 PM', date: '31/10/2025', staff: 'An', task: 'Client Meeting', status: 'Pending' },
    { id: 8, time: '08:00 AM', date: '01/11/2025', staff: 'Bình', task: 'Bug Fix Login', status: 'Complete' },
    { id: 9, time: '09:00 AM', date: '01/11/2025', staff: 'Thịnh', task: 'Update UI', status: 'Complete' },
    { id: 10, time: '10:00 AM', date: '01/11/2025', staff: 'Tài', task: 'Optimize DB', status: 'Pending' },
  ];

  return (
    <div className="project-layout">
      <Sidebar />

      <div className="project-main-content">
        
        {/* HEADER */}
        <div className="project-header">
          <h1 className="page-title">Home</h1>
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
             + Add Milestone
          </button>
        </div>

        {/* --- FRAME 1: MILESTONES (Có Scroll) --- */}
        <div className="data-frame">
          <div className="frame-title">Milestones Timeline</div>
          
          <div className="timeline-container">
            {/* Header */}
            <div className="timeline-header">
              <div className="col-header-task">Task</div>
              <div className="months-row">
                {months.map(m => <div key={m} className="month-label">{m}</div>)}
              </div>
            </div>

            {/* Tạo nhiều dòng để test scroll dọc */}
            {[...Array(15)].map((_, index) => (
              <div key={index} className="timeline-row">
                 <div className="row-task-area">
                    {/* Để trống theo thiết kế */}
                 </div>
                 <div className="row-months-area">
                    {/* Border only here */}
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FRAME 2: HISTORY (Có Scroll) --- */}
        <div className="data-frame">
          <div className="frame-title">History Log</div>
          
          <table className="history-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Date</th>
                <th>Staff</th>
                <th>Task Name</th>
                <th>Status</th>
                <th>Notes (Kéo ngang để xem hết)</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row) => (
                <tr key={row.id}>
                  <td>{row.time}</td>
                  <td>{row.date}</td>
                  <td>
                    <div className="staff-info">
                      <div className="avatar-small" style={{background: '#ccc'}}></div>
                      {row.staff}
                    </div>
                  </td>
                  <td>{row.task}</td>
                  <td>
                    <span className={`status-badge ${row.status === 'Complete' ? 'st-complete' : 'st-pending'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>Ghi chú rất dài này sẽ giúp kích hoạt thanh cuộn ngang của bảng History...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <AddMilestoneModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        projectId={id}
        onSaveSuccess={() => console.log("Refresh!")}
      />
    </div>
  );
};

export default ProjectDetail;