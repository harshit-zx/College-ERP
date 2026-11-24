
import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  IndianRupee,
  Receipt,
  AlertTriangle,
  Plus,
  Search,
  Download,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  Clock3,
  X,
  Printer,
  FileText,
} from "lucide-react";
import { ACADEMIC_CATALOG ,INITIAL_STUDENTS} from "../../data/academicCatalog";

const FEE_KEY = "college_erp_fee_structures_v1";
const INVOICE_KEY = "college_erp_fee_invoices_v1";
const PAYMENT_KEY = "college_erp_fee_payments_v1";
const STUDENT_KEY = "college_erp_students_v1";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const today = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function createDefaultStructures() {
  const defaults = {
    BTECH: 85000,
    BBA: 55000,
    MBA: 95000,
    BCA: 50000,
  };

  return ACADEMIC_CATALOG.flatMap((course) =>
    course.branches.map((branch, index) => ({
      id: `${course.courseCode}-${index + 1}`,
      courseCode: course.courseCode,
      courseName: course.shortName,
      branch,
      semester: "All",
      session: "All",
      totalFee: defaults[course.courseCode] || 60000,
      status: "Active",
    }))
  );
}

function csvDownload(filename, rows) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
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

function getInvoiceStatus(invoice) {
  const paid = Number(invoice.paidAmount) || 0;
  const total = Number(invoice.totalFee) || 0;

  if (paid >= total) return "Paid";
  if (paid > 0) return "Partial";
  if (invoice.dueDate < today()) return "Overdue";
  return "Pending";
}

function Badge({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700",
    Partial: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    Overdue: "bg-red-50 text-red-700",
    Active: "bg-emerald-50 text-emerald-700",
    Inactive: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function Metric({ title, value, detail, icon: Icon, color }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{title}</p>
        <span className={`rounded-md p-2 ${color}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-[10px] text-gray-500">{detail}</p>
    </div>
  );
}

export default function Fees() {
  const [tab, setTab] = useState("overview");
  const [structures, setStructures] = useState(() =>
    readStorage(FEE_KEY, createDefaultStructures())
  );
  const [invoices, setInvoices] = useState(() =>
    readStorage(INVOICE_KEY, [])
  );
  const [payments, setPayments] = useState(() =>
    readStorage(PAYMENT_KEY, [])
  );

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");

  const [showStructureForm, setShowStructureForm] = useState(false);
  const [structureForm, setStructureForm] = useState({
    courseCode: "",
    branch: "",
    semester: "All",
    session: "2026-27",
    totalFee: "",
  });

  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [paymentReference, setPaymentReference] = useState("");

  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState("");

  const students = useMemo(
    () => readStorage(STUDENT_KEY, INITIAL_STUDENTS),
    [invoices]
  );

  useEffect(() => {
    localStorage.setItem(FEE_KEY, JSON.stringify(structures));
  }, [structures]);

  useEffect(() => {
    localStorage.setItem(INVOICE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(PAYMENT_KEY, JSON.stringify(payments));
  }, [payments]);

  const activeCourses = ACADEMIC_CATALOG.filter(
    (course) => course.status === "Active"
  );

  const selectedStructureCourse = activeCourses.find(
    (course) => course.courseCode === structureForm.courseCode
  );

  const sessions = [
    ...new Set(students.map((student) => student.session).filter(Boolean)),
  ].sort();

  const getStudentInvoice = (studentId) =>
    invoices.find((invoice) => invoice.studentId === studentId);

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase();

    return invoices.filter((invoice) => {
      const status = getInvoiceStatus(invoice);
      const matchesSearch =
        !query ||
        invoice.studentName?.toLowerCase().includes(query) ||
        invoice.enrollmentNo?.toLowerCase().includes(query) ||
        invoice.invoiceNo?.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (courseFilter === "All" || invoice.course === courseFilter) &&
        (statusFilter === "All" || status === statusFilter) &&
        (sessionFilter === "All" || invoice.session === sessionFilter)
      );
    });
  }, [invoices, search, courseFilter, statusFilter, sessionFilter]);

  const totals = useMemo(() => {
    const total = invoices.reduce((sum, item) => sum + Number(item.totalFee || 0), 0);
    const collected = invoices.reduce((sum, item) => sum + Number(item.paidAmount || 0), 0);
    const pending = Math.max(0, total - collected);
    const overdue = invoices.filter(
      (item) => getInvoiceStatus(item) === "Overdue" || (
        getInvoiceStatus(item) === "Partial" && item.dueDate < today()
      )
    );

    return { total, collected, pending, overdue: overdue.length };
  }, [invoices]);

  function showMessage(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  }

  function addStructure(event) {
    event.preventDefault();

    const course = activeCourses.find(
      (item) => item.courseCode === structureForm.courseCode
    );

    if (!course || !structureForm.branch || Number(structureForm.totalFee) <= 0) {
      showMessage("Please complete all fee structure fields.");
      return;
    }

    const duplicate = structures.some(
      (item) =>
        item.courseCode === structureForm.courseCode &&
        item.branch === structureForm.branch &&
        item.semester === structureForm.semester &&
        item.session === structureForm.session
    );

    if (duplicate) {
      showMessage("A fee structure already exists for this selection.");
      return;
    }

    setStructures((previous) => [
      ...previous,
      {
        id: `FEE-${Date.now()}`,
        courseCode: course.courseCode,
        courseName: course.shortName,
        branch: structureForm.branch,
        semester: structureForm.semester,
        session: structureForm.session,
        totalFee: Number(structureForm.totalFee),
        status: "Active",
      },
    ]);

    setStructureForm({
      courseCode: "",
      branch: "",
      semester: "All",
      session: "2026-27",
      totalFee: "",
    });
    setShowStructureForm(false);
    showMessage("Fee structure added.");
  }


  function generateInvoice(student) {
    // Prevent duplicate invoices for the same student
    if (getStudentInvoice(student.id)) {
      showMessage("An invoice already exists for this student.");
      return;
    }

    // Find the student's course in the shared academic catalogue
    const course = activeCourses.find(
      (item) => item.shortName === student.course
    );

    // Find the matching active fee structure
    const matchingStructure = structures.find(
      (item) =>
        item.status === "Active" &&
        item.courseCode === course?.courseCode &&
        item.branch === student.branch &&
        (item.semester === "All" ||
          item.semester === String(student.semester)) &&
        (item.session === "All" ||
          item.session === student.session)
    );

    // Stop if no matching fee structure exists
    if (!matchingStructure) {
      showMessage("No matching active fee structure found for this student.");
      return;
    }

    const invoiceId = Date.now();
    const totalFee = Number(matchingStructure.totalFee);

    // Create 3 monthly installments
    const installmentCount = 3;

    const baseAmount = Math.floor(totalFee / installmentCount);

    const installments = Array.from(
      { length: installmentCount },
      (_, index) => {
        const installmentDate = new Date();

        // Each installment is due 30 days after the previous month
        installmentDate.setDate(
          installmentDate.getDate() + 30 * (index + 1)
        );

        const dueDate = new Date(
          installmentDate.getTime() -
            installmentDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10);

        // Adjust the last installment for any rounding difference
        const amount =
          index === installmentCount - 1
            ? totalFee - baseAmount * (installmentCount - 1)
            : baseAmount;

        return {
          id: index + 1,
          label: `Installment ${index + 1}`,
          amount,
          dueDate,
          paidAmount: 0,
          status: "Pending",
        };
      }
    );

    // Create invoice
    const invoice = {
      id: invoiceId,

      invoiceNo: `INV-${new Date().getFullYear()}-${String(invoiceId).slice(-6)}`,

      studentId: student.id,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,

      course: student.course,
      branch: student.branch,
      semester: String(student.semester),
      session: student.session,

      totalFee,
      paidAmount: 0,

      // First installment due date
      dueDate: installments[0].dueDate,

      createdAt: today(),

      structureId: matchingStructure.id,

      installments,
    };

    // Save invoice
    setInvoices((previous) => [...previous, invoice]);

    showMessage(`Invoice created successfully for ${student.name}.`);
  }


  function recordPayment(event) {
    event.preventDefault();

    if (!paymentInvoice) return;

    const amount = Number(paymentAmount);
    const balance =
      Number(paymentInvoice.totalFee) - Number(paymentInvoice.paidAmount);

    if (!Number.isFinite(amount) || amount <= 0 || amount > balance) {
      showMessage(`Enter an amount between ₹1 and ${money(balance)}.`);
      return;
    }

    const paymentId = Date.now();
    const payment = {
      id: paymentId,
      receiptNo: `RCT-${new Date().getFullYear()}-${String(paymentId).slice(-6)}`,
      invoiceId: paymentInvoice.id,
      invoiceNo: paymentInvoice.invoiceNo,
      studentId: paymentInvoice.studentId,
      studentName: paymentInvoice.studentName,
      enrollmentNo: paymentInvoice.enrollmentNo,
      amount,
      mode: paymentMode,
      reference: paymentReference.trim(),
      paymentDate: today(),
    };

    setPayments((previous) => [...previous, payment]);
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice.id === paymentInvoice.id
          ? { ...invoice, paidAmount: Number(invoice.paidAmount) + amount }
          : invoice
      )
    );

    setReceipt(payment);
    setPaymentInvoice(null);
    setPaymentAmount("");
    setPaymentReference("");
    showMessage("Payment entry recorded.");
  }

  function exportInvoices() {
    csvDownload("college-fee-invoices.csv", [
      ["Invoice No", "Student", "Enrollment No", "Course", "Branch", "Semester", "Session", "Total Fee", "Paid", "Balance", "Due Date", "Status"],
      ...filteredInvoices.map((invoice) => [
        invoice.invoiceNo,
        invoice.studentName,
        invoice.enrollmentNo,
        invoice.course,
        invoice.branch,
        invoice.semester,
        invoice.session,
        invoice.totalFee,
        invoice.paidAmount,
        invoice.totalFee - invoice.paidAmount,
        invoice.dueDate,
        getInvoiceStatus(invoice),
      ]),
    ]);
  }

  function exportPayments() {
    csvDownload("college-fee-payments.csv", [
      ["Receipt No", "Invoice No", "Student", "Enrollment No", "Amount", "Mode", "Reference", "Date"],
      ...payments.map((payment) => [
        payment.receiptNo,
        payment.invoiceNo,
        payment.studentName,
        payment.enrollmentNo,
        payment.amount,
        payment.mode,
        payment.reference,
        payment.paymentDate,
      ]),
    ]);
  }

  const studentsWithoutInvoices = students.filter(
    (student) =>
      student.status === "Active" && !getStudentInvoice(student.id)
  );

  const pendingStudents = studentsWithoutInvoices.filter((student) => {
    const query = search.toLowerCase();
    return (
      !query ||
      student.name?.toLowerCase().includes(query) ||
      student.enrollmentNo?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Fees Management</h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage fee structures, invoices, collections and dues
          </p>
        </div>
        <button
          onClick={() => setTab("structures")}
          className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} /> Add Fee Structure
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          ["overview", "Overview"],
          ["structures", "Fee Structures"],
          ["invoices", "Student Invoices"],
          ["payments", "Payments"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`border-b-2 px-3 py-2 text-xs font-medium ${
              tab === id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          {message}
        </div>
      )}

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Metric title="Total Invoiced" value={money(totals.total)} detail={`${invoices.length} invoices generated`} icon={FileText} color="bg-blue-50 text-blue-600" />
            <Metric title="Total Collected" value={money(totals.collected)} detail={`${payments.length} payment entries`} icon={Wallet} color="bg-emerald-50 text-emerald-600" />
            <Metric title="Pending Dues" value={money(totals.pending)} detail="Outstanding invoice balance" icon={IndianRupee} color="bg-amber-50 text-amber-600" />
            <Metric title="Overdue Invoices" value={totals.overdue} detail="Past due date with balance" icon={AlertTriangle} color="bg-red-50 text-red-600" />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <h2 className="text-sm font-semibold text-gray-800">Recent Payments</h2>
              <div className="mt-3 divide-y divide-gray-100">
                {payments.slice(-5).reverse().map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between gap-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-gray-800">{payment.studentName}</p>
                      <p className="mt-0.5 text-[10px] text-gray-400">{payment.receiptNo} · {payment.paymentDate}</p>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">{money(payment.amount)}</p>
                  </div>
                ))}
                {!payments.length && (
                  <p className="py-8 text-center text-xs text-gray-400">No payments recorded yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <h2 className="text-sm font-semibold text-gray-800">Pending and Overdue Invoices</h2>
              <div className="mt-3 divide-y divide-gray-100">
                {invoices
                  .filter((invoice) => getInvoiceStatus(invoice) !== "Paid")
                  .slice(0, 5)
                  .map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between gap-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{invoice.studentName}</p>
                        <p className="mt-0.5 text-[10px] text-gray-400">{invoice.invoiceNo} · Due {invoice.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-800">{money(invoice.totalFee - invoice.paidAmount)}</p>
                        <Badge status={getInvoiceStatus(invoice)} />
                      </div>
                    </div>
                  ))}
                {!invoices.some((invoice) => getInvoiceStatus(invoice) !== "Paid") && (
                  <p className="py-8 text-center text-xs text-gray-400">No pending invoices.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "structures" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Fee Structures</h2>
              <p className="mt-1 text-[10px] text-gray-500">Configure fees for courses, branches, semesters and sessions.</p>
            </div>
            <button
              onClick={() => setShowStructureForm((value) => !value)}
              className="flex h-9 items-center gap-1 rounded-md border border-gray-200 px-3 text-xs text-gray-700 hover:bg-gray-50"
            >
              <Plus size={14} /> New Structure
            </button>
          </div>

          {showStructureForm && (
            <form onSubmit={addStructure} className="grid grid-cols-1 gap-3 rounded-lg border border-blue-100 bg-blue-50/40 p-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-[11px] text-gray-600">
                Course
                <select
                  required
                  value={structureForm.courseCode}
                  onChange={(event) => setStructureForm((previous) => ({ ...previous, courseCode: event.target.value, branch: "" }))}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
                >
                  <option value="">Select course</option>
                  {activeCourses.map((course) => (
                    <option key={course.id} value={course.courseCode}>{course.shortName}</option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] text-gray-600">
                Branch
                <select
                  required
                  value={structureForm.branch}
                  onChange={(event) => setStructureForm((previous) => ({ ...previous, branch: event.target.value }))}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
                >
                  <option value="">Select branch</option>
                  {selectedStructureCourse?.branches.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] text-gray-600">
                Semester
                <select
                  value={structureForm.semester}
                  onChange={(event) => setStructureForm((previous) => ({ ...previous, semester: event.target.value }))}
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
                >
                  <option value="All">All Semesters</option>
                  {Array.from({ length: selectedStructureCourse?.totalSemesters || 8 }, (_, index) => (
                    <option key={index + 1} value={String(index + 1)}>Semester {index + 1}</option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] text-gray-600">
                Academic Session
                <input
                  required
                  value={structureForm.session}
                  onChange={(event) => setStructureForm((previous) => ({ ...previous, session: event.target.value }))}
                  placeholder="2026-27 or All"
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
                />
              </label>
              <label className="text-[11px] text-gray-600">
                Total Fee (₹)
                <input
                  required
                  type="number"
                  min="1"
                  value={structureForm.totalFee}
                  onChange={(event) => setStructureForm((previous) => ({ ...previous, totalFee: event.target.value }))}
                  placeholder="Enter amount"
                  className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
                />
              </label>
              <div className="flex items-end gap-2">
                <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-xs font-medium text-white">Save Structure</button>
                <button type="button" onClick={() => setShowStructureForm(false)} className="h-9 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-600">Cancel</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Course</th>
                  <th className="px-3 py-3">Branch</th>
                  <th className="px-3 py-3">Semester</th>
                  <th className="px-3 py-3">Session</th>
                  <th className="px-3 py-3">Total Fee</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {structures.map((item) => (
                  <tr key={item.id} className="text-xs">
                    <td className="px-3 py-3 font-medium text-gray-800">{item.courseName}</td>
                    <td className="px-3 py-3 text-gray-600">{item.branch}</td>
                    <td className="px-3 py-3 text-gray-600">{item.semester === "All" ? "All" : `Semester ${item.semester}`}</td>
                    <td className="px-3 py-3 text-gray-600">{item.session}</td>
                    <td className="px-3 py-3 font-semibold text-gray-800">{money(item.totalFee)}</td>
                    <td className="px-3 py-3"><Badge status={item.status} /></td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => setStructures((previous) => previous.map((row) => row.id === item.id ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" } : row))}
                        className="text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        {item.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "invoices" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Student Fee Invoices</h2>
              <p className="mt-1 text-[10px] text-gray-500">Generate invoices from active fee structures for existing students.</p>
            </div>
            <button onClick={exportInvoices} className="flex h-9 items-center gap-1 rounded-md border border-gray-200 px-3 text-xs text-gray-600 hover:bg-gray-50">
              <Download size={13} /> Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2">
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, enrollment or invoice" className="h-9 w-full rounded-md border border-gray-200 pl-8 pr-3 text-xs" />
            </div>
            <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 px-2 text-xs">
              <option value="All">All Courses</option>
              {activeCourses.map((course) => <option key={course.id} value={course.shortName}>{course.shortName}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 px-2 text-xs">
              <option value="All">All Statuses</option>
              {["Paid", "Partial", "Pending", "Overdue"].map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={sessionFilter} onChange={(event) => setSessionFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 px-2 text-xs">
              <option value="All">All Sessions</option>
              {sessions.map((session) => <option key={session}>{session}</option>)}
            </select>
          </div>

          {pendingStudents.length > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
              <p className="text-xs font-semibold text-blue-800">Students without invoices ({pendingStudents.length})</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pendingStudents.map((student) => (
                  <button key={student.id} onClick={() => generateInvoice(student)} className="rounded-md border border-blue-200 bg-white px-2 py-1.5 text-[10px] text-blue-700 hover:bg-blue-50">
                    + {student.name} · {student.enrollmentNo}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-blue-600">Select a student to generate their invoice using the matching active fee structure.</p>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Invoice / Student</th>
                  <th className="px-3 py-3">Course</th>
                  <th className="px-3 py-3">Session</th>
                  <th className="px-3 py-3">Total Fee</th>
                  <th className="px-3 py-3">Paid</th>
                  <th className="px-3 py-3">Balance</th>
                  <th className="px-3 py-3">Due Date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="text-xs">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-gray-800">{invoice.invoiceNo}</p>
                      <p className="mt-0.5 text-[10px] text-gray-500">{invoice.studentName} · {invoice.enrollmentNo}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600">{invoice.course}<p className="text-[10px] text-gray-400">{invoice.branch}</p></td>
                    <td className="px-3 py-3 text-gray-600">{invoice.session}</td>
                    <td className="px-3 py-3 text-gray-700">{money(invoice.totalFee)}</td>
                    <td className="px-3 py-3 text-emerald-700">{money(invoice.paidAmount)}</td>
                    <td className="px-3 py-3 font-semibold text-gray-800">{money(invoice.totalFee - invoice.paidAmount)}</td>
                    <td className="px-3 py-3 text-gray-500">{invoice.dueDate}</td>
                    <td className="px-3 py-3"><Badge status={getInvoiceStatus(invoice)} /></td>
                    <td className="px-3 py-3">
                      <button
                        disabled={getInvoiceStatus(invoice) === "Paid"}
                        onClick={() => {
                          setPaymentInvoice(invoice);
                          setPaymentAmount(String(invoice.totalFee - invoice.paidAmount));
                        }}
                        className="rounded-md border border-blue-200 px-2 py-1.5 text-[10px] font-medium text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Record Payment
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredInvoices.length && (
                  <tr><td colSpan="9" className="px-3 py-10 text-center text-xs text-gray-400">No invoices match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "payments" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Payment History</h2>
              <p className="mt-1 text-[10px] text-gray-500">Recorded fee payment entries and receipts.</p>
            </div>
            <button onClick={exportPayments} className="flex h-9 items-center gap-1 rounded-md border border-gray-200 px-3 text-xs text-gray-600">
              <Download size={13} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Receipt No.</th>
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Invoice</th>
                  <th className="px-3 py-3">Payment Date</th>
                  <th className="px-3 py-3">Mode</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...payments].reverse().map((payment) => (
                  <tr key={payment.id} className="text-xs">
                    <td className="px-3 py-3 font-medium text-gray-800">{payment.receiptNo}</td>
                    <td className="px-3 py-3 text-gray-700">{payment.studentName}<p className="text-[10px] text-gray-400">{payment.enrollmentNo}</p></td>
                    <td className="px-3 py-3 text-gray-600">{payment.invoiceNo}</td>
                    <td className="px-3 py-3 text-gray-600">{payment.paymentDate}</td>
                    <td className="px-3 py-3 text-gray-600">{payment.mode}</td>
                    <td className="px-3 py-3 font-semibold text-emerald-700">{money(payment.amount)}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => setReceipt(payment)} className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline">
                        <Receipt size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {!payments.length && (
                  <tr><td colSpan="7" className="px-3 py-10 text-center text-xs text-gray-400">No payment records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {paymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <form onSubmit={recordPayment} className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Record Fee Payment</h2>
              <button type="button" onClick={() => setPaymentInvoice(null)} className="rounded-md p-1 text-gray-400 hover:bg-gray-100"><X size={17} /></button>
            </div>
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs">
              <p className="font-semibold text-gray-800">{paymentInvoice.studentName}</p>
              <p className="mt-1 text-[10px] text-gray-500">{paymentInvoice.invoiceNo} · {paymentInvoice.enrollmentNo}</p>
              <div className="mt-3 flex justify-between"><span className="text-gray-500">Invoice amount</span><b>{money(paymentInvoice.totalFee)}</b></div>
              <div className="mt-1 flex justify-between"><span className="text-gray-500">Already paid</span><b className="text-emerald-700">{money(paymentInvoice.paidAmount)}</b></div>
              <div className="mt-1 flex justify-between"><span className="text-gray-500">Balance</span><b>{money(paymentInvoice.totalFee - paymentInvoice.paidAmount)}</b></div>
            </div>
            <label className="mt-3 block text-[11px] text-gray-600">
              Payment Amount (₹)
              <input required type="number" min="1" max={paymentInvoice.totalFee - paymentInvoice.paidAmount} value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-gray-200 px-3 text-xs" />
            </label>
            <label className="mt-3 block text-[11px] text-gray-600">
              Payment Mode
              <select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-gray-200 px-3 text-xs">
                {["UPI", "Cash", "Bank Transfer", "Card", "Cheque", "Other"].map((mode) => <option key={mode}>{mode}</option>)}
              </select>
            </label>
            <label className="mt-3 block text-[11px] text-gray-600">
              Transaction / Reference Number (optional)
              <input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder="Enter transaction reference" className="mt-1 h-9 w-full rounded-md border border-gray-200 px-3 text-xs" />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setPaymentInvoice(null)} className="h-9 rounded-md border border-gray-200 px-3 text-xs text-gray-600">Cancel</button>
              <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-xs font-medium text-white">Save Payment</button>
            </div>
          </form>
        </div>
      )}

      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Payment Receipt</h2>
              <button onClick={() => setReceipt(null)} className="rounded-md p-1 text-gray-400 hover:bg-gray-100"><X size={17} /></button>
            </div>
            <div className="my-4 border-y border-dashed border-gray-300 py-4 text-center">
              <p className="text-xs font-semibold text-gray-500">COLLEGE ERP</p>
              <p className="mt-2 text-lg font-bold text-emerald-700">{money(receipt.amount)}</p>
              <p className="mt-1 text-[10px] text-gray-500">Payment recorded successfully</p>
            </div>
            <div className="space-y-2 text-xs">
              {[
                ["Receipt Number", receipt.receiptNo],
                ["Student", receipt.studentName],
                ["Enrollment No.", receipt.enrollmentNo],
                ["Invoice Number", receipt.invoiceNo],
                ["Payment Date", receipt.paymentDate],
                ["Payment Mode", receipt.mode],
                ["Reference", receipt.reference || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-right font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setReceipt(null)} className="h-9 rounded-md border border-gray-200 px-3 text-xs text-gray-600">Close</button>
              <button onClick={() => window.print()} className="flex h-9 items-center gap-1 rounded-md bg-blue-600 px-3 text-xs font-medium text-white">
                <Printer size={13} /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] text-gray-400">
        Demo only: fee amounts are sample values. Payments are manual records, not verified transactions. Configure approved fee rules and connect a secure payment provider before production use.
      </p>
    </div>
  );
}
