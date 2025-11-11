// src/staff/pages/StaffPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../dashboard/component/SideBar';
import StaffList from '../components/StaffList';
import StaffDetails from '../components/StaffDetails';
import GroupList from '../components/GroupList'; 
import AddNewModal from '../components/AddNewModal';
import '../../dashboard/style/DashBoard.css'; 
import '../style/StaffPage.css'; 

// **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
const API_BASE_ROOT = 'http://163.61.110.132:4000'; 
const API_GROUP_URL = `${API_BASE_ROOT}/api/groups`;

// Dữ liệu giả định (Mock Data) - Nhân viên
const mockStaffList = [
    { id: 1, 
      name: 'Trần Nguyễn Lê Cao', 
      email: 'cao@gmail.com', 
      avatar: '/images/avatar.jpg', 
      phone: '0123456789', 
      birthday: '11/11/1999', 
      gender: 'Nam', 
      address: '120 Yên Lãng' },
    { id: 2, 
      name: 'Tạ Lệ', 
      email: 'le@gmail.com', 
      avatar: '/images/avatar.jpg', 
      phone: '0987654321',
      birthday: '12/12/2000', 
      gender: 'Nữ', 
      address: '121 Yên Lãng' },
    { id: 3, 
      name: 'Smith', 
      email: 'smith@gmail.com', 
      avatar: '/images/avatar.jpg', 
      phone: '0123412345', 
      birthday: '10/10/2000', 
      gender: 'Nam', 
      address: '122 Yên Lãng' },
    { 
      id: 4, 
      name: 'Võ Tấn Tài', 
      email: 'tai.nv@gmail.com', 
      avatar: '/images/avatar.jpg', 
      phone: '0905123456', 
      birthday: '01/05/2005', 
      gender: 'Nam', 
      address: 'Quận 1, TP. HCM' 
    },
    { 
      id: 5, 
      name: 'Nguyễn Tấn An', 
      email: 'anhnguyen9854321  @gmail.com', 
      avatar: '/images/avatar.jpg', 
      phone: '0912345678', 
      birthday: '20/09/2005', 
      gender: 'Nữ', 
      address: 'Quận 3, TP. HCM' 
    },
    { 
      id: 6, 
      name: 'Nguyễn Thái An', 
      email: 'thai.an@gmail.com', 
      avatar: '/images/avatar.jpg', 
      phone: '0909090909', 
      birthday: '08/05/2005', 
      gender: 'Nam', 
      address: 'Quận 10, TP. HCM' 
    },
    { 
      id: 7, 
      name: 'Nguyễn Thế Thịnh', 
      email: 'thinh.huynh@gmail.com', 
      avatar: '/images/avatar.jpg', 
      phone: '0888123123', 
      birthday: '28/11/2005', 
      gender: 'Nam', 
      address: 'Quận 5, TP. HCM' 
    }
];

// 2. DỮ LIỆU GIẢ ĐỊNH CHO NHÓM (Dựa trên mockStaffList)
const mockGroupList = [
    { 
        id: 1, 
        name: 'Group 1 - Dev',
        members: [ mockStaffList[0], mockStaffList[1], mockStaffList[5] ] 
    },
    {
        id: 2,
        name: 'Group 2 - IT Support',
        members: [ mockStaffList[2], mockStaffList[3], mockStaffList[4], mockStaffList[6] ] 
    }
];


const StaffPage = () => {
    
   
    const [activeTab, setActiveTab] = useState('Nhân viên');

    const [staffList, setStaffList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hàm gọi API để lấy danh sách nhân viên
    useEffect(() => {
        // **ĐIỂM KẾT NỐI API BACKEND (GET /api/users và GET /api/groups):**
        // Bạn cần gọi 2 API: 
        // 1. Lấy tất cả nhân viên (cho tab 'Nhân viên')
        // 2. Lấy tất cả nhóm và thành viên trong nhóm (cho tab 'Nhóm')
        
        // Dùng Mock Data
        setStaffList(mockStaffList);
        setGroupList(mockGroupList); 
      //  setSelectedStaff(mockStaffList[0]); 
        
    }, []); // Chạy 1 lần

    // Hàm xử lý khi click xóa nhân viên
    const handleDeleteStaff = (staffId) => {
        // **ĐIỂM KẾT NỐI API BACKEND (DELETE /api/users/{staffId}):**
        alert(`Đang xóa nhân viên ID: ${staffId} (Chưa gọi API)`);
    
    };

    // 3. HÀM MỚI (XỬ LÝ NHÓM)
    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm (ID: ${groupId})?`)) {
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete(`${API_GROUP_URL}/${groupId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            alert("Đã xóa nhóm thành công!");
            setGroupList(prevGroups => prevGroups.filter(g => g.id !== groupId));

        } catch (error) {
            console.error("Lỗi khi xóa nhóm:", error);
            alert("Lỗi: " + (error.response?.data?.message || "Không thể xóa nhóm."));
        }
    };
    
    const handleAddMember = (groupId) => {
        // **ĐIỂM KẾT NỐI API BACKEND (POST /add-member):**
        alert(`Mở Modal thêm thành viên vào nhóm ID: ${groupId} (Chưa code)`);
    };

    // Hàm xử lý khi click "Thêm mới"
    const handleAddNew = () => {
       setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
const handleSaveData = async (data, type) => {
        
        if (type === 'Nhân viên') {
            /*******************************************************
             * *  ĐIỂM KẾT NỐI API (CẦN BỔ SUNG)
             * GỌI API: POST /api/admin/create-user (Hoặc /auth/sign-up?)
             * MỤC ĐÍCH: Admin tạo tài khoản nhân viên mới.
             * *******************************************************/
            console.log("Đang lưu nhân viên mới:", data);

        } else if (type === 'Nhóm') {
            
            try {
                const accessToken = localStorage.getItem('accessToken');
                
                const groupBody = {
                    group_name: data.tenNhom,
                    description: "Mô tả mặc định"
                };
                
                const groupResponse = await axios.post(
                    `${API_GROUP_URL}/create`, 
                    groupBody,
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );
                
               const newGroup = groupResponse.data.group;
                console.log("Đã tạo nhóm ID:", newGroup.group_id);

            
                setGroupList(prevGroupList => [
                    ...prevGroupList, 
                    newGroup          
                ]);

              for (const member of data.members) {
                    await axios.post(
                        `${API_GROUP_URL}/add-member`,
                        { group_id: newGroup.group_id, member_email: member.email },
                        { headers: { 'Authorization': `Bearer ${accessToken}` } }
                    );
                }
                
                alert("Tạo nhóm và thêm thành viên thành công!");

            } catch (error) {
                 console.error("Lỗi khi tạo nhóm:", error);
                 alert("Lỗi: " + (error.response?.data?.message || "Không thể tạo nhóm."));
            }
        }
        
        setIsModalOpen(false); 
    };
    return (
        <div className="dashboard-container">
            <Sidebar /> 

            <div className="main-content">
                <header className="page-header">
                    <h1>Staff</h1>
                </header>

                {/* Khung trắng chính chứa nội dung trang Staff */}
                <div className="staff-page-wrapper">
                    
                    {/* Header của khung (Tabs và Nút Thêm mới) */}
                    <div className="staff-header">
                        <div className="tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'Nhân viên' ? 'active' : ''}`}
                                
                                onClick={() => setActiveTab('Nhân viên')}
                            >
                                Nhân viên
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'Nhóm' ? 'active' : ''}`}
                               
                                onClick={() => setActiveTab('Nhóm')}
                            >
                                Nhóm
                            </button>
                        </div>
                        <button className="add-new-button" onClick={handleAddNew}>
                            + Thêm mới
                        </button>
                    </div>

                    {/* Nội dung (chia 2 cột: Danh sách và Chi tiết) */}
                    <div className="staff-content-grid">
                        
                        {/* CỘT TRÁI: DANH SÁCH (Nhân viên hoặc Nhóm) */}
                        <div className="staff-list-column">
                            {/* Thanh tìm kiếm */}
                            <div className="list-search-bar">
                              
                                <input type="text" placeholder="Tìm kiếm..." />
                            </div>
                            
                            {activeTab === 'Nhân viên' ? (
                                <StaffList 
                                    staffList={staffList} 
                                    selectedStaffId={selectedStaff ? selectedStaff.id : null}
                                    onSelectStaff={setSelectedStaff} // Hàm callback khi click
                                    onDeleteStaff={handleDeleteStaff} // Hàm callback khi xóa
                                />
                            ) : (
                                <GroupList
                                    groups={groupList}
                                    selectedStaffId={selectedStaff ? selectedStaff.id : null}
                                    onSelectStaff={setSelectedStaff}
                                    onDeleteStaff={handleDeleteStaff}
                                    onDeleteGroup={handleDeleteGroup}
                                    onAddMember={handleAddMember}
                                />
                            )}
                        </div>

                        {/* CỘT PHẢI: CHI TIẾT */}
                        <div className="staff-details-column">
                            {/* Luôn hiển thị chi tiết nhân viên được chọn */}
                            {selectedStaff ? (
                                <StaffDetails staff={selectedStaff} />
                            ) : (
                                <div className="placeholder-tab">Chọn một nhân viên để xem chi tiết.</div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <AddNewModal 
                    onClose={handleCloseModal} 
                    onSave={handleSaveData}
                    // Truyền danh sách nhân viên xuống để Tab Nhóm có thể tìm kiếm
                    mockStaffList={staffList} 
                />
            )}
        </div>
    );
};

export default StaffPage;