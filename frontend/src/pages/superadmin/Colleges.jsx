
import { useMemo, useState } from "react";
import {
  Search, Plus, Download, Eye, Pencil, Power,
  Building2, Users, GraduationCap, Clock,
  ChevronLeft, ChevronRight, X, Filter,
} from "lucide-react";
import DataTable from "../../components/tables/DataTable";

const initialColleges = [
  { id: 1, name: "Institute of Technology and Management", code: "ITM001", university: "AKTU", state: "Uttar Pradesh", city: "Gorakhpur", students: 2400, status: "Active", email: "admin@itm.edu.in" },
  { id: 2, name: "ABC Institute of Technology", code: "ABC002", university: "AKTU", state: "Uttar Pradesh", city: "Lucknow", students: 1800, status: "Active", email: "admin@abc.edu.in" },
  { id: 3, name: "Northern Engineering College", code: "NEC003", university: "AKTU", state: "Uttar Pradesh", city: "Noida", students: 1200, status: "Pending", email: "admin@nec.edu.in" },
  { id: 4, name: "City College of Management", code: "CCM004", university: "CCSU", state: "Uttar Pradesh", city: "Meerut", students: 950, status: "Inactive", email: "admin@ccm.edu.in" },
  { id: 5, name: "Modern Institute of Science", code: "MIS005", university: "AKTU", state: "Delhi", city: "New Delhi", students: 1500, status: "Active", email: "admin@mis.edu.in" },
  { id: 6, name: "Gorakhpur Institute of Technology", code: "GIT006", university: "DDU", state: "Uttar Pradesh", city: "Gorakhpur", students: 800, status: "Pending", email: "admin@git.edu.in" },
  { id: 7, name: "National College of Engineering", code: "NCE007", university: "AKTU", state: "Uttar Pradesh", city: "Kanpur", students: 2100, status: "Active", email: "admin@nce.edu.in" },
  { id: 8, name: "Eastern Technical Institute", code: "ETI008", university: "DDU", state: "Bihar", city: "Patna", students: 650, status: "Inactive", email: "admin@eti.edu.in" },
];

const emptyForm = {
  name: "", code: "", university: "AKTU",
  state: "", city: "", email: "", students: 0,
  status: "Pending",
};

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Inactive: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function Colleges() {
  const [colleges, setColleges] = useState(initialColleges);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [universityFilter, setUniversityFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const pageSize = 6;

  const filtered = useMemo(() => {
    return colleges.filter((college) => {
      const query = search.toLowerCase();

      const matchesSearch =
        college.name.toLowerCase().includes(query) ||
        college.code.toLowerCase().includes(query) ||
        college.email.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (statusFilter === "All" || college.status === statusFilter) &&
        (universityFilter === "All" || college.university === universityFilter) &&
        (stateFilter === "All" || college.state === stateFilter)
      );
    });
  }, [colleges, search, statusFilter, universityFilter, stateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = [
    { label: "Total Colleges", value: colleges.length, icon: Building2, color: "text-blue-600 bg-blue-50" },
    { label: "Active", value: colleges.filter(c => c.status === "Active").length, icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending", value: colleges.filter(c => c.status === "Pending").length, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Total Students", value: colleges.reduce((sum, c) => sum + Number(c.students || 0), 0).toLocaleString("en-IN"), icon: Users, color: "text-violet-600 bg-violet-50" },
  ];

  const openAdd = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (college) => {
    setSelected(college);
    setForm({ ...college });
    setModal("form");
  };

  const saveCollege = (event) => {
    event.preventDefault();

    if (selected) {
      setColleges(prev => prev.map(c =>
        c.id === selected.id ? { ...c, ...form, students: Number(form.students) } : c
      ));
    } else {
      setColleges(prev => [
        { ...form, id: Date.now(), students: Number(form.students) },
        ...prev,
      ]);
    }

    setPage(1);
    setModal("");
  };

  const toggleStatus = (college) => {
    const nextStatus = college.status === "Active" ? "Inactive" : "Active";

    setColleges(prev => prev.map(c =>
      c.id === college.id ? { ...c, status: nextStatus } : c
    ));
  };

  const exportCSV = () => {
    const headers = ["College Name", "College Code", "University", "State", "City", "Students", "Status", "Email"];
    const rows = filtered.map(c => [
      c.name, c.code, c.university, c.state, c.city,
      c.students, c.status, c.email,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(value =>
        `"${String(value ?? "").replace(/"/g, '""')}"`
      ).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "colleges-directory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: "name",
      label: "College",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Building2 size={15} />
          </div>
          <div className="min-w-0">
            <p className="max-w-[230px] truncate font-semibold text-slate-800">{row.name}</p>
            <p className="text-[10px] text-slate-400">{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: "university", label: "University" },
    {
      key: "location",
      label: "Location",
      render: (row) => `${row.city}, ${row.state}`,
    },
    {
      key: "students",
      label: "Students",
      render: (row) => Number(row.students).toLocaleString("en-IN"),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button title="View details" onClick={() => { setSelected(row); setModal("view"); }}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
            <Eye size={14} />
          </button>
          <button title="Edit college" onClick={() => openEdit(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
            <Pencil size={14} />
          </button>
          <button title={row.status === "Active" ? "Deactivate" : "Activate"} onClick={() => toggleStatus(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100">
            <Power size={14} />
          </button>
        </div>
      ),
    },
  ];

  const inputClass = "mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50";

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Colleges</h1>
          <p className="mt-0.5 text-xs text-slate-500">Manage affiliated institutions across universities.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 font-medium text-slate-600 hover:bg-slate-50">
            <Download size={14} /> Export
          </button>
          <button onClick={openAdd} className="flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 font-medium text-white hover:bg-blue-700">
            <Plus size={14} /> Add College
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
              <Icon size={17} />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">{label}</p>
              <p className="mt-0.5 text-base font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3">
          <div className="flex flex-wrap gap-1">
            {["All", "Active", "Pending", "Inactive"].map(status => (
              <button key={status} onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${
                  statusFilter === status ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"
                }`}>
                {status}
                <span className="ml-1 text-[10px] opacity-70">
                  {status === "All" ? colleges.length : colleges.filter(c => c.status === status).length}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, code, email..."
              className="h-8 w-full rounded-md border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-blue-400" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-2">
          <Filter size={13} className="text-slate-400" />
          <select value={universityFilter} onChange={e => { setUniversityFilter(e.target.value); setPage(1); }}
            className="h-7 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600">
            <option value="All">All Universities</option>
            {["AKTU", "CCSU", "DDU"].map(v => <option key={v}>{v}</option>)}
          </select>
          <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }}
            className="h-7 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600">
            <option value="All">All States</option>
            {[...new Set(colleges.map(c => c.state))].sort().map(v => <option key={v}>{v}</option>)}
          </select>
          <button onClick={() => { setSearch(""); setStatusFilter("All"); setUniversityFilter("All"); setStateFilter("All"); setPage(1); }}
            className="ml-auto text-[11px] font-medium text-blue-600 hover:underline">
            Clear filters
          </button>
        </div>

        <DataTable columns={columns} data={visibleRows} getRowKey={row => row.id} />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-3 py-2.5">
          <p className="text-[11px] text-slate-500">
            Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} colleges
          </p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setPage(p => p - 1)}
              className="rounded border border-slate-200 p-1.5 text-slate-600 disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[11px] text-slate-600">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setPage(p => p + 1)}
              className="rounded border border-slate-200 p-1.5 text-slate-600 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-900">
                {modal === "view" ? "College Details" : selected ? "Edit College" : "Add College"}
              </h2>
              <button onClick={() => setModal("")} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                <X size={17} />
              </button>
            </div>

            {modal === "view" && selected ? (
              <div className="grid grid-cols-2 gap-4 p-4">
                {[
                  ["College Name", selected.name],
                  ["College Code", selected.code],
                  ["University", selected.university],
                  ["State", selected.state],
                  ["City", selected.city],
                  ["Students", Number(selected.students).toLocaleString("en-IN")],
                  ["Email", selected.email],
                  ["Status", selected.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
                  </div>
                ))}
                <div className="col-span-2 flex justify-end">
                  <button onClick={() => openEdit(selected)} className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                    Edit College
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveCollege} className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                <label className="sm:col-span-2">College Name
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </label>
                <label>College Code
                  <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className={inputClass} />
                </label>
                <label>University
                  <select value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} className={inputClass}>
                    {["AKTU", "CCSU", "DDU", "Other"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </label>
                <label>State
                  <input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className={inputClass} />
                </label>
                <label>City
                  <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} />
                </label>
                <label className="sm:col-span-2">Admin Email
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </label>
                <label>Student Count
                  <input type="number" min="0" value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} className={inputClass} />
                </label>
                <label>Status
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputClass}>
                    {["Pending", "Active", "Inactive"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </label>
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 sm:col-span-2">
                  <button type="button" onClick={() => setModal("")} className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600">Cancel</button>
                  <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white">Save College</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Colleges;