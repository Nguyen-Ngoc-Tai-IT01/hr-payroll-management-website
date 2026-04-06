export const payrollData = [
  {
    id: "PR001",
    employeeId: "EMP01",
    name: "Nguyễn Văn A",
    department: "IT",
    month: "03/2026",
    baseSalary: 15000000,
    workingDays: 22, // Số ngày công chuẩn là 22
    actualDays: 22,  // Đi làm đủ
    allowance: 1000000, // Phụ cấp
    tax: 500000,
    insurance: 1500000,
  },
  {
    id: "PR002",
    employeeId: "EMP02",
    name: "Trần Thị B",
    department: "HR",
    month: "03/2026",
    baseSalary: 10000000,
    workingDays: 22,
    actualDays: 20, // Nghỉ 2 ngày
    allowance: 500000,
    tax: 100000,
    insurance: 1000000,
  }
];

// Hàm phụ trợ tính lương thực lãnh (Net Salary)
export const calculateNetSalary = (record) => {
  const dailyRate = record.baseSalary / record.workingDays;
  const actualSalary = dailyRate * record.actualDays;
  const totalEarnings = actualSalary + record.allowance;
  const totalDeductions = record.tax + record.insurance;
  return totalEarnings - totalDeductions;
};