
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Wallet,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  ClipboardCheck,
  FileText,
  MoreHorizontal,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "2,450",
    change: "+8.2%",
    trend: "up",
    note: "Compared to last session",
    icon: Users,
    color: "blue",
  },
  {
    title: "Faculty Members",
    value: "124",
    change: "+4.5%",
    trend: "up",
    note: "Across all departments",
    icon: GraduationCap,
    color: "violet",
  },
  {
    title: "Active Courses",
    value: "18",
    change: "+2",
    trend: "up",
    note: "Currently running",
    icon: BookOpen,
    color: "emerald",
  },
  {
    title: "Today's Attendance",
    value: "92.4%",
    change: "-1.2%",
    trend: "down",
    note: "Compared to yesterday",
    icon: CalendarCheck,
    color: "amber",
  },
];

const admissions = [
  { name: "Aarav Sharma", course: "B.Tech CSE", date: "24 Nov 2026", status: "Approved" },
  { name: "Priya Singh", course: "B.Tech ECE", date: "23 Nov 2026", status: "Pending" },
  { name: "Rahul Verma", course: "BBA", date: "23 Nov 2026", status: "Under Review" },
  { name: "Ananya Gupta", course: "B.Tech IT", date: "22 Nov 2026", status: "Approved" },
];

const activities = [
  { title: "New student admission submitted", detail: "Priya Singh · B.Tech ECE", time: "10 minutes ago", icon: UserPlus },
  { title: "Attendance marked", detail: "Computer Science · Semester 5", time: "35 minutes ago", icon: ClipboardCheck },
  { title: "Fee payment received", detail: "Transaction #FEE-2048", time: "1 hour ago", icon: Wallet },
  { title: "Faculty record updated", detail: "Department of Mathematics", time: "2 hours ago", icon: GraduationCap },
];

const tasks = [
  { title: "Review pending admissions", count: "12 applications", color: "amber" },
  { title: "Verify student documents", count: "8 documents", color: "blue" },
  { title: "Approve faculty leave requests", count: "4 requests", color: "violet" },
];

const attendance = [
  { day: "Mon", value: 88 },
  { day: "Tue", value: 94 },
  { day: "Wed", value: 91 },
  { day: "Thu", value: 86 },
  { day: "Fri", value: 96 },
  { day: "Sat", value: 78 },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    "Under Review": "bg-blue-50 text-blue-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-xs text-slate-500">
            Welcome back! Here's what's happening at your college.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
            Academic Session: <strong className="text-slate-800">2026–27</strong>
          </span>
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-indigo-700"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Demo data notice */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] text-blue-800">
        You're viewing sample college data. Live tenant data will be connected to the backend in a later milestone.
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          const TrendIcon = item.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{item.title}</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {item.value}
                  </h2>
                </div>
                <div className={`rounded-lg p-2.5 ${colorClasses[item.color]}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className={`flex items-center text-[11px] font-semibold ${item.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                  <TrendIcon size={13} /> {item.change}
                </span>
                <span className="text-[10px] text-slate-400">{item.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fee overview */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Fees Collected</p>
            <Wallet size={17} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">₹38.6L</p>
          <p className="mt-1 text-[10px] text-slate-400">Current academic session</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending Fees</p>
            <Clock3 size={17} className="text-amber-600" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">₹8.4L</p>
          <p className="mt-1 text-[10px] text-slate-400">Outstanding student balances</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">New Admissions</p>
            <UserPlus size={17} className="text-blue-600" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">186</p>
          <p className="mt-1 text-[10px] text-slate-400">Applications this session</p>
        </div>
      </div>

      {/* Charts and tasks */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Weekly Attendance</h3>
              <p className="mt-1 text-[11px] text-slate-400">Average student attendance</p>
            </div>
            <button type="button" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="mt-5 flex h-44 items-end justify-around gap-3 border-b border-slate-100 px-2">
            {attendance.map((item) => (
              <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-medium text-slate-500">{item.value}%</span>
                <div className="flex h-[125px] w-full max-w-12 items-end overflow-hidden rounded-t-md bg-slate-100">
                  <div
                    className="w-full rounded-t-md bg-indigo-500 transition-all"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="pb-2 text-[10px] text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-slate-400">
            Illustrative attendance figures for the current week.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pending Tasks</h3>
              <p className="mt-1 text-[11px] text-slate-400">Items requiring attention</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
              24 pending
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
                <span className={`mt-0.5 h-2 w-2 rounded-full ${task.color === "amber" ? "bg-amber-500" : task.color === "blue" ? "bg-blue-500" : "bg-violet-500"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-700">{task.title}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{task.count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Admissions and activity */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Admissions</h3>
              <p className="mt-1 text-[11px] text-slate-400">Latest student applications</p>
            </div>
            <button type="button" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map((student) => (
                  <tr key={student.name} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{student.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{student.course}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{student.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
              <p className="mt-1 text-[11px] text-slate-400">Latest workspace updates</p>
            </div>
            <button type="button" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div key={activity.title} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-medium text-slate-700">{activity.title}</p>
                    <p className="mt-1 truncate text-[10px] text-slate-400">{activity.detail}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[11px] text-slate-500">
        <FileText size={15} className="shrink-0 text-slate-400" />
        Dashboard figures are sample values and are not connected to student records, payments or attendance yet.
      </div>
    </div>
  );
}

export default Dashboard;