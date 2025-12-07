import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../../dashboard/component/SideBar';
import StaffList from '../components/StaffList';
import StaffDetails from '../components/StaffDetails';
import GroupList from '../components/GroupList'; 
import AddNewModal from '../components/AddNewModal'; 
import AddGroupModal from '../components/AddGroupModal'; 
import AddGroupMemberModal from '../components/AddGroupMemberModal';
import '../../dashboard/style/DashBoard.css'; 
import '../style/StaffPage.css'; 

const API_BASE_ROOT = 'http://34.124.178.44:4000'; 
const API_GROUP_URL = `${API_BASE_ROOT}/api/groups`; 

const StaffPage = () => {
    const [activeTab, setActiveTab] = useState('Nhân viên');
    const [staffList, setStaffList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [targetGroupId, setTargetGroupId] = useState(null);
    
    // Modal states
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false); 

    // --- 1. HÀM GỌI API LẤY DỮ LIỆU (THAY THẾ MOCK DATA) ---
    const fetchWorkspaceData = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        const workspaceId = localStorage.getItem('currentWorkspaceId');

        if (!accessToken) return;
        
        if (!workspaceId) {
            console.warn("Chưa chọn Workspace, không thể tải dữ liệu.");
            return;
        }

        try {
            console.log(` Đang tải dữ liệu cho Workspace ID: ${workspaceId}...`);

            const [membersRes, groupsRes] = await Promise.allSettled([
                
                axios.get(`${API_BASE_ROOT}/api/workspaces/${workspaceId}/list`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }),
                
               
                axios.get(`${API_BASE_ROOT}/api/workspaces/${workspaceId}/groups`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                })
            ]);

            // --- XỬ LÝ KẾT QUẢ MEMBERS ---
            if (membersRes.status === 'fulfilled') {
                const rawMembers = membersRes.value.data.data || membersRes.value.data || [];
                
                console.log("🔍 DATA GỐC TỪ SERVER:", rawMembers); 

               
                const mappedStaff = rawMembers.map(item => {
                    const userInfo = item.User || item.user || item; 

                    return {
                    
                        id: userInfo.user_id || userInfo.id || userInfo._id,
                        
                       
                        name: userInfo.full_name || userInfo.name || userInfo.username || "No Name",
                        email: userInfo.email || "N/A",
                        
                        role: item.role || userInfo.role || 'Member',
                        
                        avatar: userInfo.avatar_url || userInfo.avatar || '/images/avatar.jpg',
                        phone: userInfo.phone_number || userInfo.phone || 'N/A',
                        address: userInfo.address || 'N/A',
                        
                        // Các trường khác nếu có
                        gender: userInfo.gender || 'N/A',
                        birthday: userInfo.birthday ? new Date(userInfo.birthday).toLocaleDateString('vi-VN') : 'N/A'
                    };
                });

                setStaffList(mappedStaff);
                console.log("✅ Danh sách nhân viên sau khi Map:", mappedStaff);
            }

            // --- XỬ LÝ KẾT QUẢ GROUPS ---
            if (groupsRes.status === 'fulfilled') {
                const rawGroups = groupsRes.value.data.data || groupsRes.value.data || [];
                // Map dữ liệu cho khớp UI
                const mappedGroups = rawGroups.map(g => ({
                    id: g.group_id || g.id || g._id,
                    name: g.group_name || g.name,
                    description: g.description,
                    members: g.members || []
                }));
                setGroupList(mappedGroups);
                console.log(" Đã tải danh sách nhóm:", mappedGroups);
            } else {
                console.error(" Lỗi tải Groups:", groupsRes.reason);
            }

        } catch (error) {
            console.error("Lỗi chung khi tải dữ liệu Workspace:", error);
        }
    }, []);

    useEffect(() => {
        fetchWorkspaceData();
    }, [fetchWorkspaceData]);


    const handleDeleteStaff = (staffId) => { alert("Chức năng xóa nhân viên đang phát triển"); };


   const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("⚠️ Bạn có chắc chắn muốn xóa nhóm này không? Các thành viên trong nhóm sẽ bị gỡ bỏ khỏi nhóm.")) {
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            
            await axios.delete(`${API_BASE_ROOT}/api/groups/${groupId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            alert("Đã xóa nhóm thành công!");

            
            setGroupList(prevGroups => prevGroups.filter(g => (g.group_id || g.id) !== groupId));

        } catch (error) {
            console.error("Lỗi xóa nhóm:", error);
            const msg = error.response?.data?.message || "Lỗi Server.";
            alert(`Không thể xóa: ${msg}`);
        }
    };
    
    const handleAddMember = (groupId) => {
        setTargetGroupId(groupId);     
        setIsAddMemberModalOpen(true); 
    };

    // --- HÀM TẠO NHÓM MỚI (Đã sửa ở bước trước) ---
    const handleSaveNewGroup = async (groupNameInput) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');
            const currentWorkspaceId = localStorage.getItem('currentWorkspaceId');
            
            let realOwnerId = null;
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                realOwnerId = parsed.user_id || parsed.id || parsed._id;
            }

            if (!realOwnerId || !currentWorkspaceId) {
                alert("Lỗi: Thiếu thông tin User hoặc Workspace!");
                return;
            }
            
            // Gửi đủ các trường ID để "rải thảm" tránh lỗi Backend
            const groupBody = {
                group_name: groupNameInput,      
                description: "Mô tả nhóm mới",  
                owner_id: realOwnerId,
                user_id: realOwnerId,        
                workspace_id: currentWorkspaceId 
            };
            
            const response = await axios.post(
                `${API_GROUP_URL}/create`, 
                groupBody,
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            
            if (response.status === 200 || response.status === 201) {
                alert(" Tạo nhóm thành công!");
                // Gọi lại API để cập nhật danh sách thật
                fetchWorkspaceData(); 
                setIsGroupModalOpen(false); 
            }

        } catch (error) {
            console.error("Lỗi tạo nhóm:", error);
            const msg = error.response?.data?.message || "Lỗi Server.";
            alert(`Lỗi: ${msg}`); 
        }
    };
   
    return (
        <div className="dashboard-container">
            <Sidebar /> 

            <div className="main-content">
                <header className="page-header">
                    <h1>Staff Management</h1>
                </header>

                <div className="staff-page-wrapper">
                    
                    {/* STAFF HEADER */}
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

                        {activeTab === 'Nhân viên' && (
                            <button className="add-new-button" onClick={() => setIsStaffModalOpen(true)}>
                                + Thêm nhân viên
                            </button>
                        )}
                    </div>

                    <div className="staff-content-grid">
                        {/* CỘT TRÁI: DANH SÁCH */}
                        <div className="staff-list-column">
                            <div className="list-search-bar">
                                <input type="text" placeholder="Tìm kiếm..." />
                            </div>
                            
                            {activeTab === 'Nhân viên' ? (
                                <StaffList 
                                    staffList={staffList} 
                                    selectedStaffId={selectedStaff?.id}
                                    onSelectStaff={setSelectedStaff}
                                    onDeleteStaff={handleDeleteStaff}
                                />
                            ) : (
                                <>
                                    <GroupList
                                        groups={groupList}
                                        selectedStaffId={selectedStaff?.id}
                                        onSelectStaff={setSelectedStaff}
                                        onDeleteStaff={handleDeleteStaff}
                                        onDeleteGroup={handleDeleteGroup}
                                        onAddMember={handleAddMember}
                                    />
                                    <button 
                                        className="add-group-bottom-btn" 
                                        onClick={() => setIsGroupModalOpen(true)}
                                    >
                                        + Thêm nhóm
                                    </button>
                                </>
                            )}
                        </div>

                        {/* CỘT PHẢI: CHI TIẾT */}
                        <div className="staff-details-column">
                            {selectedStaff ? (
                                <StaffDetails staff={selectedStaff} />
                            ) : (
                                <div className="placeholder-tab">
                                    <p>Chọn một nhân viên để xem chi tiết.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {isStaffModalOpen && (
                <AddNewModal 
                    onClose={() => setIsStaffModalOpen(false)} 
                    onInviteSuccess={fetchWorkspaceData} // Reload lại list sau khi thêm
                />
            )}

            {isGroupModalOpen && (
                <AddGroupModal 
                    onClose={() => setIsGroupModalOpen(false)}
                    onSave={handleSaveNewGroup}
                />
            )}
            
            {isAddMemberModalOpen && (
                <AddGroupMemberModal 
                    onClose={() => setIsAddMemberModalOpen(false)}
                    groupId={targetGroupId} 
                    existingStaffList={staffList}
                />
            )}
        </div>
    );
};

export default StaffPage;