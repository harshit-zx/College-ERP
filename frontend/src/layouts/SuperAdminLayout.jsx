
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Building2,
  University,
  CreditCard,
  Users,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShieldCheck,
  PanelLeftClose,
} from "lucide-react";

const navigation = [
  {
    title: "MAIN MENU",
    items: [
      { name: "Dashboard", path: "/superadmin", icon: LayoutDashboard },
      { name: "Colleges", path: "/superadmin/colleges", icon: Building2 },
      { name: "Universities", path: "/superadmin/universities", icon: University },
      { name: "Subscriptions", path: "/superadmin/subscriptions", icon: CreditCard },
      { name: "Users Management", path: "/superadmin/users", icon: Users },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "System Analytics", path: "/superadmin/analytics", icon: ChartNoAxesCombined },
      { name: "Settings", path: "/superadmin/settings", icon: Settings },
    ],
  },
];

function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarContent = (
    <>
      <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <GraduationCap size={25} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900">
            College<span className="text-indigo-600">ERP</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[2px] text-slate-400">
            Platform Console
          </p>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-indigo-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ShieldCheck size={21} />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-950">Super Admin</p>
            <p className="mt-1 text-[10px] text-indigo-600">
              Platform Administrator
            </p>
          </div>
        </div>

        {navigation.map((group) => (
          <div key={group.title} className="mb-7">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.5px] text-slate-400">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/superadmin"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                      }`
                    }
                  >
                    <Icon size={19} />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-slate-100 p-4">
        <button
          onClick={() => navigate("/login")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative flex h-full w-[280px] flex-col bg-white shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-5 z-10 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="lg:pl-[260px]">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-slate-900">
                Platform Administration
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Manage your education ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative hidden md:block">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                placeholder="Search anything..."
                className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-indigo-400"
              />
            </div>

            <button
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  SA
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-slate-800">Super Admin</p>
                  <p className="text-[10px] text-slate-400">Administrator</p>
                </div>
                <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/superadmin/settings");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;