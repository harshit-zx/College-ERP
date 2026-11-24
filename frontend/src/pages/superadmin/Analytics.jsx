import { useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
  Users,
  IndianRupee,
  TrendingUp,
  Activity,
  Download,
  CalendarDays,
  CreditCard,
  BookOpen,
  ClipboardCheck,
  Video,
} from "lucide-react";

const analyticsData = {
  "6M": {
    labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
    colleges: [42, 48, 55, 61, 69, 78],
    universities: [2, 3, 3, 4, 4, 5],
    students: [8200, 9100, 10500, 11900, 13200, 14800],
    faculty: [420, 460, 510, 560, 620, 690],
    revenue: [285000, 312000, 348000, 390000, 432000, 485000],
    activity: [64, 70, 75, 72, 84, 91],
  },
  "12M": {
    labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
    colleges: [18, 22, 27, 31, 35, 39, 42, 48, 55, 61, 69, 78],
    universities: [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5],
    students: [2500, 3100, 3800, 4500, 5200, 6100, 8200, 9100, 10500, 11900, 13200, 14800],
    faculty: [140, 180, 220, 260, 310, 360, 420, 460, 510, 560, 620, 690],
    revenue: [85000, 110000, 145000, 180000, 210000, 250000, 285000, 312000, 348000, 390000, 432000, 485000],
    activity: [30, 36, 42, 48, 53, 59, 64, 70, 75, 72, 84, 91],
  },
};

const usageModules = [
  { name: "Student Management", value: 92, icon: Users },
  { name: "Attendance", value: 84, icon: ClipboardCheck },
  { name: "Course Management", value: 76, icon: BookOpen },
  { name: "Online Classes", value: 61, icon: Video },
];

const paymentBreakdown = [
  { label: "Paid", value: 78, color: "#059669" },
  { label: "Pending", value: 15, color: "#D97706" },
  { label: "Failed", value: 7, color: "#E11D48" },
];

const money = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function StatCard({ label, value, change, icon: Icon, color }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
      <div className="mt-1 flex items-center gap-1 text-[10px]">
        <TrendingUp size={11} className="text-emerald-600" />
        <span className="font-semibold text-emerald-600">{change}</span>
        <span className="text-slate-400">vs previous period</span>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white ${className}`}>
      <div className="border-b border-slate-100 px-3 py-2.5">
        <h2 className="text-xs font-semibold text-slate-800">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-[10px] text-slate-400">{subtitle}</p>
        )}
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

function BarChart({ labels, series, formatter = (v) => v }) {
  const maxValue = Math.max(...series.flatMap((item) => item.values), 1);

  return (
    <div className="w-full">
      <div className="flex h-44 items-end gap-2 border-b border-slate-100 pb-2">
        {labels.map((label, index) => (
          <div key={label} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <div className="flex h-full items-end justify-center gap-1">
              {series.map((item) => (
                <div
                  key={item.name}
                  title={`${item.name}: ${formatter(item.values[index])}`}
                  className="min-w-1 flex-1 max-w-5 rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max((item.values[index] / maxValue) * 100, 2)}%`,
                    backgroundColor: item.color,
                  }}
                />
              ))}
            </div>
            <span className="mt-2 truncate text-center text-[9px] text-slate-400">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        {series.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-slate-500">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ labels, values }) {
  const width = 600;
  const height = 180;
  const padding = 14;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y, value };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${padding},${height - padding} ${linePoints} ${width - padding},${height - padding}`;

  return (
    <div>
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-44 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Monthly platform activity trend"
        >
          {[0, 1, 2, 3].map((line) => {
            const y = padding + (line / 3) * (height - padding * 2);
            return (
              <line
                key={line}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />
            );
          })}

          <polygon points={areaPoints} fill="#DBEAFE" opacity="0.7" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#2563EB"
              stroke="white"
              strokeWidth="2"
            >
              <title>{`${labels[index]}: ${point.value}%`}</title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="mt-1 flex justify-between gap-1">
        {labels.map((label) => (
          <span key={label} className="text-[9px] text-slate-400">{label}</span>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const [period, setPeriod] = useState("6M");
  const [metric, setMetric] = useState("colleges");

  const data = analyticsData[period];

  const stats = [
    {
      label: "Total Colleges",
      value: "784",
      change: "+12.8%",
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Universities",
      value: "24",
      change: "+8.4%",
      icon: GraduationCap,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total Students",
      value: "1,24,580",
      change: "+16.2%",
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Faculty",
      value: "8,450",
      change: "+10.5%",
      icon: Users,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Monthly Revenue",
      value: "₹4,85,000",
      change: "+14.6%",
      icon: IndianRupee,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "Active Users",
      value: "18,240",
      change: "+19.3%",
      icon: Activity,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const growthSeries = useMemo(() => {
    if (metric === "colleges") {
      return [
        { name: "Colleges", values: data.colleges, color: "#2563EB" },
        { name: "Universities", values: data.universities, color: "#8B5CF6" },
      ];
    }

    return [
      { name: "Students", values: data.students, color: "#059669" },
      { name: "Faculty", values: data.faculty, color: "#D97706" },
    ];
  }, [data, metric]);

  const exportCSV = () => {
    const headers = [
      "Month",
      "Colleges Registered",
      "Universities Registered",
      "Students",
      "Faculty",
      "Revenue INR",
      "Platform Activity Percent",
    ];

    const rows = data.labels.map((label, index) => [
      label,
      data.colleges[index],
      data.universities[index],
      data.students[index],
      data.faculty[index],
      data.revenue[index],
      data.activity[index],
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `system-analytics-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const latestRevenue = data.revenue[data.revenue.length - 1];
  const previousRevenue = data.revenue[data.revenue.length - 2] || latestRevenue;
  const revenueChange = previousRevenue
    ? (((latestRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">System Analytics</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Monitor platform growth, revenue and institutional usage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-2.5">
            <CalendarDays size={13} className="text-slate-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent text-xs text-slate-600 outline-none"
            >
              <option value="6M">Last 6 months</option>
              <option value="12M">Last 12 months</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Growth and revenue */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          title="Platform Growth"
          subtitle="Institution and user growth by month"
          className="xl:col-span-2"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => setMetric("colleges")}
                className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium ${
                  metric === "colleges"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Institutions
              </button>
              <button
                onClick={() => setMetric("students")}
                className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium ${
                  metric === "students"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Students & Faculty
              </button>
            </div>
          </div>

          <BarChart
            labels={data.labels}
            series={growthSeries}
            formatter={(value) => Number(value).toLocaleString("en-IN")}
          />
        </Panel>

        <Panel
          title="Subscription Revenue"
          subtitle="Monthly recorded revenue"
        >
          <div>
            <p className="text-[10px] text-slate-400">Latest period revenue</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {money(latestRevenue)}
            </p>
            <p className="mt-1 text-[10px] text-emerald-600">
              +{revenueChange}% vs previous month
            </p>
          </div>

          <div className="mt-5 flex h-28 items-end gap-2 border-b border-slate-100 pb-1">
            {data.revenue.map((value, index) => {
              const max = Math.max(...data.revenue);
              return (
                <div key={index} className="flex h-full min-w-0 flex-1 items-end">
                  <div
                    title={money(value)}
                    className="w-full rounded-t-sm bg-blue-500 hover:bg-blue-600"
                    style={{ height: `${(value / max) * 100}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-[9px] text-slate-400">{data.labels[0]}</span>
            <span className="text-[9px] text-slate-400">{data.labels[data.labels.length - 1]}</span>
          </div>

          <div className="mt-4 rounded-md bg-slate-50 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Revenue growth</span>
              <span className="text-xs font-semibold text-emerald-600">+{revenueChange}%</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Usage and payment analytics */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel
          title="Platform Usage"
          subtitle="Module activity index (illustrative percentage)"
        >
          <div className="space-y-4">
            {usageModules.map(({ name, value, icon: Icon }) => (
              <div key={name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-700">{name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">{value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Payment Status"
          subtitle="Breakdown of recorded subscription payments"
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div
              className="relative h-36 w-36 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(
                  ${paymentBreakdown[0].color} 0% 78%,
                  ${paymentBreakdown[1].color} 78% 93%,
                  ${paymentBreakdown[2].color} 93% 100%
                )`,
              }}
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-xl font-bold text-slate-900">100%</span>
                <span className="text-[10px] text-slate-400">Payments</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              {paymentBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Activity trend */}
      <Panel
        title="Platform Activity Trend"
        subtitle="Monthly active usage index"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400">Latest activity index</p>
            <p className="text-xl font-bold text-slate-900">
              {data.activity[data.activity.length - 1]}%
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600">
            <TrendingUp size={12} />
            Increasing trend
          </div>
        </div>

        <LineChart labels={data.labels} values={data.activity} />
      </Panel>

      {/* Reporting note */}
      <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2.5">
        <p className="text-[10px] leading-relaxed text-blue-800">
          <strong>Demo analytics:</strong> All KPIs, charts, revenue and usage
          percentages on this page are illustrative sample figures. Live reports
          will be calculated from PostgreSQL records and Go backend APIs.
        </p>
      </div>
    </div>
  );
}

export default Analytics;