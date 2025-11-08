// src/components/TaskProgressChart.jsx

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskProgressChart = () => {
    // **ĐIỂM KẾT NỐI API QUAN TRỌNG:**
    // Dữ liệu biểu đồ (chartData) cần được lấy từ API.
    // Chúng ta sẽ dùng dữ liệu giả định (mock data) trước khi có API.
    const [chartData, setChartData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [],
    });

    // Hàm gọi API (Giả định)
    const fetchChartData = () => {
        // **GỌI API:** (Ví dụ: GET /api/dashboard/task-progress)
        // axios.get(`${API_BASE_URL}/dashboard/task-progress`, { headers: { ... } })
        //     .then(response => {
        //         const apiData = response.data; // { personal: [5, ...], group: [3, ...] }
        //         updateChartData(apiData);
        //     })
        //     .catch(error => console.error("Lỗi khi lấy dữ liệu biểu đồ:", error));
        
        // **DỮ LIỆU GIẢ ĐỊNH (Mock Data):**
        const mockApiData = {
            personal: [5, 4, 7, 18, 6, 8, 15, 19, 10, 4, 16, 4],
            group: [3, 15, 11, 9, 8, 13, 14, 10, 14, 11, 11, 6],
        };
        updateChartData(mockApiData);
    };

    // Hàm cập nhật state của biểu đồ
    const updateChartData = (apiData) => {
        setChartData({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Personal',
                    data: apiData.personal,
                    backgroundColor: '#F29900', // Màu cam (Personal)
                    borderRadius: 4,
                },
                {
                    label: 'Group',
                    data: apiData.group,
                    backgroundColor: '#1976D2', // Màu xanh dương (Group)
                    borderRadius: 4,
                },
            ],
        });
    };
    
    // Gọi API khi component được tải
    useEffect(() => {
        fetchChartData();
    }, []);

    // Tùy chọn (Options) cho biểu đồ
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Để biểu đồ co dãn theo container
        plugins: {
            legend: {
                position: 'top', // Hiển thị chú thích (Personal/Group) ở trên
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                }
            },
            title: {
                display: false, // Ẩn tiêu đề mặc định của ChartJS
            },
        },
        scales: {
            y: { // Trục Y (Số lượng task)
                beginAtZero: true,
                max: 20, // Giới hạn trục Y là 20
                ticks: {
                    stepSize: 5, // Bước nhảy là 5 (0, 5, 10, 15, 20)
                },
                grid: {
                    drawBorder: false, // Ẩn đường viền trục Y
                }
            },
            x: { // Trục X (Tháng)
                grid: {
                    display: false, // Ẩn các đường kẻ dọc
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default TaskProgressChart;