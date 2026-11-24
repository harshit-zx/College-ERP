
import { useMemo, useState } from "react";
import {
  Search, Plus, Download, Eye, Pencil, Power,
  CreditCard, IndianRupee, Building2, CheckCircle2,
  Clock, AlertCircle, X, ChevronLeft, ChevronRight,
  CalendarDays, Receipt, Layers,
} from "lucide-react";
import DataTable from "../../components/tables/DataTable";

const initialPlans = [
  { id: 1, name: "Starter", description: "For small institutions", monthly: 999, yearly: 9990, studentLimit: 500, adminLimit: 2, status: "Active" },
  { id: 2, name: "Growth", description: "For growing colleges", monthly: 2499, yearly: 24990, studentLimit: 2500, adminLimit: 5, status: "Active" },
  { id: 3, name: "Professional", description: "For large institutions", monthly: 4999, yearly: 49990, studentLimit: 10000, adminLimit: 15, status: "Active" },
  { id: 4, name: "Enterprise", description: "Custom institutional plan", monthly: 9999, yearly: 99990, studentLimit: 50000, adminLimit: 50, status: "Active" },
];

const initialSubscriptions = [
  { id: 1, college: "Institute of Technology and Management", code: "ITM001", plan: "Professional", cycle: "Yearly", amount: 49990, paymentStatus: "Paid", subscriptionStatus: "Active", startDate: "2026-01-01", nextBilling: "2027-01-01" },
  { id: 2, college: "ABC Institute of Technology", code: "ABC002", plan: "Growth", cycle: "Monthly", amount: 2499, paymentStatus: "Paid", subscriptionStatus: "Active", startDate: "2026-11-01", nextBilling: "2026-12-01" },
  { id: 3, college: "Northern Engineering College", code: "NEC003", plan: "Starter", cycle: "Monthly", amount: 999, paymentStatus: "Pending", subscriptionStatus: "Active", startDate: "2026-11-10", nextBilling: "2026-12-10" },
  { id: 4, college: "City College of Management", code: "CCM004", plan: "Growth", cycle: "Yearly", amount: 24990, paymentStatus: "Failed", subscriptionStatus: "Suspended", startDate: "2026-02-01", nextBilling: "2027-02-01" },
  { id: 5, college: "Modern Institute of Science", code: "MIS005", plan: "Professional", cycle: "Monthly", amount: 4999, paymentStatus: "Paid", subscriptionStatus: "Active", startDate: "2026-11-15", nextBilling: "2026-12-15" },
  { id: 6, college: "Gorakhpur Institute of Technology", code: "GIT006", plan: "Starter", cycle: "Monthly", amount: 999, paymentStatus: "Pending", subscriptionStatus: "Trial", startDate: "2026-11-20", nextBilling: "2026-12-20" },
];

const initialPayments = [
  { id: "PAY-1001", college: "Institute of Technology and Management", plan: "Professional", amount: 49990, method: "UPI", status: "Paid", date: "2026-11-01" },
  { id: "PAY-1002", college: "ABC Institute of Technology", plan: "Growth", amount: 2499, method: "Card", status: "Paid", date: "2026-11-02" },
  { id: "PAY-1003", college: "Northern Engineering College", plan: "Starter", amount: 999, method: "UPI", status: "Pending", date: "2026-11-10" },
  { id: "PAY-1004", college: "City College of Management", plan: "Growth", amount: 24990, method: "Net Banking", status: "Failed", date: "2026-11-12" },
  { id: "PAY-1005", college: "Modern Institute of Science", plan: "Professional", amount: 4999, method: "Card", status: "Paid", date: "2026-11-15" },
];

const emptyPlan = {
  name: "",
  description: "",
  monthly: "",
  yearly: "",
  studentLimit: "",
  adminLimit: "",
  status: "Active",
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function Badge({ value }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Paid: "bg-emerald-50 text-emerald-700",
    Trial: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-rose-50 text-rose-700",
    Suspended: "bg-rose-50 text-rose-700",
    Inactive: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${styles[value] || "bg-slate-100 text-slate-600"}`}>
      {value}
    </span>
  );
}

function Subscriptions() {
  const [plans, setPlans] = useState(initialPlans);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [payments, setPayments] = useState(initialPayments);

  const [activeTab, setActiveTab] = useState("subscriptions");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cycleFilter, setCycleFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlan);

  const pageSize = 6;

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.college.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.plan.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (statusFilter === "All" || item.subscriptionStatus === statusFilter || item.paymentStatus === statusFilter) &&
        (cycleFilter === "All" || item.cycle === cycleFilter)
      );
    });
  }, [subscriptions, search, statusFilter, cycleFilter]);

  const filteredPlans = useMemo(() => {
    const query = search.toLowerCase();

    return plans.filter((plan) =>
      plan.name.toLowerCase().includes(query) ||
      plan.description.toLowerCase().includes(query)
    );
  }, [plans, search]);

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase();

    return payments.filter((payment) =>
      payment.id.toLowerCase().includes(query) ||
      payment.college.toLowerCase().includes(query) ||
      payment.plan.toLowerCase().includes(query)
    );
  }, [payments, search]);

  const currentData =
    activeTab === "plans"
      ? filteredPlans
      : activeTab === "payments"
        ? filteredPayments
        : filteredSubscriptions;

  const totalPages = Math.max(1, Math.ceil(currentData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = currentData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paidRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const stats = [
    {
      label: "Total Subscriptions",
      value: subscriptions.length,
      icon: Layers,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Subscriptions",
      value: subscriptions.filter((s) => s.subscriptionStatus === "Active").length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending Payments",
      value: payments.filter((p) => p.status === "Pending").length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Recorded Paid Revenue",
      value: money(paidRevenue),
      icon: IndianRupee,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  const openAddPlan = () => {
    setSelected(null);
    setPlanForm(emptyPlan);
    setModal("plan");
  };

  const openEditPlan = (plan) => {
    setSelected(plan);
    setPlanForm({ ...plan });
    setModal("plan");
  };

  const savePlan = (event) => {
    event.preventDefault();

    const duplicate = plans.some(
      (p) =>
        p.name.toLowerCase() === planForm.name.trim().toLowerCase() &&
        p.id !== selected?.id
    );

    if (duplicate) {
      window.alert("A plan with this name already exists.");
      return;
    }

    const updated = {
      ...planForm,
      name: planForm.name.trim(),
      monthly: Number(planForm.monthly),
      yearly: Number(planForm.yearly),
      studentLimit: Number(planForm.studentLimit),
      adminLimit: Number(planForm.adminLimit),
    };

    if (selected) {
      setPlans((prev) =>
        prev.map((p) => p.id === selected.id ? { ...p, ...updated } : p)
      );
    } else {
      setPlans((prev) => [{ ...updated, id: Date.now() }, ...prev]);
    }

    setModal("");
  };

  const togglePlan = (plan) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );
  };

  const toggleSubscription = (subscription) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subscription.id
          ? {
              ...s,
              subscriptionStatus:
                s.subscriptionStatus === "Suspended" ? "Active" : "Suspended",
            }
          : s
      )
    );
  };

  const updatePaymentStatus = (payment, status) => {
    setPayments((prev) =>
      prev.map((p) => p.id === payment.id ? { ...p, status } : p)
    );
  };

  const exportCSV = () => {
    let headers = [];
    let rows = [];

    if (activeTab === "plans") {
      headers = ["Plan", "Description", "Monthly Price", "Yearly Price", "Student Limit", "Admin Limit", "Status"];
      rows = filteredPlans.map((p) => [
        p.name, p.description, p.monthly, p.yearly,
        p.studentLimit, p.adminLimit, p.status,
      ]);
    } else if (activeTab === "payments") {
      headers = ["Payment ID", "College", "Plan", "Amount", "Method", "Status", "Date"];
      rows = filteredPayments.map((p) => [
        p.id, p.college, p.plan, p.amount, p.method, p.status, p.date,
      ]);
    } else {
      headers = ["College", "College Code", "Plan", "Billing Cycle", "Amount", "Payment Status", "Subscription Status", "Start Date", "Next Billing"];
      rows = filteredSubscriptions.map((s) => [
        s.college, s.code, s.plan, s.cycle, s.amount,
        s.paymentStatus, s.subscriptionStatus, s.startDate, s.nextBilling,
      ]);
    }

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
    link.download = `subscriptions-${activeTab}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const subscriptionColumns = [
    {
      key: "college",
      label: "Institution",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Building2 size={15} />
          </div>
          <div className="min-w-0">
            <p className="max-w-[220px] truncate font-semibold text-slate-800">{row.college}</p>
            <p className="text-[10px] text-slate-400">{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: "plan", label: "Plan" },
    {
      key: "cycle",
      label: "Billing",
      render: (row) => <span>{row.cycle}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <span className="font-semibold text-slate-700">{money(row.amount)}</span>,
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (row) => <Badge value={row.paymentStatus} />,
    },
    {
      key: "subscriptionStatus",
      label: "Subscription",
      render: (row) => <Badge value={row.subscriptionStatus} />,
    },
    {
      key: "nextBilling",
      label: "Next Billing",
      render: (row) => row.nextBilling,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            title="View subscription"
            onClick={() => { setSelected(row); setModal("subscription"); }}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye size={14} />
          </button>
          <button
            title={row.subscriptionStatus === "Suspended" ? "Reactivate" : "Suspend"}
            onClick={() => toggleSubscription(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <Power size={14} />
          </button>
        </div>
      ),
    },
  ];

  const planColumns = [
    {
      key: "name",
      label: "Plan",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-[10px] text-slate-400">{row.description}</p>
        </div>
      ),
    },
    {
      key: "monthly",
      label: "Monthly",
      render: (row) => money(row.monthly),
    },
    {
      key: "yearly",
      label: "Yearly",
      render: (row) => money(row.yearly),
    },
    {
      key: "studentLimit",
      label: "Student Limit",
      render: (row) => Number(row.studentLimit).toLocaleString("en-IN"),
    },
    { key: "adminLimit", label: "Admin Limit" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge value={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            title="Edit plan"
            onClick={() => openEditPlan(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Pencil size={14} />
          </button>
          <button
            title="Activate / deactivate plan"
            onClick={() => togglePlan(row)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <Power size={14} />
          </button>
        </div>
      ),
    },
  ];

  const paymentColumns = [
    {
      key: "id",
      label: "Payment ID",
      render: (row) => <span className="font-semibold text-slate-700">{row.id}</span>,
    },
    { key: "college", label: "Institution" },
    { key: "plan", label: "Plan" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => money(row.amount),
    },
    { key: "method", label: "Method" },
    {
      key: "status",
      label: "Payment Status",
      render: (row) => <Badge value={row.status} />,
    },
    { key: "date", label: "Payment Date" },
    {
      key: "actions",
      label: "Update",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => updatePaymentStatus(row, e.target.value)}
          className="h-7 rounded border border-slate-200 px-1.5 text-[10px] text-slate-600"
        >
          {["Pending", "Paid", "Failed"].map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      ),
    },
  ];

  const tabs = [
    { id: "subscriptions", label: "Subscriptions" },
    { id: "plans", label: "Plans" },
    { id: "payments", label: "Payment History" },
  ];

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50";

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Subscriptions</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage plans, institutional subscriptions and payments.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download size={14} /> Export CSV
          </button>

          {activeTab === "plans" && (
            <button
              onClick={openAddPlan}
              className="flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus size={14} /> Add Plan
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
              <Icon size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500">{label}</p>
              <p className="mt-0.5 truncate text-base font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                  setStatusFilter("All");
                  setCycleFilter("All");
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={
                activeTab === "plans"
                  ? "Search plans..."
                  : activeTab === "payments"
                    ? "Search payments..."
                    : "Search institution or plan..."
              }
              className="h-8 w-full rounded-md border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Subscription filters */}
        {activeTab === "subscriptions" && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-7 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Suspended">Suspended</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending Payment</option>
              <option value="Failed">Failed Payment</option>
            </select>

            <select
              value={cycleFilter}
              onChange={(e) => { setCycleFilter(e.target.value); setPage(1); }}
              className="h-7 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600"
            >
              <option value="All">All Billing Cycles</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setCycleFilter("All");
                setPage(1);
              }}
              className="ml-auto text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <DataTable
          columns={
            activeTab === "plans"
              ? planColumns
              : activeTab === "payments"
                ? paymentColumns
                : subscriptionColumns
          }
          data={visibleRows}
          getRowKey={(row) => row.id}
        />

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-3 py-2.5">
          <p className="text-[11px] text-slate-500">
            Showing {currentData.length ? (currentPage - 1) * pageSize + 1 : 0}
            –{Math.min(currentPage * pageSize, currentData.length)} of {currentData.length} records
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

      {/* Plan modal */}
      {modal === "plan" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-900">
                {selected ? "Edit Subscription Plan" : "Create Subscription Plan"}
              </h2>
              <button onClick={() => setModal("")} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                <X size={17} />
              </button>
            </div>

            <form onSubmit={savePlan} className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                Plan Name
                <input required value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} className={inputClass} />
              </label>

              <label className="sm:col-span-2">
                Description
                <input required value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} className={inputClass} />
              </label>

              <label>
                Monthly Price (₹)
                <input required type="number" min="0" value={planForm.monthly} onChange={(e) => setPlanForm({ ...planForm, monthly: e.target.value })} className={inputClass} />
              </label>

              <label>
                Yearly Price (₹)
                <input required type="number" min="0" value={planForm.yearly} onChange={(e) => setPlanForm({ ...planForm, yearly: e.target.value })} className={inputClass} />
              </label>

              <label>
                Student Limit
                <input required type="number" min="1" value={planForm.studentLimit} onChange={(e) => setPlanForm({ ...planForm, studentLimit: e.target.value })} className={inputClass} />
              </label>

              <label>
                Admin Limit
                <input required type="number" min="1" value={planForm.adminLimit} onChange={(e) => setPlanForm({ ...planForm, adminLimit: e.target.value })} className={inputClass} />
              </label>

              <label className="sm:col-span-2">
                Status
                <select value={planForm.status} onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })} className={inputClass}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 sm:col-span-2">
                <button type="button" onClick={() => setModal("")} className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription detail modal */}
      {modal === "subscription" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-900">Subscription Details</h2>
              <button onClick={() => setModal("")} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                <X size={17} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              {[
                ["Institution", selected.college],
                ["College Code", selected.code],
                ["Plan", selected.plan],
                ["Billing Cycle", selected.cycle],
                ["Amount", money(selected.amount)],
                ["Start Date", selected.startDate],
                ["Next Billing", selected.nextBilling],
                ["Payment Status", selected.paymentStatus],
                ["Subscription Status", selected.subscriptionStatus],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <p className="text-[10px] text-slate-400">{label}</p>
                  <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;