import { Routes, Route } from "react-router-dom";

// Import trang của Tuyến
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

// Import trang của Hiệp
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeForm from "./pages/employees/EmployeeForm";
import EmployeeDetail from "./pages/employees/EmployeeDetail";

// Import trang của Sêu
import Attendance from "./pages/attendance/Attendance";
import Leaves from "./pages/attendance/Leaves";

// Import trang của Vỹ
import PayrollList from "./pages/payroll/PayrollList";
import Payslip from "./pages/payroll/Payslip";

// Import trang của Tài
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";
import Reports from "./pages/admin/Reports";

function App() {
  return (
    <Routes>
      {/* Route của Tuyến */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />

      {/* Route của Hiệp */}
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employees/new" element={<EmployeeForm />} />
      <Route path="/employees/:id" element={<EmployeeDetail />} />

      {/* Route của Sêu */}
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/leaves" element={<Leaves />} />

      {/* Route của Vỹ */}
      <Route path="/payroll" element={<PayrollList />} />
      <Route path="/payroll/payslip/:id" element={<Payslip />} />

      {/* Route của Tài */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default App;
