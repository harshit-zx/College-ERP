import { useMemo, useState } from "react";
import {
  BarChart3,
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  BookOpenCheck,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  FileSpreadsheet,
  IndianRupee,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEYS = {
  students: "college_erp_students_v1",
  admissions: "college_erp_admissions_v1",
  attendance: "college_erp_attendance_v1",
  feeStructures: "college_erp_fee_structures_v1",
  feeInvoices: "college_erp_fee_invoices_v1",
  feePayments: "college_erp_fee_payments_v1",
  exams: "college_erp_exams_v1",
  registrations: "college_erp_exam_registrations_v1",
  marks: "college_erp_exam_marks_v1",
};

const DEMO_STUDENTS = [
  { id: 1, name: "Aarav Sharma", course: "B.Tech", status: "Active" },
  { id: 2, name: "Priya Singh", course: "B.Tech", status: "Active" },
  { id: 3, name: "Rahul Verma", course: "BBA", status: "Active" },
  { id: 4, name: "Ananya Gupta", course: "B.Tech", status: "Active" },
  { id: 5, name: "Rohan Kumar", course: "MBA", status: "Inactive" },
  { id: 6, name: "Sneha Yadav", course: "B.Tech", status: "Graduated" },
  { id: 7, name: "Aditya Mishra", course: "BCA", status: "Active" },
  { id: 8, name: "Neha Patel", course: "B.Tech", status: "Suspended" },
  { id: 9, name: "Karan Singh", course: "B.Tech", status: "Active" },
  { id: 10, name: "Ishita Rai", course: "MBA", status: "Inactive" },
];

const DEMO_ATTENDANCE = [
  { month: "Jan", value: 82 },
  { month: "Feb", value: 88 },
  { month: "Mar", value: 85 },
  { month: "Apr", value: 91 },
  { month: "May", value: 87 },
  { month: "Jun", value: 93 },
];

function readStorage(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;

    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed)) return parsed;

    if (parsed && typeof parsed === "object") {
      for (const field of ["data", "items", "records", "students", "results"]) {
        if (Array.isArray(parsed[field])) return parsed[field];
      }
    }

    return fallback;
  } catch {
    return fallback;
  }
}

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getStatus(item) {
  return String(item?.status || item?.paymentStatus || "").toLowerCase();
}

function getAmount(item) {
  return getNumber(
    item?.amount ??
    item?.paidAmount ??
    item?.totalAmount ??
    item?.feeAmount ??
    item?.amountPaid ??
    item?.total ??
    0
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function downloadCSV(filename, rows) {
  if (!rows.length) {
    alert("No data available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const escapeCSV = (value) => {
    const text = String(value ?? "").replace(/"/g, '""');
    return `"${text}"`;
  };

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCSV(row[header])).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
        </div>

        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ProgressRow({ label, value, total, color = "bg-indigo-500" }) {
  const percentage = total > 0
    ? Math.min(100, Math.max(0, (value / total) * 100))
    : 0;

  return (
    <div className="mb-4">
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">
          {value} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-52 items-end justify-between gap-3 border-b border-slate-100 px-2 pb-1">
      {data.map((item) => (
        <div
          key={item.label}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
        >
          <span className="text-[10px] font-semibold text-slate-500">
            {item.value}
          </span>
          <div className="flex h-[75%] w-full items-end justify-center">
            <div
              className="w-full max-w-10 rounded-t-md bg-indigo-500 transition-all hover:bg-indigo-600"
              style={{
                height: `${Math.max(4, (item.value / max) * 100)}%`,
              }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <span className="text-[10px] text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [period, setPeriod] = useState("all");
  const [reportType, setReportType] = useState("students");

  const reportData = useMemo(() => {
    const students = readStorage(STORAGE_KEYS.students, DEMO_STUDENTS);
    const admissions = readStorage(STORAGE_KEYS.admissions);
    const attendance = readStorage(STORAGE_KEYS.attendance);
    const invoices = readStorage(STORAGE_KEYS.feeInvoices);
    const payments = readStorage(STORAGE_KEYS.feePayments);
    const exams = readStorage(STORAGE_KEYS.exams);
    const registrations = readStorage(STORAGE_KEYS.registrations);
    const marks = readStorage(STORAGE_KEYS.marks);

    const activeStudents = students.filter((student) =>
      ["active", "enrolled"].includes(getStatus(student))
    );

    const paidPayments = payments.filter((payment) => {
      const status = getStatus(payment);
      return (
        !status ||
        ["paid", "success", "completed", "approved"].includes(status)
      );
    });

    const totalFees = invoices.reduce((sum, item) => {
      return sum + getNumber(
        item?.totalAmount ?? item?.amount ?? item?.feeAmount ?? 0
      );
    }, 0);

    const totalCollected = paidPayments.reduce(
      (sum, item) => sum + getAmount(item),
      0
    );

    const totalDue = Math.max(0, totalFees - totalCollected);

    const courseCounts = {};
    students.forEach((student) => {
      const course =
        student?.course ||
        student?.courseName ||
        student?.program ||
        "Other";

      courseCounts[course] = (courseCounts[course] || 0) + 1;
    });

    const statusCounts = {
      Active: students.filter((s) => getStatus(s) === "active").length,
      Inactive: students.filter((s) => getStatus(s) === "inactive").length,
      Graduated: students.filter((s) => getStatus(s) === "graduated").length,
      Other: students.filter(
        (s) =>
          !["active", "inactive", "graduated"].includes(getStatus(s))
      ).length,
    };

    const attendanceValues = attendance.map((item) =>
      getNumber(
        item?.percentage ??
        item?.attendancePercentage ??
        item?.attendance ??
        item?.presentPercentage ??
        0
      )
    ).filter((value) => value > 0 && value <= 100);

    const averageAttendance = attendanceValues.length
      ? Math.round(
          attendanceValues.reduce((sum, value) => sum + value, 0) /
          attendanceValues.length
        )
      : 0;

    const examResults = marks.map((item) => ({
      student: item?.studentName || item?.name || "Student",
      subject: item?.subjectName || item?.subject || "Subject",
      marks: getNumber(item?.marks ?? item?.obtainedMarks ?? item?.score),
      maxMarks: getNumber(item?.maxMarks ?? item?.totalMarks ?? 100),
      status: item?.status || "",
    }));

    const passed = examResults.filter((item) =>
      item.status.toLowerCase() === "pass"
    ).length;

    const failed = examResults.filter((item) =>
      item.status.toLowerCase() === "fail"
    ).length;

    return {
      students,
      activeStudents,
      admissions,
      attendance,
      invoices,
      payments,
      paidPayments,
      exams,
      registrations,
      marks,
      totalFees,
      totalCollected,
      totalDue,
      courseCounts,
      statusCounts,
      averageAttendance,
      examResults,
      passed,
      failed,
    };
  }, [refreshKey]);

  const {
    students,
    activeStudents,
    admissions,
    attendance,
    invoices,
    payments,
    paidPayments,
    exams,
    registrations,
    marks,
    totalFees,
    totalCollected,
    totalDue,
    courseCounts,
    statusCounts,
    averageAttendance,
    examResults,
    passed,
    failed,
  } = reportData;

  const collectionRate = totalFees > 0
    ? Math.round((totalCollected / totalFees) * 100)
    : 0;

  const admissionRate = admissions.length > 0
    ? Math.round((activeStudents.length / admissions.length) * 100)
    : 0;

  const attendanceChart = averageAttendance > 0
    ? DEMO_ATTENDANCE.map((item) => ({
        label: item.month,
        value: averageAttendance,
      }))
    : DEMO_ATTENDANCE;

  const studentReportRows = students.map((student) => ({
    ID: student.id ?? "",
    Name: student.name ?? student.studentName ?? "",
    Course: student.course ?? student.courseName ?? "",
    Semester: student.semester ?? "",
    Status: student.status ?? "",
  }));

  const feeReportRows = invoices.map((invoice) => ({
    Student: invoice.studentName ?? invoice.name ?? "",
    Invoice: invoice.invoiceNumber ?? invoice.invoiceNo ?? invoice.id ?? "",
    Amount: getAmount(invoice),
    Status: invoice.status ?? invoice.paymentStatus ?? "",
  }));

  const examReportRows = examResults.map((result) => ({
    Student: result.student,
    Subject: result.subject,
    Marks: result.marks,
    "Maximum Marks": result.maxMarks,
    Status: result.status,
  }));

  const handleExport = () => {
    const reports = {
      students: studentReportRows,
      fees: feeReportRows,
      exams: examReportRows,
    };

    downloadCSV(
      `college-${reportType}-report.csv`,
      reports[reportType] || studentReportRows
    );
  };

  const handleRefresh = () => {
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Reports & Analytics
            </h1>
            <span className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
              College Admin
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Monitor your institution's academic and administrative performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <BarChart3 size={15} />
          Report Filters
        </div>

        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500"
        >
          <option value="all">All time</option>
          <option value="current">Current academic session</option>
        </select>

        <select
          value={reportType}
          onChange={(event) => setReportType(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500"
        >
          <option value="students">Student Report</option>
          <option value="fees">Fees Report</option>
          <option value="exams">Examination Report</option>
        </select>

        <span className="ml-auto text-[10px] text-slate-400">
          Data refreshes from local browser storage
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          subtitle={`${activeStudents.length} active students`}
          icon={Users}
          color="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Admissions"
          value={admissions.length}
          subtitle="Applications recorded"
          icon={ClipboardList}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Fee Collection"
          value={formatCurrency(totalCollected)}
          subtitle={`${collectionRate}% of recorded invoices`}
          icon={Wallet}
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Average Attendance"
          value={averageAttendance ? `${averageAttendance}%` : "—"}
          subtitle={
            averageAttendance
              ? "Based on available attendance records"
              : "No attendance records found"
          }
          icon={CalendarCheck}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main analytics */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Student analytics */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <SectionHeader
            title="Student Overview"
            description="Enrollment and student status distribution"
          />

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Total Enrolled</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {students.length}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Active Students</p>
              <p className="mt-1 text-xl font-bold text-emerald-600">
                {activeStudents.length}
              </p>
            </div>
          </div>

          {Object.entries(statusCounts).map(([label, value]) => (
            <ProgressRow
              key={label}
              label={label}
              value={value}
              total={students.length}
              color={
                label === "Active"
                  ? "bg-emerald-500"
                  : label === "Inactive"
                  ? "bg-amber-500"
                  : label === "Graduated"
                  ? "bg-indigo-500"
                  : "bg-slate-400"
              }
            />
          ))}
        </section>

        {/* Course analytics */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <SectionHeader
            title="Course-wise Enrollment"
            description="Distribution of students across courses"
          />

          {Object.keys(courseCounts).length ? (
            Object.entries(courseCounts).map(([course, count]) => (
              <ProgressRow
                key={course}
                label={course}
                value={count}
                total={students.length}
                color="bg-indigo-500"
              />
            ))
          ) : (
            <p className="py-8 text-center text-xs text-slate-400">
              No course data available.
            </p>
          )}
        </section>

        {/* Attendance chart */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <SectionHeader
            title="Attendance Analytics"
            description="Attendance trend overview"
          />

          <BarChart data={attendanceChart} />

          <div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50 p-3">
            <div className="flex items-center gap-2">
              <CalendarCheck size={17} className="text-amber-600" />
              <span className="text-xs font-medium text-slate-700">
                Average attendance
              </span>
            </div>
            <span className="text-sm font-bold text-amber-700">
              {averageAttendance ? `${averageAttendance}%` : "No data"}
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Monthly bars are illustrative until monthly attendance records are available.
          </p>
        </section>

        {/* Fee analytics */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <SectionHeader
            title="Financial Overview"
            description="Recorded fee invoices and collections"
          />

          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-[11px] text-emerald-700">
                Total Fee Collected
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-800">
                {formatCurrency(totalCollected)}
              </p>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-500">Collection progress</span>
                <span className="font-bold text-slate-800">
                  {collectionRate}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${Math.min(collectionRate, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-[10px] text-slate-500">Recorded Invoices</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {invoices.length}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-[10px] text-slate-500">Pending Balance*</p>
                <p className="mt-1 text-lg font-bold text-red-600">
                  {formatCurrency(totalDue)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              *Calculated from recorded invoice totals minus successful payments.
            </p>
          </div>
        </section>
      </div>

      {/* Examination overview */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <SectionHeader
          title="Examination Performance"
          description="Overview of examinations and recorded marks"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Examinations",
              value: exams.length,
              icon: BookOpenCheck,
              color: "text-indigo-600 bg-indigo-50",
            },
            {
              label: "Registrations",
              value: registrations.length,
              icon: Users,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Results Recorded",
              value: marks.length,
              icon: FileSpreadsheet,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Passed",
              value: passed,
              icon: TrendingUp,
              color: "text-green-600 bg-green-50",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-lg border border-slate-100 p-3"
              >
                <div className={`mb-2 inline-flex rounded-lg p-2 ${item.color}`}>
                  <Icon size={17} />
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {item.value}
                </p>
                <p className="text-[10px] text-slate-500">{item.label}</p>
              </div>
            );
          })}
        </div>

        {marks.length > 0 && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Failed results</span>
              <span className="font-semibold text-red-600">{failed}</span>
            </div>
          </div>
        )}
      </section>

      {/* Report export */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <SectionHeader
          title="Download Reports"
          description="Export available records as CSV files"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              title: "Student Report",
              description: "Student details and course enrollment",
              icon: Users,
              type: "students",
            },
            {
              title: "Fees Report",
              description: "Recorded invoices and payment status",
              icon: IndianRupee,
              type: "fees",
            },
            {
              title: "Examination Report",
              description: "Available student marks and results",
              icon: BookOpenCheck,
              type: "exams",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.type}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const rows = {
                      students: studentReportRows,
                      fees: feeReportRows,
                      exams: examReportRows,
                    };

                    downloadCSV(
                      `${item.type}-report.csv`,
                      rows[item.type]
                    );
                  }}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  title={`Export ${item.title}`}
                >
                  <Download size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data information */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-blue-600" />
        <div>
          <p className="text-xs font-semibold text-blue-800">
            Reports data information
          </p>
          <p className="mt-1 text-[11px] leading-5 text-blue-700">
            Reports use data saved in this browser's LocalStorage. Some
            metrics may show zero or demo values if the corresponding module
            has not saved records yet. This is a frontend demonstration,
            not a verified financial or academic report.
          </p>
        </div>
      </div>
    </div>
  );
}