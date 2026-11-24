
import { Routes, Route, Navigate } from "react-router-dom";

import App from "../App";

import Login from "../pages/auth/Login";
import RegisterCollege from "../pages/auth/RegisterCollege";
import ForgotPassword from "../pages/auth/ForgotPassword";

import SuperAdminLayout from "../layouts/SuperAdminLayout";
import Dashboard from "../pages/superadmin/Dashboard";
import Colleges from "../pages/superadmin/Colleges";
import Universities from "../pages/superadmin/Universities";
import Subscriptions from "../pages/superadmin/Subscriptions";
import UsersPage from "../pages/superadmin/Users";
import Analytics from "../pages/superadmin/Analytics";
import Settings from "../pages/superadmin/Settings";

// collage
import CollegeAdminLayout from "../layouts/CollegeAdminLayout";
import CollegeDashboard from "../pages/college/Dashboard";
import Students from "../pages/college/Students";
import Faculty from "../pages/college/Faculty";  
import Courses from "../pages/college/Courses";
import Admissions from "../pages/college/Admissions";
import CollageAttendance from "../pages/college/Attendance";
import Fees from "../pages/college/Fees";
import CollageExams from "../pages/college/Exams";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website */}
      <Route path="/" element={<App />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterCollege />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Super Admin */}
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="colleges" element={<Colleges />} />
        <Route path="universities" element={<Universities />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/college" element={<CollegeAdminLayout />}>
        <Route index element={<CollegeDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="courses" element={<Courses />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="attendance" element={<CollageAttendance/>} />
        <Route path="fees" element={<Fees/>} />
        <Route path="exams" element={<CollageExams />} />
        <Route path="reports" element={<CollegeModulePlaceholder title="College Reports" />} />
        <Route path="settings" element={<CollegeModulePlaceholder title="College Settings" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ComingSoon({ name }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
      <p className="mt-3 text-sm text-slate-500">
        This module will be developed in an upcoming milestone.
      </p>
    </div>
  );
}

function CollegeModulePlaceholder({ title }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-xs text-slate-500">
        This module will be implemented in the next development milestone.
      </p>
    </div>
  );
}

export default AppRoutes;
