import React, { useState, useEffect } from 'react';
import Sidebar from '../../dashboard/component/SideBar';
import { FaGithub } from "react-icons/fa"; 
import axios from 'axios';
import '../style/NotificationPage.css';

// URL API gốc (Sửa lại theo IP server của bạn)
const API_BASE_ROOT = 'http://163.61.110.132:4000/api'; 

const NotificationPage = () => {

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
 
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

   
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');

            // =========================================================
            // TODO: GỌI API GET NOTIFICATIONS
            // URL: /notifications/all (Ví dụ)
            // =========================================================
            
            console.log("Đang tải danh sách thông báo...");

            /* const response = await axios.get(`${API_BASE_ROOT}/notifications`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            
            // Giả sử API trả về mảng: [{ _id, title, description, created_at, type, is_read }]
            // Bạn có thể cần map dữ liệu lại cho khớp với UI nếu tên trường khác nhau
            const formattedData = response.data.map(item => ({
                id: item._id,
                tag: item.type || 'System', // Ví dụ: 'Github', 'Work'
                time: new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                date: new Date(item.created_at).toLocaleDateString(),
                title: item.title,
                description: item.description,
                isRead: item.is_read
            }));

            setNotifications(formattedData);
            */

        } catch (error) {
            console.error("Lỗi tải thông báo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // --- LOGIC CHỌN (UI) ---
    const toggleSelectionMode = () => {
        if (isSelectionMode) {
            setIsSelectionMode(false);
            setSelectedIds([]);
        } else {
            setIsSelectionMode(true);
        }
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // --- 2. GỌI API XÓA THÔNG BÁO ---
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;

        if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} thông báo?`)) {
            try {
                const accessToken = localStorage.getItem('accessToken');

                // =========================================================
                // TODO: GỌI API DELETE NOTIFICATIONS
                // URL: /notifications/delete (Method: POST hoặc DELETE)
                // Body: { ids: [1, 2, 3] }
                // =========================================================

                console.log("Đang xóa các ID:", selectedIds);

                /*
                await axios.post(
                    `${API_BASE_ROOT}/notifications/delete`, 
                    { ids: selectedIds },
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );
                
                // Xóa thành công thì cập nhật UI (Lọc bỏ các item đã xóa)
                const newNotifications = notifications.filter(n => !selectedIds.includes(n.id));
                setNotifications(newNotifications);
                
                // Reset trạng thái
                setSelectedIds([]);
                setIsSelectionMode(false);
                alert("Đã xóa thành công!");
                */

            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Không thể xóa thông báo. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar /> 

            <div className="main-content">
                <div className="notification-page-container">
                    
                    {/* Header */}
                    <div className="notif-header">
                        <h1 className="notif-title">Notification</h1>
                        
                        <div className="notif-actions">
                            {isSelectionMode && selectedIds.length > 0 && (
                                <button className="btn-delete-selected" onClick={handleDeleteSelected}>
                                    Delete ({selectedIds.length})
                                </button>
                            )}
                            
                            {/* Chỉ hiện nút Choose nếu có thông báo */}
                            {notifications.length > 0 && (
                                <button className="btn-choose" onClick={toggleSelectionMode}>
                                    {isSelectionMode ? 'Cancel' : 'Choose'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Danh sách thông báo */}
                    <div className="notif-list">
                        {isLoading ? (
                            <div style={{textAlign:'center', color:'#888', marginTop:'20px'}}>Đang tải...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map(item => (
                                <div key={item.id} className="notif-item">
                                    
                                    {/* Checkbox */}
                                    {isSelectionMode && (
                                        <input 
                                            type="checkbox" 
                                            className="notif-checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleSelect(item.id)}
                                        />
                                    )}

                                    {/* Nội dung */}
                                    <div className="notif-content">
                                        <div className="notif-item-header">
                                            <div className="notif-meta">
                                                <span className="tag-work">
                                                    {/* Render icon GitHub nếu tag là Github */}
                                                    {item.tag === 'Github' && <FaGithub size={10} />}
                                                    {item.tag || 'System'}
                                                </span>
                                                
                                                <span className="time-text">
                                                    {item.time} | {item.date}
                                                </span>
                                            </div>

                                            {/* Chấm đỏ nếu chưa đọc */}
                                            {!item.isRead && <div className="red-dot"></div>}
                                        </div>

                                        <span className="notif-subject">{item.title}</span>
                                        <span className="notif-desc">{item.description}</span>
                                        
                                        <div className="item-divider"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign:'center', color:'#888', marginTop:'20px'}}>
                                Không có thông báo nào.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NotificationPage;