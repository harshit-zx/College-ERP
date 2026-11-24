
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  BookOpen,
  GraduationCap,
  GitBranch,
  Building2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Layers3,
} from "lucide-react";

import {
  ACADEMIC_CATALOG,
  UNIVERSITY_OPTIONS,
  DEPARTMENT_OPTIONS,
  DEGREE_TYPES,
  COURSE_STATUSES,
} from "../../data/academicCatalog";

const EMPTY_FORM = {
  courseCode: "",
  courseName: "",
  shortName: "",
  degreeType: "Undergraduate",
  durationYears: "4",
  totalSemesters: "8",
  department: "",
  university: "",
  affiliationCode: "",
  branchesText: "",
  status: "Active",
};

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
  "Under Review": "bg-amber-50 text-amber-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function CourseModal({ mode, course, onClose, onSave }) {
  const [form, setForm] = useState(
    course
      ? { ...course, branchesText: course.branches.join(", ") }
      : EMPTY_FORM
  );
  const [error, setError] = useState("");

  const isView = mode === "view";

  const inputClass =
    "mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 disabled:bg-slate-50";

  const labelClass = "text-[11px] font-medium text-slate-600";

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.courseCode.trim() ||
      !form.courseName.trim() ||
      !form.shortName.trim() ||
      !form.degreeType ||
      !form.durationYears ||
      !form.totalSemesters ||
      !form.department ||
      !form.university ||
      !form.affiliationCode.trim() ||
      !form.branchesText.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const branches = [...new Set(
      form.branchesText.split(",").map((branch) => branch.trim()).filter(Boolean)
    )];

    if (branches.length === 0) {
      setError("Add at least one branch or specialization.");
      return;
    }

    const durationYears = Number(form.durationYears);
    const totalSemesters = Number(form.totalSemesters);

    if (
      !Number.isInteger(durationYears) ||
      durationYears < 1 ||
      durationYears > 10 ||
      !Number.isInteger(totalSemesters) ||
      totalSemesters < 1 ||
      totalSemesters > 20
    ) {
      setError("Enter a valid course duration and semester count.");
      return;
    }

    onSave({
      ...form,
      courseCode: form.courseCode.trim().toUpperCase(),
      courseName: form.courseName.trim(),
      shortName: form.shortName.trim(),
      affiliationCode: form.affiliationCode.trim(),
      durationYears,
      totalSemesters,
      branches,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 sm:p-5">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {mode === "add" ? "Add Course" : mode === "edit" ? "Edit Course" : "Course Details"}
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Configure course structure, branches and university affiliation.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Course Code *</label>
              <input value={form.courseCode} disabled={isView} onChange={(e) => update("courseCode", e.target.value)} placeholder="e.g. BTECH" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Short Name *</label>
              <input value={form.shortName} disabled={isView} onChange={(e) => update("shortName", e.target.value)} placeholder="e.g. B.Tech" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Full Course Name *</label>
              <input value={form.courseName} disabled={isView} onChange={(e) => update("courseName", e.target.value)} placeholder="Enter official course name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Degree Type *</label>
              <select value={form.degreeType} disabled={isView} onChange={(e) => update("degreeType", e.target.value)} className={inputClass}>
                {DEGREE_TYPES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Department *</label>
              <select value={form.department} disabled={isView} onChange={(e) => update("department", e.target.value)} className={inputClass}>
                <option value="">Select department</option>
                {DEPARTMENT_OPTIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Duration (Years) *</label>
              <input type="number" min="1" max="10" value={form.durationYears} disabled={isView} onChange={(e) => update("durationYears", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Total Semesters *</label>
              <input type="number" min="1" max="20" value={form.totalSemesters} disabled={isView} onChange={(e) => update("totalSemesters", e.target.value)} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Affiliating University *</label>
              <select value={form.university} disabled={isView} onChange={(e) => update("university", e.target.value)} className={inputClass}>
                <option value="">Select university</option>
                {UNIVERSITY_OPTIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>University Affiliation / Approval Code *</label>
              <input value={form.affiliationCode} disabled={isView} onChange={(e) => update("affiliationCode", e.target.value)} placeholder="Enter official approval or affiliation reference" className={inputClass} />
              <p className="mt-1 text-[10px] text-slate-400">Use the reference issued by the university. This field is demo data, not verified approval.</p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Branches / Specializations *</label>
              <textarea
                rows={3}
                value={form.branchesText}
                disabled={isView}
                onChange={(e) => update("branchesText", e.target.value)}
                placeholder="Separate branches with commas, e.g. Computer Science, Information Technology"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-400 disabled:bg-slate-50"
              />
              <p className="mt-1 text-[10px] text-slate-400">Each comma-separated entry becomes a branch under this course.</p>
            </div>
            <div>
              <label className={labelClass}>Course Status</label>
              <select value={form.status} disabled={isView} onChange={(e) => update("status", e.target.value)} className={inputClass}>
                {COURSE_STATUSES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="mx-5 mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
              {isView ? "Close" : "Cancel"}
            </button>
            {!isView && (
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                {mode === "add" ? "Add Course" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Courses() {
  const [courses, setCourses] = useState(ACADEMIC_CATALOG);
  const [search, setSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("All");
  const [universityFilter, setUniversityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modal, setModal] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.courseName.toLowerCase().includes(query) ||
        course.shortName.toLowerCase().includes(query) ||
        course.courseCode.toLowerCase().includes(query) ||
        course.branches.some((branch) => branch.toLowerCase().includes(query)) ||
        course.affiliationCode.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (degreeFilter === "All" || course.degreeType === degreeFilter) &&
        (universityFilter === "All" || course.university === universityFilter) &&
        (statusFilter === "All" || course.status === statusFilter) &&
        (departmentFilter === "All" || course.department === departmentFilter)
      );
    });
  }, [courses, search, degreeFilter, universityFilter, statusFilter, departmentFilter]);

  const allBranches = useMemo(
    () => courses.flatMap((course) =>
      course.branches.map((branch) => ({
        branch,
        course: course.shortName,
        courseCode: course.courseCode,
        department: course.department,
        university: course.university,
        status: course.status,
      }))
    ),
    [courses]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const visibleCourses = filteredCourses.slice(pageStart, pageStart + pageSize);
  const activeCount = courses.filter((course) => course.status === "Active").length;
  const branchCount = courses.reduce((total, course) => total + course.branches.length, 0);
  const universityCount = new Set(courses.map((course) => course.university)).size;

  const openModal = (mode, course = null) => {
    setSelectedCourse(course);
    setModal(mode);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedCourse(null);
  };

  const handleSave = (form) => {
    if (modal === "add") {
      const nextId = Math.max(0, ...courses.map((course) => course.id)) + 1;
      setCourses((current) => [{ ...form, id: nextId }, ...current]);
    } else {
      setCourses((current) =>
        current.map((course) =>
          course.id === selectedCourse.id ? { ...course, ...form } : course
        )
      );
    }
    setCurrentPage(1);
    closeModal();
  };

  const handleDelete = (course) => {
    const confirmed = window.confirm(
      `Delete ${course.shortName} and its ${course.branches.length} branch entries from this demo catalogue?`
    );
    if (confirmed) {
      setCourses((current) => current.filter((item) => item.id !== course.id));
    }
  };

  const exportCSV = () => {
    const headers = [
      "Course Code",
      "Course Name",
      "Short Name",
      "Degree Type",
      "Duration Years",
      "Total Semesters",
      "Department",
      "University",
      "Affiliation Code",
      "Branches",
      "Status",
    ];

    const rows = filteredCourses.map((course) => [
      course.courseCode,
      course.courseName,
      course.shortName,
      course.degreeType,
      course.durationYears,
      course.totalSemesters,
      course.department,
      course.university,
      course.affiliationCode,
      course.branches.join("; "),
      course.status,
    ]);

    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "college-courses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setDegreeFilter("All");
    setUniversityFilter("All");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setCurrentPage(1);
  };

  const selectClass = "h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-600 outline-none focus:border-indigo-400";

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Courses & Branches</h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure academic programmes, branches and university affiliation details.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCSV} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <Download size={14} /> Export CSV
          </button>
          <button type="button" onClick={() => openModal("add")} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
            <Plus size={15} /> Add Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Total Courses", value: courses.length, icon: BookOpen, color: "bg-blue-50 text-blue-600" },
          { label: "Active Courses", value: activeCount, icon: GraduationCap, color: "bg-emerald-50 text-emerald-600" },
          { label: "Total Branches", value: branchCount, icon: GitBranch, color: "bg-violet-50 text-violet-600" },
          { label: "Universities Mapped", value: universityCount, icon: Building2, color: "bg-amber-50 text-amber-600" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-slate-500">{card.label}</p>
                <span className={`rounded-lg p-2 ${card.color}`}><Icon size={16} /></span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        <button type="button" onClick={() => setActiveTab("courses")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${activeTab === "courses" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
          Courses
        </button>
        <button type="button" onClick={() => setActiveTab("branches")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${activeTab === "branches" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
          Branches ({branchCount})
        </button>
      </div>

      {activeTab === "courses" ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Academic Programmes</h2>
                <p className="mt-1 text-[11px] text-slate-400">{filteredCourses.length} course records found</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 sm:w-60">
                  <Search size={14} className="text-slate-400" />
                  <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search course, branch, code..." className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" />
                </div>
                <select value={degreeFilter} onChange={(e) => { setDegreeFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                  <option value="All">All Degree Types</option>
                  {DEGREE_TYPES.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                  <option value="All">All Departments</option>
                  {DEPARTMENT_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select value={universityFilter} onChange={(e) => { setUniversityFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                  <option value="All">All Universities</option>
                  {UNIVERSITY_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                  <option value="All">All Status</option>
                  {COURSE_STATUSES.map((item) => <option key={item}>{item}</option>)}
                </select>
                <button type="button" onClick={resetFilters} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs text-slate-500 hover:bg-slate-50">
                  <RefreshCw size={13} /> Reset
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Degree Type</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Semesters</th>
                  <th className="px-4 py-3">Branches</th>
                  <th className="px-4 py-3">University</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleCourses.length ? visibleCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-slate-800">{course.shortName}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{course.courseCode} · {course.courseName}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{course.degreeType}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{course.department}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{course.durationYears} years</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{course.totalSemesters}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{course.branches.length}</td>
                    <td className="max-w-[180px] px-4 py-3 text-xs text-slate-600">{course.university}</td>
                    <td className="px-4 py-3"><StatusBadge status={course.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button type="button" title="View course" onClick={() => openModal("view", course)} className="rounded-md p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Eye size={15} /></button>
                        <button type="button" title="Edit course" onClick={() => openModal("edit", course)} className="rounded-md p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Pencil size={15} /></button>
                        <button type="button" title="Delete course" onClick={() => handleDelete(course)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-xs text-slate-400">No courses found. Try changing your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Rows per page</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px]">
                {[5, 8, 10, 20].map((size) => <option key={size}>{size}</option>)}
              </select>
              <span>Showing {filteredCourses.length ? pageStart + 1 : 0}–{Math.min(pageStart + pageSize, filteredCourses.length)} of {filteredCourses.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded-md border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40"><ChevronLeft size={15} /></button>
              <span className="px-2 text-[11px] text-slate-600">Page {safePage} of {totalPages}</span>
              <button type="button" disabled={safePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="rounded-md border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40"><ChevronRight size={15} /></button>
            </div>
          </div>
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Branch Directory</h2>
            <p className="mt-1 text-[11px] text-slate-400">Branches configured under your college courses.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Branch / Specialization</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">University</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allBranches.map((item, index) => (
                  <tr key={`${item.courseCode}-${item.branch}-${index}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{item.branch}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{item.course}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{item.department}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{item.university}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
                {!allBranches.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-xs text-slate-400">No branches configured.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-[11px] leading-5 text-blue-800">
        <Layers3 size={15} className="mt-0.5 shrink-0" />
        <p>University affiliation codes and course approvals are entered as sample references. This screen does not verify official university approvals or affiliation validity.</p>
      </div>

      {modal && (
        <CourseModal
          mode={modal}
          course={selectedCourse}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Courses;