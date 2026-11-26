
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Building2,
  BookOpenCheck,
} from "lucide-react";


const navigation = [
  { label: "Dashboard", path: "/college", icon: LayoutDashboard, end: true },
  { label: "Students", path: "/college/students", icon: Users },
  { label: "Faculty", path: "/college/faculty", icon: GraduationCap },
  { label: "Courses & Branches", path: "/college/courses", icon: BookOpen },
  { label: "Admissions", path: "/college/admissions", icon: ClipboardList },
  { label: "Attendance", path: "/college/attendance", icon: CalendarCheck },
  { label: "Fees & Payments", path: "/college/fees", icon: Wallet },
  { label: "Exam", path: "/college/collage-exams", icon: BookOpenCheck },
  { label: "Reports", path: "/college/reports", icon: BarChart3 },
  { label: "Settings", path: "/college/settings", icon: Settings },
];

function CollegeAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[225px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">CollegeERP</p>
              <p className="text-[10px] text-slate-400">College workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={17} />
          </button>
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700">
              <Building2 size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">
                Demo Engineering College
              </p>
              <p className="text-[10px] text-slate-500">College Admin</p>
            </div>
            <ChevronDown size={14} className="ml-auto shrink-0 text-slate-400" />
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="rounded-lg bg-indigo-50 p-3">
            <p className="text-xs font-semibold text-indigo-900">
              Need assistance?
            </p>
            <p className="mt-1 text-[10px] leading-4 text-indigo-700">
              Contact your platform support team for help.
            </p>
            <a
              href="mailto:support@example.com"
              className="mt-2 inline-block text-[11px] font-semibold text-indigo-700 hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[225px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={19} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                College Administration
              </p>
              <p className="hidden text-[10px] text-slate-400 sm:block">
                Manage your institution from one place
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-slate-200 px-3 md:flex">
              <Search size={15} className="text-slate-400" />
              <input
                type="search"
                placeholder="Search workspace..."
                className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  CA
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-slate-800">
                    College Admin
                  </p>
                  <p className="text-[10px] text-slate-400">Administrator</p>
                </div>
                <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/college/settings");
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    <Settings size={14} /> Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CollegeAdminLayout;