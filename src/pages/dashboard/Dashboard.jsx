import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; 


// Import Chart.js và các thành phần cần thiết
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, 
  PointElement, Title, Tooltip, Legend, ArcElement, Filler, RadialLinearScale 
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';

// Đăng ký các thành phần với Chart.js
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, 
  Title, Tooltip, Legend, ArcElement, Filler, RadialLinearScale
);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) return navigate("/login");
    fetchEmployees();
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/employees");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Lỗi kết nối API hoặc dữ liệu không hợp lệ");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Dữ liệu biểu đồ (Giả lập để demo) ---
  const salaryData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [{
      label: 'Quỹ lương (Triệu VNĐ)',
      data: [320, 350, 345, 410, 430, 480],
      backgroundColor: '#3b82f6',
      borderRadius: 10,
    }]
  };

  const hiringData = {
    labels: ['T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [{
      label: 'Nhân sự mới',
      data: [4, 7, 3, 11, 8, 15],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
    }]
  };

  const departmentData = {
    labels: ['Kỹ thuật', 'Kinh doanh', 'Marketing', 'Nhân sự'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      borderWidth: 0,
    }]
  };

  const skillData = {
    labels: ['React', 'NodeJS', 'DB', 'Cloud', 'Eng', 'Soft'],
    datasets: [{
      label: 'Front-end',
      data: [90, 70, 75, 60, 85, 90],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6',
    }, {
      label: 'Back-end',
      data: [65, 95, 90, 80, 70, 75],
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#10b981',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [5, 5] } } }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Đang phân tích dữ liệu IT24B...</p>
    </div>
  );

  return (
    <div className="stats-dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Thống kê</h1>
            <p>Phân tích hiệu suất nhân sự IT24B</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => window.print()}>Xuất file</button>
            <button className="btn-primary" onClick={() => navigate("/employees")}>+ Tuyển dụng</button>
          </div>
        </div>

        <div className="bento-grid">
          <div className="grid-card col-span-1 border-blue">
            <span className="card-label">Tổng nhân viên</span>
            <h2 className="kpi-value">{employees.length}</h2>
            <p className="kpi-trend positive">↑ 4% tháng này</p>
          </div>

          <div className="grid-card col-span-1 border-green">
            <span className="card-label">Tỷ lệ đi làm</span>
            <h2 className="kpi-value">98.2%</h2>
            <p className="kpi-trend positive">Ổn định</p>
          </div>

          <div className="grid-card col-span-2 row-span-2">
            <div className="card-header"><h3>Cơ cấu phòng ban</h3></div>
            <div className="chart-container-large">
              <Doughnut data={departmentData} options={{...chartOptions, plugins: {legend: {display: true, position: 'bottom'}}}} />
            </div>
          </div>

          <div className="grid-card col-span-2">
            <div className="card-header"><h3>Biến động lương (6 tháng)</h3></div>
            <div className="chart-container">
              <Bar data={salaryData} options={chartOptions} />
            </div>
          </div>

          <div className="grid-card col-span-3">
            <div className="card-header"><h3>Tốc độ tăng trưởng</h3></div>
            <div className="chart-container">
              <Line data={hiringData} options={chartOptions} />
            </div>
          </div>

          <div className="grid-card col-span-1">
            <div className="card-header"><h3>Kỹ năng Team</h3></div>
            <div className="chart-container">
              <Radar data={skillData} options={{...chartOptions, scales: { r: { angleLines: { display: false } } } }} />
            </div>
          </div>

          <div className="grid-card col-span-4 no-padding">
            <div className="table-header-box">
              <h3>Nhân sự mới gia nhập</h3>
              <span className="badge">Mới nhất</span>
            </div>
            <table className="pro-table">
              <thead>
                <tr>
                  <th>NHÂN VIÊN</th>
                  <th>PHÒNG BAN</th>
                  <th>NGÀY VÀO</th>
                  <th>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  [...employees].slice(-5).reverse().map((emp) => (
                    <tr key={emp.id || emp._id}>
                      <td className="emp-info-td">
                        <div className="avatar-sm">{emp.fullName ? emp.fullName.charAt(0).toUpperCase() : "?"}</div>
                        <strong>{emp.fullName || "Ẩn danh"}</strong>
                      </td>
                      <td>{emp.department || "Kỹ thuật"}</td>
                      <td>10/04/2026</td>
                      <td><span className="status-dot"></span> Đang thử việc</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Chưa có dữ liệu nhân viên</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
