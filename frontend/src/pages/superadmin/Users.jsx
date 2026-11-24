
import { useMemo, useState } from "react";
import {
  Search, Plus, Download, Eye, Pencil, Power, Users,
  ShieldCheck, GraduationCap, Building2, X,
  ChevronLeft, ChevronRight, Filter, UserRound,
} from "lucide-react";
import DataTable from "../../components/tables/DataTable";

const initialUsers = [
  {
    id: 1,
    name: "Harshit Maurya",
    email: "harshit@example.com",
    role: "Super Admin",
    university: "All Universities",
    college: "All Colleges",
    status: "Active",
    permissions: ["Dashboard", "Universities", "Colleges", "Users", "Subscriptions", "Analytics", "Settings"],
    lastLogin: "2026-11-24",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@aktu.ac.in",
    role: "University Admin",
    university: "AKTU",
    college: "—",
    status: "Active",
    permissions: ["Dashboard", "Colleges", "Users", "Analytics"],
    lastLogin: "2026-11-23",
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@itm.edu.in",
    role: "College Admin",
    university: "AKTU",
    college: "Institute of Technology and Management",
    status: "Active",
    permissions: ["Dashboard", "Students", "Faculty", "Courses", "Reports"],
    lastLogin: "2026-11-22",
  },
  {
    id: 4,
    name: "Amit Verma",
    email: "amit@itm.edu.in",
    role: "Faculty",
    university: "AKTU",
    college: "Institute of Technology and Management",
    status: "Active",
    permissions: ["Dashboard", "My Classes", "Attendance", "Assignments"],
    lastLogin: "2026-11-21",
  },
  {
    id: 5,
    name: "Neha Gupta",
    email: "neha@itm.edu.in",
    role: "Student",
    university: "AKTU",
    college: "Institute of Technology and Management",
    status: "Pending",
    permissions: ["Dashboard", "My Courses", "Attendance", "Results"],
    lastLogin: "—",
  },
  {
    id: 6,
    name: "Sandeep Kumar",
    email: "sandeep@ddugu.ac.in",
    role: "University Admin",
    university: "DDU",
    college: "—",
    status: "Inactive",
    permissions: ["Dashboard", "Colleges", "Users"],
    lastLogin: "2026-10-18",
  },
  {
    id: 7,
    name: "Pooja Yadav",
    email: "pooja@abc.edu.in",
    role: "College Admin",
    university: "AKTU",
    college: "ABC Institute of Technology",
    status: "Active",
    permissions: ["Dashboard", "Students", "Faculty", "Courses"],
    lastLogin: "2026-11-20",
  },
  {
    id: 8,
    name: "Vikas Mishra",
    email: "vikas@abc.edu.in",
    role: "Faculty",
    university: "AKTU",
    college: "ABC Institute of Technology",
    status: "Active",
    permissions: ["Dashboard", "My Classes", "Attendance"],
    lastLogin: "2026-11-19",
  },
];

const roleOptions = [
  "Super Admin",
  "University Admin",
  "College Admin",
  "Faculty",
  "Student",
];

const permissionOptions = [
  "Dashboard",
  "Universities",
  "Colleges",
  "Users",
  "Subscriptions",
  "Analytics",
  "Settings",
  "Students",
  "Faculty",
  "Courses",
  "My Classes",
  "Attendance",
  "Assignments",
  "My Courses",
  "Results",
  "Reports",
];

const emptyForm = {
  name: "",
  email: "",
  role: "College Admin",
  university: "",
  college: "",
  status: "Pending",
  permissions: ["Dashboard"],
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

function RoleBadge({ role }) {
  const styles = {
    "Super Admin": "bg-violet-50 text-violet-700",
    "University Admin": "bg-blue-50 text-blue-700",
    "College Admin": "bg-cyan-50 text-cyan-700",
    Faculty: "bg-amber-50 text-amber-700",
    Student: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${styles[role] || "bg-slate-100 text-slate-600"}`}>
      {role}
    </span>
  );
}

function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const pageSize = 6;

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.university.toLowerCase().includes(query) ||
        user.college.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (roleFilter === "All" || user.role === roleFilter) &&
        (statusFilter === "All" || user.status === statusFilter)
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "Active").length,
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "College Admins",
      value: users.filter((u) => u.role === "College Admin").length,
      icon: Building2,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Students & Faculty",
      value: users.filter((u) => ["Student", "Faculty"].includes(u.role)).length,
      icon: GraduationCap,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const openAdd = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (user) => {
    setSelected(user);
    setForm({ ...user, permissions: [...user.permissions] });
    setModal("form");
  };

  const saveUser = (event) => {
    event.preventDefault();

    const duplicate = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() &&
        user.id !== selected?.id
    );

    if (duplicate) {
      window.alert("A user with this email already exists.");
      return;
    }

    if (
      ["University Admin", "College Admin", "Faculty", "Student"].includes(form.role) &&
      !form.university
    ) {
      window.alert("Please select a university.");
      return;
    }

    if (
      ["College Admin", "Faculty", "Student"].includes(form.role) &&
      !form.college
    ) {
      window.alert("Please select a college.");
      return;
    }

    const updated = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      university: form.role === "Super Admin" ? "All Universities" : form.university,
      college: form.role === "Super Admin" ? "All Colleges" :
        form.role === "University Admin" ? "—" : form.college,
    };

    if (selected) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selected.id ? { ...user, ...updated } : user
        )
      );
    } else {
      setUsers((prev) => [
        { ...updated, id: Date.now(), lastLogin: "—" },
        ...prev,
      ]);
    }

    setPage(1);
    setModal("");
  };

  const toggleStatus = (user) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  const togglePermission = (permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((item) => item !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Role",
      "University",
      "College",
      "Status",
      "Last Login",
      "Permissions",
    ];

    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.role,
      user.university,
      user.college,
      user.status,
      user.lastLogin,
      user.permissions.join("; "),
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
    link.download = "platform-users.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <UserRound size={15} />
          </div>
          <div className="min-w-0">
            <p className="max-w-[180px] truncate font-semibold text-slate-800">
              {row.name}
            </p>
            <p className="max-w-[190px] truncate text-[10px] text-slate-400">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: "university",
      label: "University",
      render: (row) => (
        <span className="max-w-[130px] truncate">{row.university}</span>
      ),
    },
    {
      key: "college",
      label: "College",
      render: (row) => (
        <span className="block max-w-[160px] truncate">{row.college}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "lastLogin",
      label: "Last Login",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            title="View user"
            onClick={() => {
              setSelected(row);
              setModal("view");
            }}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye size={14} />
          </button>

          <button
            title="Edit user"
            onClick={() => openEdit(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Pencil size={14} />
          </button>

          <button
            title={row.status === "Active" ? "Deactivate user" : "Activate user"}
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

  const needsUniversity = form.role !== "Super Admin";
  const needsCollege = ["College Admin", "Faculty", "Student"].includes(form.role);

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">User Management</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage platform users, roles, access and institution associations.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={openAdd}
            className="flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 font-medium text-white hover:bg-blue-700"
          >
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
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

      {/* User directory */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Platform Users</h2>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Search and manage user accounts
            </p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, college..."
              className="h-8 w-full rounded-md border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-2">
          <Filter size={13} className="text-slate-400" />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600"
          >
            <option value="All">All Roles</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setRoleFilter("All");
              setStatusFilter("All");
              setPage(1);
            }}
            className="ml-auto text-[11px] font-medium text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>

        <DataTable
          columns={columns}
          data={visibleUsers}
          getRowKey={(row) => row.id}
        />

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-3 py-2.5">
          <p className="text-[11px] text-slate-500">
            Showing {filteredUsers.length ? (currentPage - 1) * pageSize + 1 : 0}
            –{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
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

      {/* Add / Edit User Modal */}
      {modal === "form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-900">
                {selected ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={() => setModal("")}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={saveUser} className="space-y-4 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>
                  Full Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </label>

                <label>
                  Email Address
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="name@example.com"
                  />
                </label>

                <label className="sm:col-span-2">
                  User Role
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role: e.target.value,
                        university: "",
                        college: "",
                      })
                    }
                    className={inputClass}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </label>

                {needsUniversity && (
                  <label className="sm:col-span-2">
                    University Association
                    <select
                      required
                      value={form.university}
                      onChange={(e) =>
                        setForm({ ...form, university: e.target.value, college: "" })
                      }
                      className={inputClass}
                    >
                      <option value="">Select University</option>
                      <option value="AKTU">Dr. A.P.J. Abdul Kalam Technical University (AKTU)</option>
                      <option value="DDU">Deen Dayal Upadhyaya Gorakhpur University (DDU)</option>
                      <option value="CCSU">Chaudhary Charan Singh University (CCSU)</option>
                      <option value="LU">University of Lucknow (LU)</option>
                    </select>
                  </label>
                )}

                {needsCollege && (
                  <label className="sm:col-span-2">
                    College Association
                    <select
                      required
                      value={form.college}
                      onChange={(e) => setForm({ ...form, college: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select College</option>
                      <option value="Institute of Technology and Management">Institute of Technology and Management</option>
                      <option value="ABC Institute of Technology">ABC Institute of Technology</option>
                      <option value="Northern Engineering College">Northern Engineering College</option>
                      <option value="City College of Management">City College of Management</option>
                      <option value="Modern Institute of Science">Modern Institute of Science</option>
                      <option value="Gorakhpur Institute of Technology">Gorakhpur Institute of Technology</option>
                    </select>
                  </label>
                )}

                <label className="sm:col-span-2">
                  Account Status
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputClass}
                  >
                    {["Pending", "Active", "Inactive"].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Permissions */}
              <div className="border-t border-slate-100 pt-3">
                <div className="mb-2">
                  <h3 className="text-xs font-semibold text-slate-800">
                    Access Permissions
                  </h3>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Select the modules this user can access.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {permissionOptions.map((permission) => (
                    <label
                      key={permission}
                      className="flex items-center gap-2 rounded-md border border-slate-100 px-2 py-2 text-[11px] text-slate-600 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
                      />
                      {permission}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
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
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {modal === "view" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-900">User Details</h2>
              <button
                onClick={() => setModal("")}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <UserRound size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{selected.name}</h3>
                  <p className="text-[11px] text-slate-500">{selected.email}</p>
                  <div className="mt-1 flex gap-1.5">
                    <RoleBadge role={selected.role} />
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                {[
                  ["University", selected.university],
                  ["College", selected.college],
                  ["Last Login", selected.lastLogin],
                  ["User ID", selected.id],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h3 className="mb-2 text-xs font-semibold text-slate-800">Assigned Permissions</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600"
                    >
                      {permission}
                    </span>
                  ))}
                  {selected.permissions.length === 0 && (
                    <p className="text-[11px] text-slate-400">No permissions assigned.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-3">
                <button
                  onClick={() => openEdit(selected)}
                  className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;