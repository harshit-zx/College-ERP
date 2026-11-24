
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
  UserCheck,
  UserX,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  GraduationCap,
} from "lucide-react";

const INITIAL_FACULTY = [
  {
    id: 1,
    employeeId: "FAC-2026-001",
    name: "Dr. Amit Verma",
    email: "amit.verma@example.com",
    phone: "9876500001",
    department: "Computer Science",
    designation: "Professor",
    qualification: "Ph.D.",
    specialization: "Artificial Intelligence",
    joiningDate: "2020-07-15",
    employmentType: "Permanent",
    status: "Active",
  },
  {
    id: 2,
    employeeId: "FAC-2026-002",
    name: "Dr. Neha Singh",
    email: "neha.singh@example.com",
    phone: "9876500002",
    department: "Electronics & Communication",
    designation: "Associate Professor",
    qualification: "Ph.D.",
    specialization: "Embedded Systems",
    joiningDate: "2021-08-10",
    employmentType: "Permanent",
    status: "Active",
  },
  {
    id: 3,
    employeeId: "FAC-2026-003",
    name: "Rahul Mishra",
    email: "rahul.mishra@example.com",
    phone: "9876500003",
    department: "Computer Science",
    designation: "Assistant Professor",
    qualification: "M.Tech",
    specialization: "Data Structures",
    joiningDate: "2023-01-09",
    employmentType: "Permanent",
    status: "Active",
  },
  {
    id: 4,
    employeeId: "FAC-2026-004",
    name: "Priya Gupta",
    email: "priya.gupta@example.com",
    phone: "9876500004",
    department: "Management",
    designation: "Assistant Professor",
    qualification: "MBA",
    specialization: "Marketing",
    joiningDate: "2022-06-20",
    employmentType: "Contract",
    status: "On Leave",
  },
  {
    id: 5,
    employeeId: "FAC-2026-005",
    name: "Sandeep Kumar",
    email: "sandeep.kumar@example.com",
    phone: "9876500005",
    department: "Mechanical Engineering",
    designation: "Associate Professor",
    qualification: "M.Tech",
    specialization: "Thermal Engineering",
    joiningDate: "2019-08-12",
    employmentType: "Permanent",
    status: "Active",
  },
  {
    id: 6,
    employeeId: "FAC-2026-006",
    name: "Anjali Yadav",
    email: "anjali.yadav@example.com",
    phone: "9876500006",
    department: "Information Technology",
    designation: "Assistant Professor",
    qualification: "M.Tech",
    specialization: "Cyber Security",
    joiningDate: "2024-02-01",
    employmentType: "Contract",
    status: "Active",
  },
  {
    id: 7,
    employeeId: "FAC-2026-007",
    name: "Dr. Manoj Tiwari",
    email: "manoj.tiwari@example.com",
    phone: "9876500007",
    department: "Civil Engineering",
    designation: "Professor",
    qualification: "Ph.D.",
    specialization: "Structural Engineering",
    joiningDate: "2018-07-02",
    employmentType: "Permanent",
    status: "Inactive",
  },
  {
    id: 8,
    employeeId: "FAC-2026-008",
    name: "Pooja Sharma",
    email: "pooja.sharma@example.com",
    phone: "9876500008",
    department: "Computer Science",
    designation: "Lecturer",
    qualification: "MCA",
    specialization: "Web Development",
    joiningDate: "2025-07-01",
    employmentType: "Visiting",
    status: "Active",
  },
  {
    id: 9,
    employeeId: "FAC-2026-009",
    name: "Vikas Patel",
    email: "vikas.patel@example.com",
    phone: "9876500009",
    department: "Electrical Engineering",
    designation: "Assistant Professor",
    qualification: "M.Tech",
    specialization: "Power Systems",
    joiningDate: "2022-11-14",
    employmentType: "Permanent",
    status: "Resigned",
  },
  {
    id: 10,
    employeeId: "FAC-2026-010",
    name: "Simran Kaur",
    email: "simran.kaur@example.com",
    phone: "9876500010",
    department: "Management",
    designation: "Lecturer",
    qualification: "MBA",
    specialization: "Human Resources",
    joiningDate: "2025-08-18",
    employmentType: "Contract",
    status: "Active",
  },
];

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Management",
  "Mathematics",
  "Physics",
];

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "HOD",
  "Lab Instructor",
];

const QUALIFICATIONS = [
  "Ph.D.",
  "M.Tech",
  "M.E.",
  "MCA",
  "MBA",
  "M.Sc.",
  "B.Tech",
  "Other",
];

const STATUSES = ["Active", "Inactive", "On Leave", "Resigned"];
const EMPLOYMENT_TYPES = ["Permanent", "Contract", "Visiting"];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  qualification: "",
  specialization: "",
  joiningDate: "",
  employmentType: "Permanent",
  status: "Active",
};

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
  "On Leave": "bg-amber-50 text-amber-700",
  Resigned: "bg-red-50 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function FacultyModal({ mode, faculty, onClose, onSave }) {
  const [form, setForm] = useState(faculty || EMPTY_FORM);
  const [error, setError] = useState("");

  const isView = mode === "view";

  const inputClass =
    "mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 disabled:bg-slate-50";

  const labelClass = "text-[11px] font-medium text-slate-600";

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.department ||
      !form.designation ||
      !form.qualification ||
      !form.joiningDate ||
      !form.employmentType ||
      !form.status
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

  const field = (label, name, options, required = false) => (
    <div>
      <label className={labelClass}>
        {label}{required ? " *" : ""}
      </label>
      <select
        value={form[name]}
        disabled={isView}
        onChange={(e) => updateField(name, e.target.value)}
        className={inputClass}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 sm:p-5">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {mode === "add"
                ? "Add Faculty Member"
                : mode === "edit"
                  ? "Edit Faculty Details"
                  : "Faculty Details"}
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {mode === "add"
                ? "Enter employee and professional information."
                : mode === "edit"
                  ? "Update faculty member information."
                  : "Review the faculty member's profile."}
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
                <label className={labelClass}>Employee ID</label>
                <input
                  value={faculty?.employeeId || ""}
                  disabled
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                value={form.name}
                disabled={isView}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter faculty name"
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
                placeholder="faculty@example.com"
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

            {field("Department", "department", DEPARTMENTS, true)}
            {field("Designation", "designation", DESIGNATIONS, true)}
            {field("Qualification", "qualification", QUALIFICATIONS, true)}

            <div>
              <label className={labelClass}>Specialization</label>
              <input
                value={form.specialization}
                disabled={isView}
                onChange={(e) => updateField("specialization", e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Joining Date *</label>
              <input
                type="date"
                value={form.joiningDate}
                disabled={isView}
                onChange={(e) => updateField("joiningDate", e.target.value)}
                className={inputClass}
              />
            </div>

            {field("Employment Type", "employmentType", EMPLOYMENT_TYPES, true)}
            {field("Employment Status", "status", STATUSES, true)}
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
                {mode === "add" ? "Add Faculty" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Faculty() {
  const [faculty, setFaculty] = useState(INITIAL_FACULTY);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [employmentFilter, setEmploymentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modal, setModal] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const filteredFaculty = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faculty.filter((person) => {
      const matchesSearch =
        !query ||
        person.name.toLowerCase().includes(query) ||
        person.employeeId.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query) ||
        person.phone.includes(query) ||
        person.specialization.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (departmentFilter === "All" || person.department === departmentFilter) &&
        (designationFilter === "All" || person.designation === designationFilter) &&
        (statusFilter === "All" || person.status === statusFilter) &&
        (employmentFilter === "All" || person.employmentType === employmentFilter)
      );
    });
  }, [
    faculty,
    search,
    departmentFilter,
    designationFilter,
    statusFilter,
    employmentFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredFaculty.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const visibleFaculty = filteredFaculty.slice(pageStart, pageStart + pageSize);

  const activeCount = faculty.filter((person) => person.status === "Active").length;
  const onLeaveCount = faculty.filter((person) => person.status === "On Leave").length;
  const inactiveCount = faculty.filter((person) =>
    ["Inactive", "Resigned"].includes(person.status)
  ).length;

  const openModal = (mode, person = null) => {
    setSelectedFaculty(person);
    setModal(mode);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedFaculty(null);
  };

  const handleSave = (form) => {
    if (modal === "add") {
      const nextId = Math.max(0, ...faculty.map((person) => person.id)) + 1;
      const employeeId = `FAC-2026-${String(nextId).padStart(3, "0")}`;

      setFaculty((current) => [
        { ...form, id: nextId, employeeId },
        ...current,
      ]);
      setCurrentPage(1);
    } else {
      setFaculty((current) =>
        current.map((person) =>
          person.id === selectedFaculty.id
            ? { ...person, ...form }
            : person
        )
      );
    }

    closeModal();
  };

  const handleDelete = (person) => {
    const confirmed = window.confirm(
      `Delete ${person.name} (${person.employeeId})?`
    );

    if (confirmed) {
      setFaculty((current) =>
        current.filter((item) => item.id !== person.id)
      );
    }
  };

  const exportCSV = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Email",
      "Phone",
      "Department",
      "Designation",
      "Qualification",
      "Specialization",
      "Joining Date",
      "Employment Type",
      "Status",
    ];

    const rows = filteredFaculty.map((person) => [
      person.employeeId,
      person.name,
      person.email,
      person.phone,
      person.department,
      person.designation,
      person.qualification,
      person.specialization,
      person.joiningDate,
      person.employmentType,
      person.status,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "college-faculty.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setDepartmentFilter("All");
    setDesignationFilter("All");
    setStatusFilter("All");
    setEmploymentFilter("All");
    setCurrentPage(1);
  };

  const selectClass =
    "h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-600 outline-none focus:border-indigo-400";

  const summaryCards = [
    {
      label: "Total Faculty",
      value: faculty.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Faculty",
      value: activeCount,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "On Leave",
      value: onLeaveCount,
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Inactive / Resigned",
      value: inactiveCount,
      icon: UserX,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Faculty Management</h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage faculty profiles, departments and employment details.
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
            <Plus size={15} /> Add Faculty
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
                Faculty Directory
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                {filteredFaculty.length} faculty record
                {filteredFaculty.length === 1 ? "" : "s"} found
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
                  placeholder="Search name, ID, email..."
                  className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                value={designationFilter}
                onChange={(e) => {
                  setDesignationFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="All">All Designations</option>
                {DESIGNATIONS.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
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
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={employmentFilter}
                onChange={(e) => {
                  setEmploymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
              >
                <option value="All">All Employment Types</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Faculty Member</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Joining Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleFaculty.length > 0 ? (
                visibleFaculty.map((person) => (
                  <tr key={person.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[11px] font-bold text-violet-700">
                          {person.name
                            .split(" ")
                            .filter((part) => !["Dr.", "Prof."].includes(part))
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {person.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {person.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-600">
                      {person.employeeId}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {person.department}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {person.designation}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {person.qualification}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {new Date(`${person.joiningDate}T00:00:00`).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={person.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="View faculty"
                          onClick={() => openModal("view", person)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          title="Edit faculty"
                          onClick={() => openModal("edit", person)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          title="Delete faculty"
                          onClick={() => handleDelete(person)}
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
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Filter size={22} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-xs font-medium text-slate-600">
                      No faculty records found
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
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>
              Showing {filteredFaculty.length ? pageStart + 1 : 0}–
              {Math.min(pageStart + pageSize, filteredFaculty.length)} of{" "}
              {filteredFaculty.length}
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
        <FacultyModal
          mode={modal}
          faculty={selectedFaculty}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Faculty;