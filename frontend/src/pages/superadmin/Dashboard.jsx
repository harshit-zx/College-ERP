
    import {
    Building2,
    Users,
    GraduationCap,
    IndianRupee,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowRight,
    MoreHorizontal,
    Clock3,
    CheckCircle2,
    AlertCircle,
    CalendarDays,
    Activity,
    Plus,
    } from "lucide-react";

    const stats = [
    {
        title: "Total Institutions",
        value: "784",
        change: "+12.5%",
        description: "Compared to last month",
        icon: Building2,
        color: "bg-blue-50 text-blue-600",
        positive: true,
    },
    {
        title: "Active Colleges",
        value: "652",
        change: "+8.2%",
        description: "Currently active",
        icon: CheckCircle2,
        color: "bg-emerald-50 text-emerald-600",
        positive: true,
    },
    {
        title: "Total Students",
        value: "1,24,580",
        change: "+14.8%",
        description: "Across all institutions",
        icon: GraduationCap,
        color: "bg-violet-50 text-violet-600",
        positive: true,
    },
    {
        title: "Faculty Members",
        value: "8,450",
        change: "+5.4%",
        description: "Registered faculty",
        icon: Users,
        color: "bg-orange-50 text-orange-600",
        positive: true,
    },
    ];

    const recentColleges = [
    {
        name: "Institute of Technology and Management",
        code: "ITM001",
        location: "Gorakhpur, UP",
        date: "24 Nov 2026",
        status: "Active",
        initials: "IT",
        color: "bg-blue-100 text-blue-700",
    },
    {
        name: "ABC Institute of Engineering",
        code: "ABC002",
        location: "Lucknow, UP",
        date: "23 Nov 2026",
        status: "Pending",
        initials: "AB",
        color: "bg-violet-100 text-violet-700",
    },
    {
        name: "National College of Technology",
        code: "NCT003",
        location: "Noida, UP",
        date: "22 Nov 2026",
        status: "Active",
        initials: "NC",
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        name: "Modern Institute of Management",
        code: "MIM004",
        location: "Kanpur, UP",
        date: "21 Nov 2026",
        status: "Inactive",
        initials: "MI",
        color: "bg-orange-100 text-orange-700",
    },
    ];

    const activities = [
    {
        title: "New college registered",
        description: "ABC Institute of Engineering submitted registration.",
        time: "10 minutes ago",
        icon: Building2,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Subscription renewed",
        description: "Professional plan renewed successfully.",
        time: "45 minutes ago",
        icon: CheckCircle2,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "New users added",
        description: "125 student accounts were added.",
        time: "2 hours ago",
        icon: Users,
        color: "bg-violet-50 text-violet-600",
    },
    {
        title: "Payment pending",
        description: "An institution has an outstanding subscription invoice.",
        time: "4 hours ago",
        icon: AlertCircle,
        color: "bg-orange-50 text-orange-600",
    },
    ];

    const monthlyData = [
    { month: "Jun", colleges: 35, subscriptions: 45 },
    { month: "Jul", colleges: 48, subscriptions: 55 },
    { month: "Aug", colleges: 42, subscriptions: 62 },
    { month: "Sep", colleges: 65, subscriptions: 70 },
    { month: "Oct", colleges: 58, subscriptions: 80 },
    { month: "Nov", colleges: 82, subscriptions: 92 },
    ];

    const subscriptionPlans = [
    { name: "Starter", count: 245, percent: 38, color: "bg-blue-500" },
    { name: "Professional", count: 310, percent: 48, color: "bg-indigo-600" },
    { name: "Enterprise", count: 97, percent: 14, color: "bg-violet-500" },
    ];

    function Dashboard() {
    return (
        <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Page Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                Platform <span>/</span>
                <span className="text-indigo-600">Dashboard</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
                Welcome back! Here's what's happening across your platform.
            </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <CalendarDays size={17} />
                Last 30 Days
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700">
                <Plus size={18} />
                Add Institution
            </button>
            </div>
        </div>

        {/* Demo Notice */}
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertCircle size={18} className="shrink-0 text-amber-600" />
            <p className="text-xs leading-5 text-amber-800">
            Demo dashboard: all statistics and activity records are sample data,
            not connected to the database.
            </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
            <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-lg hover:shadow-slate-100"
            >
                <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon size={23} />
                </div>

                <button
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
                    aria-label={`More options for ${stat.title}`}
                >
                    <MoreHorizontal size={20} />
                </button>
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                {stat.title}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                    {stat.value}
                </h2>

                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                    <TrendingUp size={12} />
                    {stat.change}
                </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                {stat.description}
                </p>
            </div>
            ))}
        </div>

        {/* Revenue and College Statistics */}
        <div className="grid gap-6 xl:grid-cols-3">

            {/* Revenue Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                <h3 className="text-base font-bold text-slate-900">
                    Platform Revenue
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                    Subscription revenue overview
                </p>
                </div>

                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                Monthly <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                <p className="text-xs font-medium text-slate-400">
                    Monthly Recurring Revenue
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
                    ₹4,85,000
                </h2>
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp size={14} />
                    12.8% growth from previous month
                </p>
                </div>

                <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    Colleges
                </span>
                <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-300" />
                    Revenue
                </span>
                </div>
            </div>

            {/* CSS Bar Chart */}
            <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-slate-100 pb-2">
                {monthlyData.map((item) => (
                <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                    <div className="flex h-[190px] w-full items-end justify-center gap-1.5">
                    <div
                        className="w-3/12 max-w-7 rounded-t-md bg-indigo-600 transition-all hover:opacity-75"
                        style={{ height: `${item.colleges}%` }}
                        title={`Colleges: ${item.colleges}`}
                    />
                    <div
                        className="w-3/12 max-w-7 rounded-t-md bg-blue-300 transition-all hover:opacity-75"
                        style={{ height: `${item.subscriptions}%` }}
                        title={`Revenue index: ${item.subscriptions}`}
                    />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                    {item.month}
                    </span>
                </div>
                ))}
            </div>

            <p className="mt-4 text-[10px] text-slate-400">
                Illustrative chart values. Not actual financial reporting.
            </p>
            </div>

            {/* Institution Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900">
                Institution Status
            </h3>
            <p className="mt-1 text-xs text-slate-400">
                Registration overview
            </p>

            <div className="mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                background:
                    "conic-gradient(#4f46e5 0% 83.16%, #f59e0b 83.16% 91.07%, #e2e8f0 91.07% 100%)",
                }}
            >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-extrabold text-slate-900">784</span>
                <span className="text-xs text-slate-400">Total Colleges</span>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {[
                { label: "Active", value: "652", color: "bg-indigo-600" },
                { label: "Pending", value: "62", color: "bg-amber-500" },
                { label: "Inactive", value: "70", color: "bg-slate-300" },
                ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Subscription Plans and Recent Activity */}
        <div className="grid gap-6 xl:grid-cols-3">

            {/* Subscriptions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <div>
                <h3 className="font-bold text-slate-900">
                    Subscription Plans
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                    Distribution by plan
                </p>
                </div>
                <IndianRupee size={21} className="text-indigo-500" />
            </div>

            <div className="mt-8 space-y-7">
                {subscriptionPlans.map((plan) => (
                <div key={plan.name}>
                    <div className="mb-2 flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{plan.name}</span>
                    <span className="font-bold text-slate-900">{plan.count}</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full ${plan.color}`}
                        style={{ width: `${plan.percent}%` }}
                    />
                    </div>

                    <p className="mt-2 text-right text-[10px] text-slate-400">
                    {plan.percent}% of subscriptions
                    </p>
                </div>
                ))}
            </div>

            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600">
                View Subscriptions <ArrowRight size={15} />
            </button>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
            <div className="flex items-center justify-between">
                <div>
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                <p className="mt-1 text-xs text-slate-400">
                    Latest platform events
                </p>
                </div>

                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                View all
                </button>
            </div>

            <div className="mt-6 space-y-5">
                {activities.map((activity) => (
                <div key={activity.title} className="flex gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}>
                    <activity.icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800">
                        {activity.title}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {activity.description}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock3 size={12} />
                        {activity.time}
                    </p>
                    </div>

                    <button
                    className="self-start rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
                    aria-label={`More options for ${activity.title}`}
                    >
                    <MoreHorizontal size={18} />
                    </button>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Recent Colleges */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
            <div>
                <h3 className="font-bold text-slate-900">
                Recently Registered Colleges
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                Latest institution registrations
                </p>
            </div>

            <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                View all colleges <ArrowUpRight size={16} />
            </button>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
                <thead className="bg-slate-50">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Institution</th>
                    <th className="px-6 py-4">College Code</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Registered On</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                {recentColleges.map((college) => (
                    <tr key={college.code} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${college.color}`}>
                            {college.initials}
                        </div>
                        <span className="max-w-[220px] text-xs font-bold text-slate-800">
                            {college.name}
                        </span>
                        </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {college.code}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                        {college.location}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                        {college.date}
                    </td>

                    <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
                        college.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : college.status === "Pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                        {college.status}
                        </span>
                    </td>

                    <td className="px-6 py-4">
                        <button className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" aria-label={`View ${college.name}`}>
                        <ArrowUpRight size={17} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-between gap-2 pb-2 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} College ERP SaaS. All rights reserved.</p>
            <p className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            Platform dashboard · Demo mode
            </p>
        </div>
        </div>
    );
    }

    export default Dashboard;