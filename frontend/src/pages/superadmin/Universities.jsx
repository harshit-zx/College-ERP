
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Power,
  University,
  Building2,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import DataTable from "../../components/tables/DataTable";

const initialUniversities = [
  {
    id: 1,
    name: "Dr. A.P.J. Abdul Kalam Technical University",
    code: "AKTU",
    shortName: "AKTU",
    state: "Uttar Pradesh",
    city: "Lucknow",
    colleges: 784,
    students: 125000,
    email: "registrar@aktu.ac.in",
    website: "https://aktu.ac.in",
    status: "Active",
  },
  {
    id: 2,
    name: "Deen Dayal Upadhyaya Gorakhpur University",
    code: "DDU",
    shortName: "DDU",
    state: "Uttar Pradesh",
    city: "Gorakhpur",
    colleges: 85,
    students: 42000,
    email: "info@ddugu.ac.in",
    website: "https://ddugu.ac.in",
    status: "Active",
  },
  {
    id: 3,
    name: "Chaudhary Charan Singh University",
    code: "CCSU",
    shortName: "CCSU",
    state: "Uttar Pradesh",
    city: "Meerut",
    colleges: 120,
    students: 65000,
    email: "registrar@ccsuniversity.ac.in",
    website: "https://ccsuniversity.ac.in",
    status: "Active",
  },
  {
    id: 4,
    name: "University of Lucknow",
    code: "LU",
    shortName: "LU",
    state: "Uttar Pradesh",
    city: "Lucknow",
    colleges: 35,
    students: 28000,
    email: "info@lkouniv.ac.in",
    website: "https://www.lkouniv.ac.in",
    status: "Pending",
  },
  {
    id: 5,
    name: "Mahatma Gandhi Kashi Vidyapith",
    code: "MGKV",
    shortName: "MGKV",
    state: "Uttar Pradesh",
    city: "Varanasi",
    colleges: 60,
    students: 31000,
    email: "info@mgkvp.ac.in",
    website: "https://mgkvp.ac.in",
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  code: "",
  shortName: "",
  state: "",
  city: "",
  colleges: 0,
  students: 0,
  email: "",
  website: "",
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

function Universities() {
  const [universities, setUniversities] = useState(initialUniversities);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const pageSize = 6;

  const filtered = useMemo(() => {
    return universities.filter((university) => {
      const query = search.toLowerCase();

      const matchesSearch =
        university.name.toLowerCase().includes(query) ||
        university.code.toLowerCase().includes(query) ||
        university.shortName.toLowerCase().includes(query) ||
        university.email.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (statusFilter === "All" || university.status === statusFilter) &&
        (stateFilter === "All" || university.state === stateFilter)
      );
    });
  }, [universities, search, statusFilter, stateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalColleges = universities.reduce(
    (sum, university) => sum + Number(university.colleges || 0),
    0
  );

  const stats = [
    {
      label: "Total Universities",
      value: universities.length,
      icon: University,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Universities",
      value: universities.filter((u) => u.status === "Active").length,
      icon: Building2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Affiliated Colleges",
      value: totalColleges.toLocaleString("en-IN"),
      icon: Building2,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total Students",
      value: universities
        .reduce((sum, u) => sum + Number(u.students || 0), 0)
        .toLocaleString("en-IN"),
      icon: Users,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const openAdd = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (university) => {
    setSelected(university);
    setForm({ ...university });
    setModal("form");
  };

  const saveUniversity = (event) => {
    event.preventDefault();

    const duplicate = universities.some(
      (u) =>
        u.code.toLowerCase() === form.code.trim().toLowerCase() &&
        u.id !== selected?.id
    );

    if (duplicate) {
      window.alert("This university code already exists.");
      return;
    }

    const updated = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      shortName: form.shortName.trim().toUpperCase(),
      colleges: Number(form.colleges || 0),
      students: Number(form.students || 0),
    };

    if (selected) {
      setUniversities((prev) =>
        prev.map((u) => (u.id === selected.id ? { ...u, ...updated } : u))
      );
    } else {
      setUniversities((prev) => [
        { ...updated, id: Date.now() },
        ...prev,
      ]);
    }

    setPage(1);
    setModal("");
  };

  const toggleStatus = (university) => {
    const nextStatus =
      university.status === "Active" ? "Inactive" : "Active";

    setUniversities((prev) =>
      prev.map((u) =>
        u.id === university.id ? { ...u, status: nextStatus } : u
      )
    );
  };

  const exportCSV = () => {
    const headers = [
      "University Name",
      "Code",
      "Short Name",
      "State",
      "City",
      "Affiliated Colleges",
      "Students",
      "Email",
      "Website",
      "Status",
    ];

    const rows = filtered.map((u) => [
      u.name,
      u.code,
      u.shortName,
      u.state,
      u.city,
      u.colleges,
      u.students,
      u.email,
      u.website,
      u.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "universities-directory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: "name",
      label: "University",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <University size={15} />
          </div>
          <div className="min-w-0">
            <p className="max-w-[260px] truncate font-semibold text-slate-800">
              {row.name}
            </p>
            <p className="text-[10px] text-slate-400">
              {row.shortName} · {row.code}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-slate-400" />
          {row.city}, {row.state}
        </span>
      ),
    },
    {
      key: "colleges",
      label: "Colleges",
      render: (row) => Number(row.colleges).toLocaleString("en-IN"),
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
          <button
            title="View details"
            onClick={() => {
              setSelected(row);
              setModal("view");
            }}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye size={14} />
          </button>

          <button
            title="Edit university"
            onClick={() => openEdit(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Pencil size={14} />
          </button>

          <button
            title={row.status === "Active" ? "Deactivate" : "Activate"}
            onClick={() => toggleStatus(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <Power size={14} />
          </button>
        </div>
      ),
    },
  ];

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50";

  return (
    <div className="space-y-4 text-xs">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Universities
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage universities and their affiliated institutions.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download size={14} />
            Export
          </button>

          <button
            onClick={openAdd}
            className="flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 font-medium text-white hover:bg-blue-700"
          >
            <Plus size={14} />
            Add University
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
            >
              <Icon size={17} />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">{label}</p>
              <p className="mt-0.5 text-base font-bold text-slate-900">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Directory */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3">
          <div className="flex flex-wrap gap-1">
            {["All", "Active", "Pending", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${
                  statusFilter === status
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {status}
                <span className="ml-1 text-[10px] opacity-70">
                  {status === "All"
                    ? universities.length
                    : universities.filter((u) => u.status === status).length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search
              size={14}
              className="absolute left-2.5 top-2.5 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search university, code, email..."
              className="h-8 w-full rounded-md border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-2">
          <Filter size={13} className="text-slate-400" />

          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600"
          >
            <option value="All">All States</option>
            {[...new Set(universities.map((u) => u.state))]
              .sort()
              .map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setStateFilter("All");
              setPage(1);
            }}
            className="ml-auto text-[11px] font-medium text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>

        <DataTable
          columns={columns}
          data={visibleRows}
          getRowKey={(row) => row.id}
        />

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-3 py-2.5">
          <p className="text-[11px] text-slate-500">
            Showing{" "}
            {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}
            –{Math.min(currentPage * pageSize, filtered.length)} of{" "}
            {filtered.length} universities
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-slate-200 p-1.5 text-slate-600 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="text-[11px] text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-slate-200 p-1.5 text-slate-600 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit / View modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-900">
                {modal === "view"
                  ? "University Details"
                  : selected
                    ? "Edit University"
                    : "Add University"}
              </h2>

              <button
                onClick={() => setModal("")}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            {modal === "view" && selected ? (
              <div className="grid grid-cols-2 gap-4 p-4">
                {[
                  ["University Name", selected.name],
                  ["University Code", selected.code],
                  ["Short Name", selected.shortName],
                  ["State", selected.state],
                  ["City", selected.city],
                  ["Affiliated Colleges", selected.colleges],
                  ["Students", Number(selected.students).toLocaleString("en-IN")],
                  ["Email", selected.email],
                  ["Website", selected.website],
                  ["Status", selected.status],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="mt-1 break-words font-medium text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}

                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => openEdit(selected)}
                    className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                  >
                    Edit University
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={saveUniversity}
                className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2"
              >
                <label className="sm:col-span-2">
                  University Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  University Code
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  Short Name
                  <input
                    required
                    value={form.shortName}
                    onChange={(e) =>
                      setForm({ ...form, shortName: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  State
                  <input
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  City
                  <input
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  Affiliated Colleges
                  <input
                    type="number"
                    min="0"
                    value={form.colleges}
                    onChange={(e) =>
                      setForm({ ...form, colleges: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label>
                  Student Count
                  <input
                    type="number"
                    min="0"
                    value={form.students}
                    onChange={(e) =>
                      setForm({ ...form, students: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="sm:col-span-2">
                  Official Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="sm:col-span-2">
                  Website
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    placeholder="https://example.edu.in"
                    className={inputClass}
                  />
                </label>

                <label className="sm:col-span-2">
                  Status
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className={inputClass}
                  >
                    {["Pending", "Active", "Inactive"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                  >
                    Save University
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Universities;