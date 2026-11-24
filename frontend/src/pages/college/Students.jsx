import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
} from "lucide-react";

import { ACADEMIC_CATALOG ,INITIAL_STUDENTS} from "../../data/academicCatalog";



const COURSE_BRANCHES = {
  "B.Tech": [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
  ],
  BBA: ["Business Administration"],
  MBA: ["Finance", "Marketing", "Human Resources"],
  BCA: ["Computer Applications"],
};

const SESSIONS = ["2026-27", "2025-26", "2024-25", "2023-24"];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  course: "",
  branch: "",
  semester: "",
  session: "2026-27",
  admissionDate: "",
  status: "Active",
};

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
  Graduated: "bg-blue-50 text-blue-700",
  Suspended: "bg-red-50 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

function StudentModal({ mode, student, onClose, onSave }) {
  const [form, setForm] = useState(student || EMPTY_FORM);
  const [error, setError] = useState("");

  const isView = mode === "view";
  const selectedCourse = ACADEMIC_CATALOG.find(
    (course) => course.shortName === form.course && course.status === "Active",
  );

  const branches = selectedCourse?.branches || [];

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "course" ? { branch: "" } : {}),
    }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.course ||
      !form.branch ||
      !form.semester ||
      !form.session ||
      !form.admissionDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    onSave(form);
  };

  const inputClass =
    "mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 disabled:bg-slate-50";

  const labelClass = "text-[11px] font-medium text-slate-600";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 sm:p-5">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {mode === "add"
                ? "Add New Student"
                : mode === "edit"
                  ? "Edit Student"
                  : "Student Details"}
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {mode === "add"
                ? "Enter the student's academic and personal details."
                : mode === "edit"
                  ? "Update the student's information."
                  : "Review the student's registered information."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            {mode !== "add" && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Enrollment Number</label>
                <input
                  value={student?.enrollmentNo || ""}
                  disabled
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Student Full Name *</label>
              <input
                value={form.name}
                disabled={isView}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email Address *</label>
              <input
                type="email"
                value={form.email}
                disabled={isView}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="student@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                value={form.phone}
                disabled={isView}
                maxLength={10}
                onChange={(e) =>
                  updateField("phone", e.target.value.replace(/\D/g, ""))
                }
                placeholder="10-digit mobile number"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                value={form.gender}
                disabled={isView}
                onChange={(e) => updateField("gender", e.target.value)}
                className={inputClass}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Course *</label>
              <select
                value={form.course}
                disabled={isView}
                onChange={(e) => updateField("course", e.target.value)}
                className={inputClass}
              >
                <option value="">Select course</option>
                {ACADEMIC_CATALOG.filter(
                  (course) => course.status === "Active",
                ).map((course) => (
                  <option key={course.id} value={course.shortName}>
                    {course.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Branch *</label>
              <select
                value={form.branch}
                disabled={isView || !form.course}
                onChange={(e) => updateField("branch", e.target.value)}
                className={inputClass}
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Semester *</label>
              <select
                value={form.semester}
                disabled={isView}
                onChange={(e) => updateField("semester", e.target.value)}
                className={inputClass}
              >
                <option value="">Select semester</option>
                {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(
                  (semester) => (
                    <option key={semester} value={semester}>
                      Semester {semester}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className={labelClass}>Academic Session *</label>
              <select
                value={form.session}
                disabled={isView}
                onChange={(e) => updateField("session", e.target.value)}
                className={inputClass}
              >
                {SESSIONS.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Admission Date *</label>
              <input
                type="date"
                value={form.admissionDate}
                disabled={isView}
                onChange={(e) => updateField("admissionDate", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Student Status</label>
              <select
                value={form.status}
                disabled={isView}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputClass}
              >
                {["Active", "Inactive", "Graduated", "Suspended"].map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {error && (
            <p className="mx-5 mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {isView ? "Close" : "Cancel"}
            </button>
            {!isView && (
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                {mode === "add" ? "Add Student" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Students() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modal, setModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.enrollmentNo.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.phone.includes(query);

      return (
        matchesSearch &&
        (courseFilter === "All" || student.course === courseFilter) &&
        (branchFilter === "All" || student.branch === branchFilter) &&
        (sessionFilter === "All" || student.session === sessionFilter) &&
        (statusFilter === "All" || student.status === statusFilter)
      );
    });
  }, [
    students,
    search,
    courseFilter,
    branchFilter,
    sessionFilter,
    statusFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const visibleStudents = filteredStudents.slice(
    pageStart,
    pageStart + pageSize,
  );

  const activeCount = students.filter(
    (student) => student.status === "Active",
  ).length;
  const graduatedCount = students.filter(
    (student) => student.status === "Graduated",
  ).length;
  const inactiveCount = students.filter(
    (student) => student.status !== "Active",
  ).length;

  const openModal = (mode, student = null) => {
    setSelectedStudent(student);
    setModal(mode);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedStudent(null);
  };

  const handleSave = (form) => {
    if (modal === "add") {
      const nextId = Math.max(0, ...students.map((student) => student.id)) + 1;
      const year = form.session.slice(0, 4);
      const enrollmentNo = `ERP${year}${String(nextId).padStart(3, "0")}`;

      setStudents((current) => [
        {
          ...form,
          id: nextId,
          enrollmentNo,
        },
        ...current,
      ]);
      setCurrentPage(1);
    } else {
      setStudents((current) =>
        current.map((student) =>
          student.id === selectedStudent.id ? { ...student, ...form } : student,
        ),
      );
    }

    closeModal();
  };

  const handleDelete = (student) => {
    const confirmed = window.confirm(
      `Delete student ${student.name} (${student.enrollmentNo})?`,
    );

    if (confirmed) {
      setStudents((current) =>
        current.filter((item) => item.id !== student.id),
      );
    }
  };

  const exportCSV = () => {
    const headers = [
      "Enrollment Number",
      "Name",
      "Email",
      "Phone",
      "Gender",
      "Course",
      "Branch",
      "Semester",
      "Academic Session",
      "Admission Date",
      "Status",
    ];

    const rows = filteredStudents.map((student) => [
      student.enrollmentNo,
      student.name,
      student.email,
      student.phone,
      student.gender,
      student.course,
      student.branch,
      student.semester,
      student.session,
      student.admissionDate,
      student.status,
    ]);

    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "college-students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setCourseFilter("All");
    setBranchFilter("All");
    setSessionFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const selectClass =
    "h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-600 outline-none focus:border-indigo-400";

  const summaryCards = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Students",
      value: activeCount,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Graduated",
      value: graduatedCount,
      icon: GraduationCap,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Inactive / Other",
      value: inactiveCount,
      icon: UserX,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Student Management
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage student profiles, enrollment and academic information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => openModal("add")}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={15} /> Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-slate-500">
                  {card.label}
                </p>
                <span className={`rounded-lg p-2 ${card.color}`}>
                  <Icon size={16} />
                </span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {card.value.toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                All Students
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                {filteredStudents.length} student record
                {filteredStudents.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 sm:w-64">
                <Search size={14} className="shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search name, enrollment, email..."
                  className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  setBranchFilter("All");
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="All">All Courses</option>
                {Object.keys(COURSE_BRANCHES).map((course) => (
                  <option key={course}>{course}</option>
                ))}
              </select>

              <select
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="All">All Branches</option>
                {(courseFilter === "All"
                  ? [
                      ...new Set(
                        ACADEMIC_CATALOG.filter(
                          (course) => course.status === "Active",
                        ).flatMap((course) => course.branches),
                      ),
                    ]
                  : ACADEMIC_CATALOG.find(
                      (course) =>
                        course.shortName === courseFilter &&
                        course.status === "Active",
                    )?.branches || []
                ).map((branch) => (
                  <option key={branch}>{branch}</option>
                ))}
              </select>

              <select
                value={sessionFilter}
                onChange={(e) => {
                  setSessionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="All">All Sessions</option>
                {SESSIONS.map((session) => (
                  <option key={session}>{session}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="All">All Status</option>
                {["Active", "Inactive", "Graduated", "Suspended"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  ),
                )}
              </select>

              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs text-slate-500 hover:bg-slate-50"
              >
                <RefreshCw size={13} /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Enrollment No.</th>
                <th className="px-4 py-3">Course / Branch</th>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleStudents.length > 0 ? (
                visibleStudents.map((student) => (
                  <tr key={student.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700">
                          {student.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {student.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-600">
                      {student.enrollmentNo}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-700">
                        {student.course}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {student.branch}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {student.session}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      Sem {student.semester}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="View student"
                          onClick={() => openModal("view", student)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          title="Edit student"
                          onClick={() => openModal("edit", student)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          title="Delete student"
                          onClick={() => handleDelete(student)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Filter size={22} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-xs font-medium text-slate-600">
                      No students found
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Try changing your search or filters.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] outline-none"
            >
              {[5, 8, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>
              Showing {filteredStudents.length ? pageStart + 1 : 0}–
              {Math.min(pageStart + pageSize, filteredStudents.length)} of{" "}
              {filteredStudents.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="px-2 text-[11px] text-slate-600">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {modal && (
        <StudentModal
          mode={modal}
          student={selectedStudent}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Students;
