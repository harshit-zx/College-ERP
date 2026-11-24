
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  UserCheck,
  Clock3,
  FileCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { ACADEMIC_CATALOG } from "../../data/academicCatalog";

const ADMISSIONS_KEY = "college_erp_admissions_v1";
const STUDENTS_KEY = "college_erp_students_v1";

const INITIAL_APPLICANTS = [
  {
    id: 1,
    applicationNo: "APP-2026-001",
    name: "Riya Sharma",
    email: "riya.sharma@example.com",
    phone: "9876501001",
    gender: "Female",
    dateOfBirth: "2007-04-12",
    course: "B.Tech",
    branch: "Computer Science",
    session: "2026-27",
    applicationDate: "2026-06-12",
    qualification: "12th",
    previousMarks: 91.4,
    meritScore: 91.4,
    documents: {
      photo: "Verified",
      identity: "Verified",
      marksheet: "Verified",
      certificate: "Pending",
    },
    status: "Under Review",
    converted: false,
  },
  {
    id: 2,
    applicationNo: "APP-2026-002",
    name: "Aman Kumar",
    email: "aman.kumar@example.com",
    phone: "9876501002",
    gender: "Male",
    dateOfBirth: "2006-11-22",
    course: "B.Tech",
    branch: "Information Technology",
    session: "2026-27",
    applicationDate: "2026-06-15",
    qualification: "12th",
    previousMarks: 88.5,
    meritScore: 88.5,
    documents: {
      photo: "Verified",
      identity: "Verified",
      marksheet: "Verified",
      certificate: "Verified",
    },
    status: "Approved",
    converted: false,
  },
  {
    id: 3,
    applicationNo: "APP-2026-003",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "9876501003",
    gender: "Female",
    dateOfBirth: "2007-02-05",
    course: "BBA",
    branch: "Business Administration",
    session: "2026-27",
    applicationDate: "2026-06-18",
    qualification: "12th",
    previousMarks: 84.2,
    meritScore: 84.2,
    documents: {
      photo: "Verified",
      identity: "Pending",
      marksheet: "Verified",
      certificate: "Pending",
    },
    status: "Documents Pending",
    converted: false,
  },
  {
    id: 4,
    applicationNo: "APP-2026-004",
    name: "Rahul Singh",
    email: "rahul.singh@example.com",
    phone: "9876501004",
    gender: "Male",
    dateOfBirth: "2006-08-17",
    course: "B.Tech",
    branch: "Mechanical Engineering",
    session: "2026-27",
    applicationDate: "2026-06-20",
    qualification: "12th",
    previousMarks: 72.8,
    meritScore: 72.8,
    documents: {
      photo: "Verified",
      identity: "Verified",
      marksheet: "Verified",
      certificate: "Verified",
    },
    status: "Rejected",
    converted: false,
  },
  {
    id: 5,
    applicationNo: "APP-2026-005",
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    phone: "9876501005",
    gender: "Female",
    dateOfBirth: "2007-01-30",
    course: "B.Tech",
    branch: "Electronics & Communication",
    session: "2026-27",
    applicationDate: "2026-06-23",
    qualification: "12th",
    previousMarks: 95.1,
    meritScore: 95.1,
    documents: {
      photo: "Verified",
      identity: "Verified",
      marksheet: "Verified",
      certificate: "Verified",
    },
    status: "Approved",
    converted: true,
  },
  {
    id: 6,
    applicationNo: "APP-2026-006",
    name: "Vikas Yadav",
    email: "vikas.yadav@example.com",
    phone: "9876501006",
    gender: "Male",
    dateOfBirth: "2006-09-09",
    course: "MBA",
    branch: "Finance",
    session: "2026-27",
    applicationDate: "2026-06-25",
    qualification: "Graduation",
    previousMarks: 79.6,
    meritScore: 79.6,
    documents: {
      photo: "Verified",
      identity: "Pending",
      marksheet: "Verified",
      certificate: "Verified",
    },
    status: "Under Review",
    converted: false,
  },
];

const DOCUMENT_FIELDS = [
  { key: "photo", label: "Passport Photo" },
  { key: "identity", label: "Identity Proof" },
  { key: "marksheet", label: "Previous Marksheet" },
  { key: "certificate", label: "Transfer / Qualification Certificate" },
];

const APPLICATION_STATUSES = [
  "Submitted",
  "Under Review",
  "Documents Pending",
  "Approved",
  "Rejected",
];

const SESSIONS = ["2026-27", "2025-26", "2024-25"];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  course: "",
  branch: "",
  session: "2026-27",
  qualification: "12th",
  previousMarks: "",
  meritScore: "",
  applicationDate: new Date().toISOString().slice(0, 10),
  documents: {
    photo: "Pending",
    identity: "Pending",
    marksheet: "Pending",
    certificate: "Pending",
  },
  status: "Submitted",
};

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function StatusBadge({ status }) {
  const styles = {
    Submitted: "bg-blue-50 text-blue-700",
    "Under Review": "bg-violet-50 text-violet-700",
    "Documents Pending": "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function DocumentBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${
      status === "Verified"
        ? "bg-emerald-50 text-emerald-700"
        : status === "Rejected"
          ? "bg-red-50 text-red-700"
          : "bg-amber-50 text-amber-700"
    }`}>
      {status}
    </span>
  );
}

function AdmissionModal({ mode, applicant, onClose, onSave }) {
  const [form, setForm] = useState(
    applicant
      ? { ...applicant, documents: { ...applicant.documents } }
      : EMPTY_FORM
  );
  const [error, setError] = useState("");

  const isView = mode === "view";
  const isDocuments = mode === "documents";

  const activeCourses = ACADEMIC_CATALOG.filter(
    (course) => course.status === "Active"
  );

  const selectedCourse = activeCourses.find(
    (course) => course.shortName === form.course
  );

  const branches = selectedCourse?.branches || [];

  const inputClass =
    "mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 disabled:bg-slate-50";

  const labelClass = "text-[11px] font-medium text-slate-600";

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "course" ? { branch: "" } : {}),
    }));
    setError("");
  };

  const updateDocument = (key, value) => {
    setForm((current) => ({
      ...current,
      documents: { ...current.documents, [key]: value },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isDocuments) {
      onSave({ ...form, documents: form.documents });
      return;
    }

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.gender ||
      !form.dateOfBirth ||
      !form.course ||
      !form.branch ||
      !form.session ||
      !form.qualification ||
      form.previousMarks === ""
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

    const marks = Number(form.previousMarks);
    const merit = form.meritScore === "" ? marks : Number(form.meritScore);

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
      setError("Previous marks must be between 0 and 100.");
      return;
    }

    if (!Number.isFinite(merit) || merit < 0 || merit > 100) {
      setError("Merit score must be between 0 and 100.");
      return;
    }

    onSave({
      ...form,
      previousMarks: marks,
      meritScore: merit,
    });
  };

  const title = isDocuments
    ? "Document Verification"
    : mode === "add"
      ? "New Admission Application"
      : mode === "edit"
        ? "Edit Application"
        : "Applicant Details";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 sm:p-5">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {isDocuments
                ? "Update the verification status of each required document."
                : "Enter applicant, course and academic details."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            {applicant && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Application Number</label>
                <input value={applicant.applicationNo} disabled className={inputClass} />
              </div>
            )}

            {!isDocuments && (
              <>
                <div>
                  <label className={labelClass}>Applicant Full Name *</label>
                  <input value={form.name} disabled={isView} onChange={(e) => update("name", e.target.value)} placeholder="Enter full name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" value={form.email} disabled={isView} onChange={(e) => update("email", e.target.value)} placeholder="applicant@example.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input value={form.phone} disabled={isView} maxLength={10} onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select value={form.gender} disabled={isView} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" value={form.dateOfBirth} disabled={isView} onChange={(e) => update("dateOfBirth", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Academic Session *</label>
                  <select value={form.session} disabled={isView} onChange={(e) => update("session", e.target.value)} className={inputClass}>
                    {SESSIONS.map((session) => <option key={session}>{session}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Course *</label>
                  <select value={form.course} disabled={isView} onChange={(e) => update("course", e.target.value)} className={inputClass}>
                    <option value="">Select course</option>
                    {activeCourses.map((course) => <option key={course.id}>{course.shortName}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Branch *</label>
                  <select value={form.branch} disabled={isView || !form.course} onChange={(e) => update("branch", e.target.value)} className={inputClass}>
                    <option value="">Select branch</option>
                    {branches.map((branch) => <option key={branch}>{branch}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Previous Qualification *</label>
                  <select value={form.qualification} disabled={isView} onChange={(e) => update("qualification", e.target.value)} className={inputClass}>
                    {["10th", "12th", "Diploma", "Graduation", "Postgraduation", "Other"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Previous Marks (%) *</label>
                  <input type="number" min="0" max="100" step="0.01" value={form.previousMarks} disabled={isView} onChange={(e) => update("previousMarks", e.target.value)} placeholder="e.g. 85.50" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Merit Score (%)</label>
                  <input type="number" min="0" max="100" step="0.01" value={form.meritScore} disabled={isView} onChange={(e) => update("meritScore", e.target.value)} placeholder="Defaults to previous marks" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Application Date *</label>
                  <input type="date" value={form.applicationDate} disabled={isView} onChange={(e) => update("applicationDate", e.target.value)} className={inputClass} />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800">Required Documents</p>
                <span className="text-[10px] text-slate-400">Demo verification status</span>
              </div>
              <div className="space-y-2">
                {DOCUMENT_FIELDS.map((document) => (
                  <div key={document.key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-slate-400" />
                      <span className="text-xs text-slate-700">{document.label}</span>
                    </div>
                    {isView ? (
                      <DocumentBadge status={form.documents?.[document.key] || "Pending"} />
                    ) : (
                      <select
                        value={form.documents?.[document.key] || "Pending"}
                        onChange={(e) => updateDocument(document.key, e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-[11px] outline-none"
                      >
                        {["Pending", "Verified", "Rejected"].map((status) => <option key={status}>{status}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!isDocuments && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Application Status</label>
                <select value={form.status} disabled={isView} onChange={(e) => update("status", e.target.value)} className={inputClass}>
                  {APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
            )}
          </div>

          {error && <p className="mx-5 mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
              {isView ? "Close" : "Cancel"}
            </button>
            {!isView && (
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                {isDocuments ? "Save Verification" : mode === "add" ? "Submit Application" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Admissions() {
  const [applicants, setApplicants] = useState(() =>
    readStorage(ADMISSIONS_KEY, INITIAL_APPLICANTS)
  );
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modal, setModal] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [activeTab, setActiveTab] = useState("applications");
  const [notice, setNotice] = useState("");

  const saveApplicants = (next) => {
    setApplicants(next);
    localStorage.setItem(ADMISSIONS_KEY, JSON.stringify(next));
  };

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applicants.filter((applicant) => {
      const matchesSearch =
        !query ||
        applicant.name.toLowerCase().includes(query) ||
        applicant.applicationNo.toLowerCase().includes(query) ||
        applicant.email.toLowerCase().includes(query) ||
        applicant.phone.includes(query);

      return (
        matchesSearch &&
        (courseFilter === "All" || applicant.course === courseFilter) &&
        (sessionFilter === "All" || applicant.session === sessionFilter) &&
        (statusFilter === "All" || applicant.status === statusFilter)
      );
    });
  }, [applicants, search, courseFilter, sessionFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const visibleApplicants = filteredApplicants.slice(pageStart, pageStart + pageSize);

  const counts = {
    total: applicants.length,
    pending: applicants.filter((item) => ["Submitted", "Under Review", "Documents Pending"].includes(item.status)).length,
    approved: applicants.filter((item) => item.status === "Approved").length,
    converted: applicants.filter((item) => item.converted).length,
  };

  const openModal = (mode, applicant = null) => {
    setSelectedApplicant(applicant);
    setModal(mode);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedApplicant(null);
  };

  const nextApplicationNumber = () => {
    const year = new Date().getFullYear();
    const nextId = Math.max(0, ...applicants.map((item) => item.id)) + 1;
    return `APP-${year}-${String(nextId).padStart(3, "0")}`;
  };

  const handleSave = (form) => {
    let next;

    if (modal === "add") {
      const id = Math.max(0, ...applicants.map((item) => item.id)) + 1;
      next = [
        {
          ...form,
          id,
          applicationNo: nextApplicationNumber(),
          converted: false,
        },
        ...applicants,
      ];
    } else {
      next = applicants.map((item) =>
        item.id === selectedApplicant.id ? { ...item, ...form } : item
      );
    }

    saveApplicants(next);
    closeModal();
    setNotice("Application saved successfully.");
  };

  const updateStatus = (applicant, status) => {
    if (status === "Approved") {
      const allVerified = DOCUMENT_FIELDS.every(
        (document) => applicant.documents?.[document.key] === "Verified"
      );

      if (!allVerified) {
        setNotice("Verify all required documents before approving this application.");
        return;
      }
    }

    const next = applicants.map((item) =>
      item.id === applicant.id ? { ...item, status } : item
    );
    saveApplicants(next);
    setNotice(`Application ${status.toLowerCase()}.`);
  };

  const convertToStudent = (applicant) => {
    if (applicant.status !== "Approved") {
      setNotice("Only approved applications can be converted.");
      return;
    }

    if (applicant.converted) {
      setNotice("This applicant has already been converted.");
      return;
    }

    const allVerified = DOCUMENT_FIELDS.every(
      (document) => applicant.documents?.[document.key] === "Verified"
    );

    if (!allVerified) {
      setNotice("All required documents must be verified before conversion.");
      return;
    }

    const existingStudents = readStorage(STUDENTS_KEY, []);
    const duplicate = existingStudents.some(
      (student) =>
        student.email.toLowerCase() === applicant.email.toLowerCase() ||
        student.phone === applicant.phone
    );

    if (duplicate) {
      setNotice("A student with this email or phone already exists. Check Student Management.");
      return;
    }

    const nextId =
      Math.max(0, ...existingStudents.map((student) => Number(student.id) || 0)) + 1;

    const year = applicant.session.slice(0, 4);
    const enrollmentNo = `ERP${year}${String(nextId).padStart(3, "0")}`;

    const student = {
      id: nextId,
      enrollmentNo,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      gender: applicant.gender,
      course: applicant.course,
      branch: applicant.branch,
      semester: "1",
      session: applicant.session,
      admissionDate: applicant.applicationDate,
      status: "Active",
    };

    localStorage.setItem(
      STUDENTS_KEY,
      JSON.stringify([student, ...existingStudents])
    );

    const nextApplicants = applicants.map((item) =>
      item.id === applicant.id ? { ...item, converted: true } : item
    );

    saveApplicants(nextApplicants);
    setNotice(`Applicant converted to student. Enrollment number: ${enrollmentNo}`);
  };

  const handleDelete = (applicant) => {
    if (applicant.converted) {
      setNotice("This application has been converted. It cannot be deleted from this demo screen.");
      return;
    }

    if (!window.confirm(`Delete application ${applicant.applicationNo}?`)) return;

    saveApplicants(applicants.filter((item) => item.id !== applicant.id));
    setNotice("Application deleted.");
  };

  const exportCSV = () => {
    const headers = [
      "Application Number",
      "Applicant Name",
      "Email",
      "Phone",
      "Course",
      "Branch",
      "Session",
      "Previous Marks",
      "Merit Score",
      "Application Date",
      "Status",
      "Converted",
      ...DOCUMENT_FIELDS.map((item) => item.label),
    ];

    const rows = filteredApplicants.map((item) => [
      item.applicationNo,
      item.name,
      item.email,
      item.phone,
      item.course,
      item.branch,
      item.session,
      item.previousMarks,
      item.meritScore,
      item.applicationDate,
      item.status,
      item.converted ? "Yes" : "No",
      ...DOCUMENT_FIELDS.map((document) => item.documents?.[document.key] || "Pending"),
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
    link.download = "college-admissions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setCourseFilter("All");
    setSessionFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const rankedApplicants = [...filteredApplicants].sort(
    (a, b) => Number(b.meritScore || 0) - Number(a.meritScore || 0)
  );

  const selectClass =
    "h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-600 outline-none focus:border-indigo-400";

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Admissions Management</h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage applications, verify documents and enroll approved applicants.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCSV} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <Download size={14} /> Export CSV
          </button>
          <button type="button" onClick={() => openModal("add")} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
            <Plus size={15} /> New Application
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs text-blue-800">
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{notice}</span>
          </div>
          <button type="button" onClick={() => setNotice("")} className="text-blue-500 hover:text-blue-800">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Total Applications", value: counts.total, icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
          { label: "Pending Review", value: counts.pending, icon: Clock3, color: "bg-amber-50 text-amber-600" },
          { label: "Approved", value: counts.approved, icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
          { label: "Converted to Students", value: counts.converted, icon: GraduationCap, color: "bg-violet-50 text-violet-600" },
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
        <button type="button" onClick={() => setActiveTab("applications")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${activeTab === "applications" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500"}`}>
          Applications
        </button>
        <button type="button" onClick={() => setActiveTab("merit")} className={`border-b-2 px-4 py-2.5 text-xs font-semibold ${activeTab === "merit" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500"}`}>
          Merit List
        </button>
      </div>

      {activeTab === "applications" ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Applicant Directory</h2>
                <p className="mt-1 text-[11px] text-slate-400">{filteredApplicants.length} application records found</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 sm:w-60">
                  <Search size={14} className="text-slate-400" />
                  <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search applicant, application no..." className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" />
                </div>
                <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                  <option value="All">All Courses</option>
                  {[...new Set(applicants.map((item) => item.course))].map((course) => <option key={course}>{course}</option>)}
                </select>
                <select value={sessionFilter} onChange={(e) => { setSessionFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                  <option value="All">All Sessions</option>
                  {SESSIONS.map((session) => <option key={session}>{session}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                  <option value="All">All Status</option>
                  {APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
                <button type="button" onClick={resetFilters} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs text-slate-500 hover:bg-slate-50">
                  <RefreshCw size={13} /> Reset
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Application No.</th>
                  <th className="px-4 py-3">Course / Branch</th>
                  <th className="px-4 py-3">Merit Score</th>
                  <th className="px-4 py-3">Documents</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Enrollment</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleApplicants.length ? visibleApplicants.map((item) => {
                  const verifiedCount = DOCUMENT_FIELDS.filter(
                    (document) => item.documents?.[document.key] === "Verified"
                  ).length;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{item.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-600">{item.applicationNo}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-700">{item.course}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{item.branch}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{Number(item.meritScore || 0).toFixed(2)}%</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{verifiedCount}/{DOCUMENT_FIELDS.length} verified</td>
                      <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-3">
                        {item.converted
                          ? <span className="text-[10px] font-semibold text-emerald-700">Converted</span>
                          : <span className="text-[10px] text-slate-400">Not enrolled</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" title="View application" onClick={() => openModal("view", item)} className="rounded-md p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Eye size={15} /></button>
                          <button type="button" title="Edit application" onClick={() => openModal("edit", item)} className="rounded-md p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><Pencil size={15} /></button>
                          <button type="button" title="Verify documents" onClick={() => openModal("documents", item)} className="rounded-md p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600"><FileCheck size={15} /></button>
                          <button type="button" title="Delete application" onClick={() => handleDelete(item)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-xs text-slate-400">No applications found. Try changing your filters.</td></tr>
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
              <span>Showing {filteredApplicants.length ? pageStart + 1 : 0}–{Math.min(pageStart + pageSize, filteredApplicants.length)} of {filteredApplicants.length}</span>
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
            <h2 className="text-sm font-semibold text-slate-900">Merit List</h2>
            <p className="mt-1 text-[11px] text-slate-400">Applicants ranked by the merit score recorded in their applications.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Previous Marks</th>
                  <th className="px-4 py-3">Merit Score</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankedApplicants.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">#{index + 1}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.applicationNo}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{item.course} · {item.branch}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{Number(item.previousMarks || 0).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-xs font-bold text-indigo-700">{Number(item.meritScore || 0).toFixed(2)}%</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
                {!rankedApplicants.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-xs text-slate-400">No merit records found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-2">
          <FileCheck size={16} className="mt-0.5 text-indigo-600" />
          <div>
            <h3 className="text-xs font-semibold text-slate-800">Admission workflow</h3>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Submit application → Verify all four required documents → Approve application → Convert approved applicant into a student record.
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Merit ranks are calculated from the entered merit score. This demo does not apply official university admission rules or reservation criteria.
            </p>
          </div>
        </div>
      </section>

      {modal && (
        <AdmissionModal
          mode={modal}
          applicant={selectedApplicant}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {activeTab === "applications" && (
        <div className="sr-only">
          <ArrowRight />
          <XCircle />
          <CheckCircle2 />
        </div>
      )}
    </div>
  );
}

export default Admissions;