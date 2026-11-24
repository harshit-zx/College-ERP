
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Search,
  Users,
  UserCheck,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Coffee,
  ClipboardCheck,
  Filter,
  Save,
} from "lucide-react";
import { ACADEMIC_CATALOG ,INITIAL_STUDENTS } from "../../data/academicCatalog";

const STORAGE_KEY = "college_erp_attendance_v1";
const LOW_ATTENDANCE_LIMIT = 75;

const STATUSES = ["Present", "Absent", "Late", "Leave"];
const PERIODS = [
  "Full Day",
  "Period 1",
  "Period 2",
  "Period 3",
  "Period 4",
  "Period 5",
  "Period 6",
];

const FACULTY = [
  { id: 1, name: "Dr. Anil Sharma", employeeId: "FAC-2026-001", department: "Computer Science" },
  { id: 2, name: "Priya Singh", employeeId: "FAC-2026-002", department: "Information Technology" },
  { id: 3, name: "Rahul Verma", employeeId: "FAC-2026-003", department: "Electronics" },
  { id: 4, name: "Neha Gupta", employeeId: "FAC-2026-004", department: "Mechanical Engineering" },
];

const SUBJECTS = [
  "Data Structures",
  "Database Management System",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering",
  "Mathematics",
  "Programming",
  "Engineering Physics",
];

function todayString() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function readAttendance() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function downloadCSV(filename, rows) {
  if (!rows.length) return;

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

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

function StatusBadge({ status }) {
  const styles = {
    Present: "bg-emerald-50 text-emerald-700",
    Absent: "bg-red-50 text-red-700",
    Late: "bg-amber-50 text-amber-700",
    Leave: "bg-blue-50 text-blue-700",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{title}</p>
        <span className={`rounded-md p-2 ${color}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-[10px] text-gray-500">{subtitle}</p>
    </div>
  );
}

export default function Attendance() {
  const [tab, setTab] = useState("students");
  const [date, setDate] = useState(todayString());
  const [course, setCourse] = useState("All");
  const [branch, setBranch] = useState("All");
  const [semester, setSemester] = useState("All");
  const [period, setPeriod] = useState("Full Day");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState(readAttendance);
  const [facultyRecords, setFacultyRecords] = useState(() => {
    try {
        return JSON.parse(
        localStorage.getItem("college_erp_faculty_attendance_v1")
        ) || {};
    } catch {
        return {};
    }
    });
  const [facultyDate, setFacultyDate] = useState(todayString());
  const [facultySearch, setFacultySearch] = useState("");
  const [reportMonth, setReportMonth] = useState(todayString().slice(0, 7));
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);
  useEffect(() => {
  localStorage.setItem(
    "college_erp_faculty_attendance_v1",
    JSON.stringify(facultyRecords)
  );
}, [facultyRecords]);

  const students = useMemo(() => {
    return INITIAL_STUDENTS.filter((student) => {
      const matchesCourse = course === "All" || student.course === course;
      const matchesBranch = branch === "All" || student.branch === branch;
      const matchesSemester =
        semester === "All" || String(student.semester) === semester;

      const searchText = search.toLowerCase();
      const matchesSearch =
        !searchText ||
        student.name?.toLowerCase().includes(searchText) ||
        student.enrollmentNo?.toLowerCase().includes(searchText) ||
        student.email?.toLowerCase().includes(searchText);

      return matchesCourse && matchesBranch && matchesSemester && matchesSearch;
    });
  }, [course, branch, semester, search]);

  const courses = useMemo(
    () => ACADEMIC_CATALOG.filter((item) => item.status === "Active"),
    []
  );

  const selectedCourse = courses.find((item) => item.courseName === course);
  const branches = selectedCourse?.branches || [];

  const currentRecords = useMemo(() => {
    return records.filter(
      (record) =>
        record.date === date &&
        record.period === period &&
        record.subject === subject
    );
  }, [records, date, period, subject]);

  const getStatus = (studentId) =>
    currentRecords.find((record) => record.studentId === studentId)?.status || "";

  const counts = useMemo(() => {
    const result = { Present: 0, Absent: 0, Late: 0, Leave: 0 };
    students.forEach((student) => {
      const status = getStatus(student.id);
      if (status) result[status] += 1;
    });
    return result;
  }, [students, currentRecords]);

  const markedCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const attendanceRate = markedCount
    ? Math.round(((counts.Present + counts.Late) / markedCount) * 100)
    : 0;

  function updateStudentStatus(student, status) {
    setRecords((previous) => {
      const filtered = previous.filter(
        (record) =>
          !(
            record.studentId === student.id &&
            record.date === date &&
            record.period === period &&
            record.subject === subject
          )
      );

      return [
        ...filtered,
        {
          studentId: student.id,
          enrollmentNo: student.enrollmentNo,
          studentName: student.name,
          course: student.course,
          branch: student.branch,
          semester: student.semester,
          date,
          period,
          subject,
          status,
          updatedAt: new Date().toISOString(),
        },
      ];
    });
  }

  function markAllPresent() {
    setRecords((previous) => {
      const filtered = previous.filter(
        (record) =>
          !(
            record.date === date &&
            record.period === period &&
            record.subject === subject &&
            students.some((student) => student.id === record.studentId)
          )
      );

      const newRecords = students.map((student) => ({
        studentId: student.id,
        enrollmentNo: student.enrollmentNo,
        studentName: student.name,
        course: student.course,
        branch: student.branch,
        semester: student.semester,
        date,
        period,
        subject,
        status: "Present",
        updatedAt: new Date().toISOString(),
      }));

      return [...filtered, ...newRecords];
    });
  }

  function saveRegister() {
    setSavedMessage("Attendance register saved in this browser.");
    window.setTimeout(() => setSavedMessage(""), 2500);
  }

  const monthlyRecords = useMemo(
    () => records.filter((record) => record.date?.startsWith(reportMonth)),
    [records, reportMonth]
  );

  const monthlyStudentSummary = useMemo(() => {
    return students.map((student) => {
      const studentRecords = monthlyRecords.filter(
        (record) => record.studentId === student.id
      );
      const total = studentRecords.length;
      const attended = studentRecords.filter(
        (record) => record.status === "Present" || record.status === "Late"
      ).length;
      const percentage = total ? Math.round((attended / total) * 100) : 0;

      return { ...student, total, attended, percentage };
    });
  }, [students, monthlyRecords]);

  const lowAttendance = monthlyStudentSummary.filter(
    (student) => student.total > 0 && student.percentage < LOW_ATTENDANCE_LIMIT
  );

  function exportDailyReport() {
    const rows = [
      ["Date", "Period", "Subject", "Enrollment No", "Student", "Course", "Branch", "Semester", "Status"],
      ...students.map((student) => [
        date,
        period,
        subject,
        student.enrollmentNo,
        student.name,
        student.course,
        student.branch,
        student.semester,
        getStatus(student.id) || "Not Marked",
      ]),
    ];
    downloadCSV(`attendance-${date}.csv`, rows);
  }

  function exportMonthlyReport() {
    const rows = [
      ["Enrollment No", "Student", "Course", "Branch", "Total Records", "Attended", "Attendance %"],
      ...monthlyStudentSummary.map((student) => [
        student.enrollmentNo,
        student.name,
        student.course,
        student.branch,
        student.total,
        student.attended,
        `${student.percentage}%`,
      ]),
    ];
    downloadCSV(`monthly-attendance-${reportMonth}.csv`, rows);
  }

  const filteredFaculty = FACULTY.filter((member) =>
    `${member.name} ${member.employeeId} ${member.department}`
      .toLowerCase()
      .includes(facultySearch.toLowerCase())
  );

  function setFacultyStatus(id, status) {
    setFacultyRecords((previous) => ({
      ...previous,
      [`${facultyDate}-${id}`]: status,
    }));
  }

  const facultyCounts = FACULTY.reduce(
    (result, member) => {
      const status = facultyRecords[`${facultyDate}-${member.id}`];
      if (status) result[status] += 1;
      return result;
    },
    { Present: 0, Absent: 0, Late: 0, Leave: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Attendance Management</h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage student and faculty attendance registers
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays size={15} />
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: "students", label: "Student Attendance", icon: Users },
          { id: "faculty", label: "Faculty Attendance", icon: UserCheck },
          { id: "reports", label: "Monthly Reports", icon: ClipboardCheck },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-medium ${
              tab === id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "students" && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <SummaryCard title="Total Students" value={students.length} subtitle="Filtered students" icon={Users} color="bg-blue-50 text-blue-600" />
            <SummaryCard title="Present" value={counts.Present} subtitle="Marked present" icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
            <SummaryCard title="Absent" value={counts.Absent} subtitle="Marked absent" icon={XCircle} color="bg-red-50 text-red-600" />
            <SummaryCard title="Attendance Rate" value={`${attendanceRate}%`} subtitle={`${markedCount} marked records`} icon={Clock3} color="bg-amber-50 text-amber-600" />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Filter size={14} /> Attendance Filters
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-[11px] text-gray-500">
                Attendance Date
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-800 outline-none focus:border-blue-500"
                />
              </label>
              <label className="text-[11px] text-gray-500">
                Course
                <select
                  value={course}
                  onChange={(event) => {
                    setCourse(event.target.value);
                    setBranch("All");
                  }}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-800"
                >
                  <option value="All">All Courses</option>
                  {courses.map((item) => (
                    <option key={item.id} value={item.courseName}>{item.shortName || item.courseName}</option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] text-gray-500">
                Branch
                <select
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-800"
                >
                  <option value="All">All Branches</option>
                  {branches.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-[11px] text-gray-500">
                Semester
                <select
                  value={semester}
                  onChange={(event) => setSemester(event.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-800"
                >
                  <option value="All">All Semesters</option>
                  {Array.from({ length: 8 }, (_, index) => (
                    <option key={index + 1} value={String(index + 1)}>Semester {index + 1}</option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] text-gray-500">
                Period
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-800"
                >
                  {PERIODS.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-[11px] text-gray-500">
                Subject
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-800"
                >
                  {SUBJECTS.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-[11px] text-gray-500 sm:col-span-2">
                Search Student
                <div className="relative mt-1">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, enrollment number or email"
                    className="h-9 w-full rounded-md border border-gray-200 pl-8 pr-3 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Student Register</h2>
                <p className="mt-0.5 text-[10px] text-gray-500">{date} · {period} · {subject}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={markAllPresent} className="rounded-md border border-emerald-200 px-3 py-2 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50">
                  Mark All Present
                </button>
                <button onClick={exportDailyReport} className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-2 text-[11px] text-gray-600 hover:bg-gray-50">
                  <Download size={13} /> Export CSV
                </button>
                <button onClick={saveRegister} className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-[11px] font-medium text-white hover:bg-blue-700">
                  <Save size={13} /> Save Register
                </button>
              </div>
            </div>

            {savedMessage && (
              <p className="bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{savedMessage}</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-3">Student</th>
                    <th className="px-3 py-3">Enrollment No.</th>
                    <th className="px-3 py-3">Course / Branch</th>
                    <th className="px-3 py-3">Semester</th>
                    <th className="px-3 py-3">Current Status</th>
                    <th className="px-3 py-3">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.id} className="text-xs hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="mt-0.5 text-[10px] text-gray-400">{student.email}</p>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{student.enrollmentNo}</td>
                      <td className="px-3 py-3 text-gray-600">
                        {student.course}
                        <p className="text-[10px] text-gray-400">{student.branch}</p>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{student.semester}</td>
                      <td className="px-3 py-3">
                        {getStatus(student.id) ? <StatusBadge status={getStatus(student.id)} /> : <span className="text-[10px] text-gray-400">Not marked</span>}
                      </td>
                      <td className="px-3 py-3">
                        <select
                          value={getStatus(student.id)}
                          onChange={(event) => updateStudentStatus(student, event.target.value)}
                          className="h-8 rounded-md border border-gray-200 px-2 text-[11px] outline-none focus:border-blue-500"
                        >
                          <option value="">Select status</option>
                          {STATUSES.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!students.length && (
                    <tr><td colSpan="6" className="px-3 py-10 text-center text-xs text-gray-400">No students match these filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 border-t border-gray-100 px-3 py-3 text-[10px] text-gray-500">
              <span>Present: <b className="text-emerald-700">{counts.Present}</b></span>
              <span>Absent: <b className="text-red-700">{counts.Absent}</b></span>
              <span>Late: <b className="text-amber-700">{counts.Late}</b></span>
              <span>Leave: <b className="text-blue-700">{counts.Leave}</b></span>
              <span>Not marked: <b className="text-gray-700">{students.length - markedCount}</b></span>
            </div>
          </div>
        </>
      )}

      {tab === "faculty" && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <SummaryCard title="Total Faculty" value={FACULTY.length} subtitle="Demo faculty list" icon={Users} color="bg-blue-50 text-blue-600" />
            <SummaryCard title="Present" value={facultyCounts.Present} subtitle="Marked present" icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
            <SummaryCard title="Absent" value={facultyCounts.Absent} subtitle="Marked absent" icon={XCircle} color="bg-red-50 text-red-600" />
            <SummaryCard title="Late / Leave" value={facultyCounts.Late + facultyCounts.Leave} subtitle="Other statuses" icon={Clock3} color="bg-amber-50 text-amber-600" />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <label className="text-[11px] text-gray-500">
                Faculty Attendance Date
                <input type="date" value={facultyDate} onChange={(event) => setFacultyDate(event.target.value)} className="mt-1 block h-9 rounded-md border border-gray-200 px-2 text-xs text-gray-800" />
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                <input value={facultySearch} onChange={(event) => setFacultySearch(event.target.value)} placeholder="Search faculty" className="h-9 rounded-md border border-gray-200 pl-8 pr-3 text-xs outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-3">Faculty</th>
                    <th className="px-3 py-3">Employee ID</th>
                    <th className="px-3 py-3">Department</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFaculty.map((member) => {
                    const status = facultyRecords[`${facultyDate}-${member.id}`] || "";
                    return (
                      <tr key={member.id} className="text-xs">
                        <td className="px-3 py-3 font-medium text-gray-800">{member.name}</td>
                        <td className="px-3 py-3 text-gray-500">{member.employeeId}</td>
                        <td className="px-3 py-3 text-gray-600">{member.department}</td>
                        <td className="px-3 py-3">{status ? <StatusBadge status={status} /> : <span className="text-[10px] text-gray-400">Not marked</span>}</td>
                        <td className="px-3 py-3">
                          <select value={status} onChange={(event) => setFacultyStatus(member.id, event.target.value)} className="h-8 rounded-md border border-gray-200 px-2 text-[11px]">
                            <option value="">Select status</option>
                            {STATUSES.map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[10px] text-gray-400">Faculty records in this first version are sample data and are not connected to the Faculty Management page.</p>
          </div>
        </>
      )}

      {tab === "reports" && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Monthly Attendance Report</h2>
              <p className="mt-1 text-[10px] text-gray-500">Summary calculated from saved student attendance records</p>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <label className="text-[11px] text-gray-500">
                Select Month
                <input type="month" value={reportMonth} onChange={(event) => setReportMonth(event.target.value)} className="mt-1 block h-9 rounded-md border border-gray-200 px-2 text-xs text-gray-800" />
              </label>
              <button onClick={exportMonthlyReport} className="flex h-9 items-center gap-1 rounded-md bg-blue-600 px-3 text-[11px] font-medium text-white hover:bg-blue-700">
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard title="Attendance Entries" value={monthlyRecords.length} subtitle="Records in selected month" icon={ClipboardCheck} color="bg-blue-50 text-blue-600" />
            <SummaryCard title="Students Below 75%" value={lowAttendance.length} subtitle="Low attendance alerts" icon={AlertTriangle} color="bg-amber-50 text-amber-600" />
            <SummaryCard title="Students With Records" value={monthlyStudentSummary.filter((item) => item.total > 0).length} subtitle="Students marked this month" icon={Users} color="bg-emerald-50 text-emerald-600" />
          </div>

          {lowAttendance.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                <AlertTriangle size={15} /> Low Attendance Alerts
              </div>
              <p className="mt-1 text-[10px] text-amber-700">
                These students have attendance below {LOW_ATTENDANCE_LIMIT}% for the selected month.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lowAttendance.map((student) => (
                  <span key={student.id} className="rounded-md border border-amber-200 bg-white px-2 py-1 text-[10px] text-amber-800">
                    {student.name} · {student.percentage}%
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Enrollment No.</th>
                  <th className="px-3 py-3">Total Entries</th>
                  <th className="px-3 py-3">Attended</th>
                  <th className="px-3 py-3">Attendance %</th>
                  <th className="px-3 py-3">Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthlyStudentSummary.map((student) => (
                  <tr key={student.id} className="text-xs">
                    <td className="px-3 py-3 font-medium text-gray-800">{student.name}</td>
                    <td className="px-3 py-3 text-gray-500">{student.enrollmentNo}</td>
                    <td className="px-3 py-3 text-gray-600">{student.total}</td>
                    <td className="px-3 py-3 text-gray-600">{student.attended}</td>
                    <td className="px-3 py-3">
                      <span className={`font-semibold ${student.total && student.percentage < LOW_ATTENDANCE_LIMIT ? "text-red-600" : "text-emerald-700"}`}>
                        {student.total ? `${student.percentage}%` : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {student.total > 0 && student.percentage < LOW_ATTENDANCE_LIMIT
                        ? <span className="text-[10px] font-medium text-red-600">Below 75%</span>
                        : <span className="text-[10px] text-gray-400">{student.total ? "Normal" : "No records"}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="text-[10px] text-gray-400">
        Demo module: attendance is stored locally in this browser. Connect a backend before using it as an official attendance register.
      </p>
    </div>
  );
}
