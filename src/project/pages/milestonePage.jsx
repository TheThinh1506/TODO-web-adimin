import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../dashboard/component/SideBar';
import AddMilestoneModal from '../component/AddMilestoneModal';
import '../style/MilestoneStyles.css';

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 

const MilestonePage = () => {
  const { id } = useParams(); // ID Project
  const location = useLocation();
  const projectTitle = location.state?.projectName || "Project Milestones";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. GỌI API LẤY DANH SÁCH (Bao gồm cả Task con từ Mobile) ---
  const fetchMilestones = useCallback(async () => {
    if (!id) return;
    const accessToken = localStorage.getItem('accessToken');
    setIsLoading(true);
    try {
      // API này cần trả về cấu trúc: { ..., start_date, end_date, tasks: [...] }
      const response = await axios.get(`${API_BASE_ROOT}/api/milestones/project/${id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const data = response.data.data || response.data || [];
      console.log("Dữ liệu Milestone (Admin tạo khung + Mobile tạo task):", data);
      setMilestones(data);
    } catch (error) {
      console.error("Lỗi tải Milestone:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  // --- 2. TÍNH TOÁN DẢI THỜI GIAN HIỂN THỊ (DAILY VIEW) ---
 const timelineRange = useMemo(() => {
    const validMilestones = milestones.filter(m => 
        m.start_date && 
        m.end_date && 
        !isNaN(new Date(m.start_date).getTime()) && 
        !isNaN(new Date(m.end_date).getTime())
    );

    // 2. Nếu không có dữ liệu hoặc toàn bộ dữ liệu bị lỗi ngày -> Hiển thị mặc định 30 ngày tới
    if (validMilestones.length === 0) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(start);
      end.setDate(end.getDate() + 30);
      
      return { start, end, totalDays: 31 };
    }

    let minDate = new Date(validMilestones[0].start_date);
    let maxDate = new Date(validMilestones[0].end_date);

    validMilestones.forEach(m => {
      const s = new Date(m.start_date);
      const e = new Date(m.end_date);
      if (s < minDate) minDate = s;
      if (e > maxDate) maxDate = e;
    });

    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 5);

  
    const diffTime = Math.abs(maxDate - minDate);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

   
    if (isNaN(totalDays) || totalDays <= 0) {
        return { start: new Date(), end: new Date(), totalDays: 30 };
    }

    return { start: minDate, end: maxDate, totalDays };
  }, [milestones]);

  const dateHeaders = useMemo(() => {
    const dates = [];
    for (let i = 0; i < timelineRange.totalDays; i++) {
      const d = new Date(timelineRange.start);
      d.setDate(d.getDate() + i);
      dates.push(new Date(d));
    }
    return dates;
  }, [timelineRange]);

  // --- 3. LOGIC QUAN TRỌNG: VẼ KHUNG THỜI GIAN (ADMIN QUY ĐỊNH) ---
  const getGridStyle = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    // Tính toán Milestone này nằm ở ô số mấy trên lưới ngày
    const diffStart = Math.ceil((start - timelineRange.start) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return {
      gridColumnStart: diffStart + 1,
      gridColumnEnd: `span ${duration > 0 ? duration : 1}`
    };
  };

  // --- 4. LOGIC QUAN TRỌNG: TÍNH TIẾN ĐỘ (DỰA VÀO TASK TỪ MOBILE) ---
  const calculateProgress = (milestone) => {
    // Nếu chưa có task nào (Mới tạo) -> 0%
    const tasks = milestone.tasks || [];
    if (tasks.length === 0) return 0;

    // Nếu có task -> Tính % hoàn thành
    const completed = tasks.filter(t => t.status === 'done' || t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const gridTemplateStyle = {
    gridTemplateColumns: `repeat(${timelineRange.totalDays}, 50px)`,
    width: 'max-content'
  };

  // --- LOGIC HISTORY (CHỈ HIỆN CÁI ĐÃ XONG 100%) ---
  const completedHistory = useMemo(() => {
    return milestones
        .filter(ms => calculateProgress(ms) === 100)
        .map(ms => ({
            id: ms.id || ms._id || ms.milestone_id,
            time: "09:00 AM", 
            date: new Date(ms.end_date).toLocaleDateString('vi-VN'),
            staff: "Team", 
            avatar: "/images/avatar.jpg", 
            task: ms.name, 
            status: "Complete"
        }));
  }, [milestones]);

  return (
    <div className="project-layout">
      <Sidebar />

      <div className="project-main-content">
        
        {/* HEADER */}
        <div className="project-header">
          <h1 className="page-title">{projectTitle}</h1>
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>+ Add Milestone</button>
        </div>

        {/* --- TIMELINE CHART --- */}
        <div className="data-frame milestone-frame-large">
          <div className="frame-title">
            Timeline ({timelineRange.start.toLocaleDateString()} - {timelineRange.end.toLocaleDateString()})
          </div>
          
          <div className="timeline-container" style={{border: 'none', boxShadow: 'none'}}>
            
            {/* Header Ngày */}
            <div className="timeline-header" style={{width: 'fit-content'}}>
              <div className="col-header-task">Milestone Name</div>
              <div className="days-row" style={gridTemplateStyle}>
                {dateHeaders.map((date, index) => (
                  <div key={index} className="day-label">
                    <span className="day-number">{date.getDate()}</span>
                    <span className="day-month">/{date.getMonth() + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="timeline-body-scroll">
              
              {isLoading && <div style={{padding:'30px', textAlign:'center'}}>⏳ Loading data...</div>}

              {/* TRẠNG THÁI RỖNG */}
              {!isLoading && milestones.length === 0 && (
                 <div className="empty-state-lines">
                    <div style={{padding: '40px', textAlign: 'center', color: '#999'}}>
                        Chưa có Milestone nào. Admin hãy tạo Milestone để lên kế hoạch!
                    </div>
                 </div>
              )}

              {/* RENDER MILESTONE */}
              {!isLoading && milestones.map((ms, index) => {
                const progress = calculateProgress(ms);
                const uniqueKey = ms.id || ms._id || ms.milestone_id || `ms-${index}`;
                
                return (
                  <div key={uniqueKey} className="timeline-row" style={{width: 'fit-content'}}>
                     {/* 1. CỘT TÊN MILESTONE (CẬP NHẬT SAU KHI TẠO) */}
                     <div className="row-task-area">
                       {/* Chỉ tick xanh khi đã xong 100% */}
                       <input type="checkbox" className="custom-checkbox" checked={progress === 100} readOnly/>
                       <span title={ms.name}>{ms.name}</span>
                     </div>

                     {/* 2. KHU VỰC HIỂN THỊ TASK (THEO Ý BẠN LÀ KHUNG THỜI GIAN) */}
                     <div className="row-days-area" style={gridTemplateStyle}>
                        {/* Lưới nền */}
                        <div className="grid-background-days" style={gridTemplateStyle}>
                          {[...Array(timelineRange.totalDays)].map((_, i) => <div key={i} className="grid-col-day"></div>)}
                        </div>

                        {/* THANH XÁM (SCOPE): Luôn hiển thị dựa trên Start-End Date Admin nhập */}
                        <div 
                          className="milestone-bar" 
                          style={getGridStyle(ms.start_date, ms.end_date)}
                          title={`${ms.name} (Plan: ${new Date(ms.start_date).toLocaleDateString()} - ${new Date(ms.end_date).toLocaleDateString()})`}
                        >
                          {/* THANH MÀU (PROGRESS): Chỉ hiện khi Mobile user làm xong Task */}
                          <div 
                            className="progress-fill" 
                            style={{ 
                                width: `${progress}%`, 
                                // Nếu chưa có task (0%) -> Ẩn màu xanh đi
                                opacity: progress > 0 ? 1 : 0, 
                                backgroundColor: progress === 100 ? '#27AE60' : '#429FFB' 
                            }}
                          ></div>
                          
                          {/* Label %: Chỉ hiện khi có tiến độ */}
                          {progress > 0 && (
                              <span className="progress-label" style={{left: '50%', transform: 'translate(-50%, -50%)'}}>
                                {progress}%
                              </span>
                          )}
                          {/* Nếu chưa có task, có thể hiện chữ "Planned" hoặc để trống cho sạch */}
                          {progress === 0 && (
                              <span style={{fontSize:'10px', color:'#888', position:'absolute', left:'5px', top:'50%', transform:'translateY(-50%)'}}>
                                
                              </span>
                          )}
                        </div>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- HISTORY FRAME --- */}
        <div className="data-frame history-frame-small">
          <div className="history-container">
            <div className="history-tab-title">History (Completed)</div>
            <table className="history-table">
                <thead>
                <tr>
                    <th style={{width: '15%'}}>Time</th>
                    <th style={{width: '15%'}}>Date</th>
                    <th style={{width: '25%'}}>Staff</th>
                    <th style={{width: '30%'}}>Task</th>
                    <th style={{width: '15%'}}>Status</th>
                </tr>
                </thead>
                <tbody>
                {completedHistory.length > 0 ? (
                    completedHistory.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.time}</td>
                            <td>{row.date}</td>
                            <td><div className="staff-info"><img src={row.avatar} alt="" className="avatar-small" onError={(e)=>e.target.style.display='none'}/>{row.staff}</div></td>
                            <td>{row.task}</td>
                            <td><span className="status-text text-complete">{row.status}</span></td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="5" style={{textAlign:'center', color:'#999', padding:'20px'}}>Chưa có milestone nào hoàn thành 100%.</td></tr>
                )}
                </tbody>
            </table>
          </div>
        </div>

      </div>

      <AddMilestoneModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        projectId={id}
        onSaveSuccess={fetchMilestones}
      />
    </div>
  );
};

export default MilestonePage;