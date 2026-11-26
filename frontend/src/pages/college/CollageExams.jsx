
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Users,
  BookOpen,
  Award,
  Search,
  Plus,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  FileText,
} from "lucide-react";
import { ACADEMIC_CATALOG, INITIAL_STUDENTS } from "../../data/academicCatalog";

const EXAM_KEY = "college_erp_exams_v1";
const REG_KEY = "college_erp_exam_registrations_v1";
const MARKS_KEY = "college_erp_exam_marks_v1";

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

function downloadCSV(filename, rows) {
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
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

function gradeFromPercentage(percentage) {
  if (percentage >= 90) return { grade: "A+", points: 10 };
  if (percentage >= 80) return { grade: "A", points: 9 };
  if (percentage >= 70) return { grade: "B+", points: 8 };
  if (percentage >= 60) return { grade: "B", points: 7 };
  if (percentage >= 50) return { grade: "C", points: 6 };
  if (percentage >= 40) return { grade: "P", points: 5 };
  return { grade: "F", points: 0 };
}

function getExamStatus(exam) {
  if (exam.resultPublished) return "Result Published";
  if (exam.endDate < today()) return "Completed";
  if (exam.startDate <= today() && exam.endDate >= today()) return "Ongoing";
  return "Upcoming";
}

function Badge({ children, color = "gray" }) {
  const styles = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${styles[color]}`}>
      {children}
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

function printAdmitCard(exam, student, registrationNo) {
  const popup = window.open("", "_blank", "width=850,height=700");
  if (!popup) {
    alert("Please allow pop-ups to print the admit card.");
    return;
  }

  const safe = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);

  popup.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Admit Card - ${safe(student.name)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 35px; color: #222; }
          .card { border: 2px solid #333; padding: 25px; max-width: 720px; margin: auto; }
          h1, h2, p { text-align: center; }
          h1 { font-size: 22px; margin-bottom: 5px; }
          h2 { font-size: 17px; margin-top: 8px; }
          .muted { color: #666; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td, th { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 13px; }
          .sign { display: flex; justify-content: space-between; margin-top: 70px; font-size: 12px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>COLLEGE ERP</h1>
          <p class="muted">Examination Department</p>
          <h2>EXAMINATION ADMIT CARD</h2>
          <p class="muted">${safe(exam.name)} · ${safe(exam.session)}</p>
          <table>
            <tr><th>Student Name</th><td>${safe(student.name)}</td></tr>
            <tr><th>Enrollment Number</th><td>${safe(student.enrollmentNo)}</td></tr>
            <tr><th>Registration Number</th><td>${safe(registrationNo)}</td></tr>
            <tr><th>Course / Branch</th><td>${safe(student.course)} / ${safe(student.branch)}</td></tr>
            <tr><th>Semester</th><td>${safe(student.semester)}</td></tr>
            <tr><th>Exam Date</th><td>${safe(exam.startDate)} to ${safe(exam.endDate)}</td></tr>
            <tr><th>Exam Venue</th><td>${safe(exam.venue || "To be announced")}</td></tr>
          </table>
          <h3>Subjects</h3>
          <table>
            <tr><th>Subject Code</th><th>Subject Name</th><th>Maximum Marks</th></tr>
            ${exam.subjects.map((subject) => `
              <tr>
                <td>${safe(subject.code)}</td>
                <td>${safe(subject.name)}</td>
                <td>${safe(subject.maxMarks)}</td>
              </tr>
            `).join("")}
          </table>
          <div class="sign">
            <span>Student Signature</span>
            <span>Controller of Examinations</span>
          </div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  popup.document.close();
}

export default function CollageExams() {
  const [tab, setTab] = useState("overview");

  const [exams, setExams] = useState(() =>
    readStorage(EXAM_KEY, [
      {
        id: 1,
        name: "Odd Semester Examination",
        type: "End Semester",
        courseCode: "BTECH",
        course: "B.Tech",
        branch: "Computer Science",
        semester: "5",
        session: "2026-27",
        startDate: "2026-12-10",
        endDate: "2026-12-20",
        venue: "Main Examination Hall",
        subjects: [
          { id: 1, code: "CS501", name: "Data Structures", maxMarks: 100, passMarks: 40 },
          { id: 2, code: "CS502", name: "Database Management System", maxMarks: 100, passMarks: 40 },
          { id: 3, code: "CS503", name: "Operating Systems", maxMarks: 100, passMarks: 40 },
        ],
        resultPublished: false,
      },
    ])
  );

  const [registrations, setRegistrations] = useState(() =>
    readStorage(REG_KEY, [])
  );

  const [marks, setMarks] = useState(() =>
    readStorage(MARKS_KEY, {})
  );

  const [selectedExamId, setSelectedExamId] = useState("");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");

  const [showExamForm, setShowExamForm] = useState(false);
  const [examForm, setExamForm] = useState({
    name: "",
    type: "End Semester",
    courseCode: "",
    branch: "",
    semester: "1",
    session: "2026-27",
    startDate: "",
    endDate: "",
    venue: "",
  });

  const [subjectForm, setSubjectForm] = useState({
    code: "",
    name: "",
    maxMarks: "100",
    passMarks: "40",
  });

  const [marksSubjectId, setMarksSubjectId] = useState("");
  const [marksDraft, setMarksDraft] = useState({});

  useEffect(() => {
    localStorage.setItem(EXAM_KEY, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(REG_KEY, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(MARKS_KEY, JSON.stringify(marks));
  }, [marks]);

  const students = useMemo(
    () => readStorage("college_erp_students_v1", INITIAL_STUDENTS),
    [registrations]
  );

  const courses = ACADEMIC_CATALOG.filter(
    (course) => course.status === "Active"
  );

  const selectedCourse = courses.find(
    (course) => course.courseCode === examForm.courseCode
  );

  const selectedExam = exams.find(
    (exam) => String(exam.id) === String(selectedExamId)
  );

  const selectedSubject = selectedExam?.subjects.find(
    (subject) => String(subject.id) === String(marksSubjectId)
  );

  const examRegistrations = registrations.filter(
    (registration) => registration.examId === selectedExam?.id
  );

  const registeredStudents = examRegistrations
    .map((registration) =>
      students.find((student) => student.id === registration.studentId)
    )
    .filter(Boolean);

  function notify(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  }

  function createExam(event) {
    event.preventDefault();

    const course = courses.find(
      (item) => item.courseCode === examForm.courseCode
    );

    if (!course || !examForm.branch || !examForm.startDate || !examForm.endDate) {
      notify("Please complete all required examination details.");
      return;
    }

    if (examForm.endDate < examForm.startDate) {
      notify("Exam end date cannot be before its start date.");
      return;
    }

    const exam = {
      id: Date.now(),
      ...examForm,
      course: course.shortName,
      subjects: [],
      resultPublished: false,
    };

    setExams((previous) => [...previous, exam]);
    setShowExamForm(false);
    setExamForm({
      name: "",
      type: "End Semester",
      courseCode: "",
      branch: "",
      semester: "1",
      session: "2026-27",
      startDate: "",
      endDate: "",
      venue: "",
    });
    notify("Examination schedule created.");
  }

  function addSubject(event) {
    event.preventDefault();

    if (!selectedExam) return;

    const maxMarks = Number(subjectForm.maxMarks);
    const passMarks = Number(subjectForm.passMarks);

    if (
      !subjectForm.code.trim() ||
      !subjectForm.name.trim() ||
      maxMarks <= 0 ||
      passMarks < 0 ||
      passMarks > maxMarks
    ) {
      notify("Enter valid subject details and marks.");
      return;
    }

    if (
      selectedExam.subjects.some(
        (subject) =>
          subject.code.toLowerCase() === subjectForm.code.trim().toLowerCase()
      )
    ) {
      notify("This subject code already exists in the exam.");
      return;
    }

    setExams((previous) =>
      previous.map((exam) =>
        exam.id === selectedExam.id
          ? {
              ...exam,
              subjects: [
                ...exam.subjects,
                {
                  id: Date.now(),
                  code: subjectForm.code.trim(),
                  name: subjectForm.name.trim(),
                  maxMarks,
                  passMarks,
                },
              ],
            }
          : exam
      )
    );

    setSubjectForm({
      code: "",
      name: "",
      maxMarks: "100",
      passMarks: "40",
    });
    notify("Subject added to examination.");
  }

  function registerStudent(student) {
    if (!selectedExam) return;

    const eligible =
      student.course === selectedExam.course &&
      student.branch === selectedExam.branch &&
      String(student.semester) === String(selectedExam.semester) &&
      student.session === selectedExam.session &&
      student.status === "Active";

    if (!eligible) {
      notify("This student does not match the exam eligibility criteria.");
      return;
    }

    const alreadyRegistered = registrations.some(
      (item) =>
        item.examId === selectedExam.id &&
        item.studentId === student.id
    );

    if (alreadyRegistered) {
      notify("Student is already registered for this exam.");
      return;
    }

    const registration = {
      id: Date.now(),
      examId: selectedExam.id,
      studentId: student.id,
      registrationNo: `EXR-${selectedExam.id}-${String(student.id).padStart(4, "0")}`,
      registeredAt: today(),
    };

    setRegistrations((previous) => [...previous, registration]);
    notify(`${student.name} registered successfully.`);
  }

  function registerAllEligible() {
    if (!selectedExam) return;

    const eligibleStudents = students.filter(
      (student) =>
        student.status === "Active" &&
        student.course === selectedExam.course &&
        student.branch === selectedExam.branch &&
        String(student.semester) === String(selectedExam.semester) &&
        student.session === selectedExam.session
    );

    const existingIds = new Set(
      registrations
        .filter((item) => item.examId === selectedExam.id)
        .map((item) => item.studentId)
    );

    const newRegistrations = eligibleStudents
      .filter((student) => !existingIds.has(student.id))
      .map((student) => ({
        id: Date.now() + student.id,
        examId: selectedExam.id,
        studentId: student.id,
        registrationNo: `EXR-${selectedExam.id}-${String(student.id).padStart(4, "0")}`,
        registeredAt: today(),
      }));

    if (!newRegistrations.length) {
      notify("No new eligible students available for registration.");
      return;
    }

    setRegistrations((previous) => [...previous, ...newRegistrations]);
    notify(`${newRegistrations.length} students registered.`);
  }

  function updateMark(studentId, subjectId, value) {
    const key = `${selectedExam.id}_${studentId}_${subjectId}`;

    setMarksDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function saveMarks() {
    if (!selectedExam || !selectedSubject) return;

    const updates = {};

    registeredStudents.forEach((student) => {
      const key = `${selectedExam.id}_${student.id}_${selectedSubject.id}`;

      if (marksDraft[key] !== undefined && marksDraft[key] !== "") {
        const score = Number(marksDraft[key]);

        if (
          !Number.isFinite(score) ||
          score < 0 ||
          score > Number(selectedSubject.maxMarks)
        ) {
          updates.invalid = true;
        } else {
          updates[key] = score;
        }
      }
    });

    if (updates.invalid) {
      notify(`Marks must be between 0 and ${selectedSubject.maxMarks}.`);
      return;
    }

    setMarks((previous) => ({ ...previous, ...updates }));
    notify("Marks saved successfully.");
  }

  function calculateResult(studentId, exam) {
    const subjectResults = exam.subjects.map((subject) => {
      const key = `${exam.id}_${studentId}_${subject.id}`;
      const score = marks[key];
      const entered = score !== undefined && score !== null && score !== "";
      const numericScore = entered ? Number(score) : null;

      return {
        ...subject,
        score: numericScore,
        entered,
        passed: entered && numericScore >= Number(subject.passMarks),
      };
    });

    const totalMax = subjectResults.reduce(
      (sum, subject) => sum + Number(subject.maxMarks),
      0
    );

    const totalObtained = subjectResults.reduce(
      (sum, subject) => sum + (subject.entered ? subject.score : 0),
      0
    );

    const allEntered = subjectResults.length > 0 &&
      subjectResults.every((subject) => subject.entered);

    const allPassed = allEntered &&
      subjectResults.every((subject) => subject.passed);

    const percentage = totalMax
      ? (totalObtained / totalMax) * 100
      : 0;

    const grade = gradeFromPercentage(percentage);

    return {
      subjectResults,
      totalMax,
      totalObtained,
      percentage,
      grade: allEntered ? grade.grade : "—",
      result: !allEntered ? "Pending" : allPassed ? "Pass" : "Fail",
    };
  }

  function publishResults() {
    if (!selectedExam) return;

    if (!selectedExam.subjects.length) {
      notify("Add subjects before publishing results.");
      return;
    }

    if (!examRegistrations.length) {
      notify("Register students before publishing results.");
      return;
    }

    const allComplete = registeredStudents.every((student) => {
      const result = calculateResult(student.id, selectedExam);
      return result.subjectResults.every((subject) => subject.entered);
    });

    if (!allComplete) {
      notify("Enter marks for every registered student and subject first.");
      return;
    }

    setExams((previous) =>
      previous.map((exam) =>
        exam.id === selectedExam.id
          ? { ...exam, resultPublished: true }
          : exam
      )
    );

    notify("Results published successfully.");
  }

  function exportResults() {
    if (!selectedExam) return;

    const rows = [
      [
        "Enrollment No",
        "Student",
        "Course",
        "Branch",
        "Semester",
        ...selectedExam.subjects.map((subject) => subject.name),
        "Total",
        "Maximum",
        "Percentage",
        "Grade",
        "Result",
      ],
      ...registeredStudents.map((student) => {
        const result = calculateResult(student.id, selectedExam);
        return [
          student.enrollmentNo,
          student.name,
          student.course,
          student.branch,
          student.semester,
          ...result.subjectResults.map((subject) =>
            subject.entered ? subject.score : "Not Entered"
          ),
          result.totalObtained,
          result.totalMax,
          result.percentage.toFixed(2),
          result.grade,
          result.result,
        ];
      }),
    ];

    downloadCSV(
      `exam-results-${selectedExam.id}.csv`,
      rows
    );
  }

  function exportRegistrations() {
    if (!selectedExam) return;

    downloadCSV(`exam-registrations-${selectedExam.id}.csv`, [
      ["Registration No", "Enrollment No", "Student", "Course", "Branch", "Semester", "Session"],
      ...registeredStudents.map((student) => {
        const registration = examRegistrations.find(
          (item) => item.studentId === student.id
        );

        return [
          registration?.registrationNo,
          student.enrollmentNo,
          student.name,
          student.course,
          student.branch,
          student.semester,
          student.session,
        ];
      }),
    ]);
  }

  function eligibleStudents(exam) {
    return students.filter(
      (student) =>
        student.status === "Active" &&
        student.course === exam.course &&
        student.branch === exam.branch &&
        String(student.semester) === String(exam.semester) &&
        student.session === exam.session
    );
  }

  const visibleExams = exams.filter((exam) => {
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      exam.name.toLowerCase().includes(query) ||
      exam.course.toLowerCase().includes(query) ||
      exam.branch.toLowerCase().includes(query);

    return (
      matchesSearch &&
      (courseFilter === "All" || exam.course === courseFilter) &&
      (statusFilter === "All" || getExamStatus(exam) === statusFilter)
    );
  });

  const upcomingCount = exams.filter(
    (exam) => getExamStatus(exam) === "Upcoming"
  ).length;

  const publishedCount = exams.filter(
    (exam) => exam.resultPublished
  ).length;

  const selectedExamStudents = selectedExam
    ? students.filter(
        (student) =>
          student.status === "Active" &&
          student.course === selectedExam.course &&
          student.branch === selectedExam.branch &&
          String(student.semester) === String(selectedExam.semester) &&
          student.session === selectedExam.session
      )
    : [];

  const subjectMarksComplete =
    selectedExam && selectedSubject
      ? registeredStudents.filter((student) => {
          const key = `${selectedExam.id}_${student.id}_${selectedSubject.id}`;
          return marks[key] !== undefined && marks[key] !== "";
        }).length
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Examination Management
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage examination schedules, registrations, marks and results
          </p>
        </div>
        <button
          onClick={() => setShowExamForm((value) => !value)}
          className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} /> Create Examination
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          ["overview", "Overview"],
          ["schedule", "Exam Schedule"],
          ["subjects", "Subjects"],
          ["registrations", "Registrations & Admit Cards"],
          ["marks", "Marks Entry"],
          ["results", "Results"],
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

      {showExamForm && (
        <form
          onSubmit={createExam}
          className="grid grid-cols-1 gap-3 rounded-lg border border-blue-100 bg-blue-50/40 p-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="text-[11px] text-gray-600">
            Examination Name
            <input
              required
              value={examForm.name}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, name: event.target.value }))
              }
              placeholder="e.g. Odd Semester Examination"
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            />
          </label>

          <label className="text-[11px] text-gray-600">
            Examination Type
            <select
              value={examForm.type}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, type: event.target.value }))
              }
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            >
              {["Internal", "Mid Semester", "End Semester", "Practical", "Supplementary"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="text-[11px] text-gray-600">
            Course
            <select
              required
              value={examForm.courseCode}
              onChange={(event) =>
                setExamForm((previous) => ({
                  ...previous,
                  courseCode: event.target.value,
                  branch: "",
                }))
              }
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.courseCode}>
                  {course.shortName}
                </option>
              ))}
            </select>
          </label>

          <label className="text-[11px] text-gray-600">
            Branch
            <select
              required
              value={examForm.branch}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, branch: event.target.value }))
              }
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            >
              <option value="">Select branch</option>
              {selectedCourse?.branches.map((branch) => (
                <option key={branch}>{branch}</option>
              ))}
            </select>
          </label>

          <label className="text-[11px] text-gray-600">
            Semester
            <select
              value={examForm.semester}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, semester: event.target.value }))
              }
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            >
              {Array.from({ length: selectedCourse?.totalSemesters || 8 }, (_, index) => (
                <option key={index + 1} value={String(index + 1)}>
                  Semester {index + 1}
                </option>
              ))}
            </select>
          </label>

          <label className="text-[11px] text-gray-600">
            Academic Session
            <input
              required
              value={examForm.session}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, session: event.target.value }))
              }
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            />
          </label>

          <label className="text-[11px] text-gray-600">
            Start Date
            <input
              required
              type="date"
              value={examForm.startDate}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, startDate: event.target.value }))
              }
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            />
          </label>

          <label className="text-[11px] text-gray-600">
            End Date
            <input
              required
              type="date"
              min={examForm.startDate || undefined}
              value={examForm.endDate}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, endDate: event.target.value }))
              }
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            />
          </label>

          <label className="text-[11px] text-gray-600">
            Examination Venue
            <input
              value={examForm.venue}
              onChange={(event) =>
                setExamForm((previous) => ({ ...previous, venue: event.target.value }))
              }
              placeholder="Examination hall"
              className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs"
            />
          </label>

          <div className="flex items-end gap-2">
            <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-xs font-medium text-white">
              Save Examination
            </button>
            <button type="button" onClick={() => setShowExamForm(false)} className="h-9 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Metric title="Total Examinations" value={exams.length} detail="Created examination schedules" icon={CalendarDays} color="bg-blue-50 text-blue-600" />
            <Metric title="Upcoming Exams" value={upcomingCount} detail="Scheduled for future dates" icon={ClipboardList} color="bg-amber-50 text-amber-600" />
            <Metric title="Registrations" value={registrations.length} detail="Student exam registrations" icon={Users} color="bg-emerald-50 text-emerald-600" />
            <Metric title="Published Results" value={publishedCount} detail="Exams with published results" icon={Award} color="bg-purple-50 text-purple-600" />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <h2 className="text-sm font-semibold text-gray-800">Examination Overview</h2>
            <div className="mt-3 divide-y divide-gray-100">
              {exams.map((exam) => (
                <div key={exam.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{exam.name}</p>
                    <p className="mt-1 text-[10px] text-gray-500">
                      {exam.course} · {exam.branch} · Semester {exam.semester} · {exam.session}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      {exam.startDate} to {exam.endDate} · {exam.subjects.length} subjects
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={exam.resultPublished ? "green" : getExamStatus(exam) === "Upcoming" ? "amber" : "blue"}>
                      {getExamStatus(exam)}
                    </Badge>
                    <button
                      onClick={() => {
                        setSelectedExamId(String(exam.id));
                        setTab("registrations");
                      }}
                      className="text-[11px] font-medium text-blue-600 hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
              {!exams.length && (
                <p className="py-8 text-center text-xs text-gray-400">No examinations created yet.</p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "schedule" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-800">Examination Schedule</h2>
            <div className="flex flex-wrap gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search examination"
                className="h-9 rounded-md border border-gray-200 px-3 text-xs"
              />
              <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 px-2 text-xs">
                <option value="All">All Courses</option>
                {courses.map((course) => <option key={course.id} value={course.shortName}>{course.shortName}</option>)}
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 px-2 text-xs">
                <option value="All">All Statuses</option>
                {["Upcoming", "Ongoing", "Completed", "Result Published"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Examination</th>
                  <th className="px-3 py-3">Course / Branch</th>
                  <th className="px-3 py-3">Semester / Session</th>
                  <th className="px-3 py-3">Exam Dates</th>
                  <th className="px-3 py-3">Subjects</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleExams.map((exam) => (
                  <tr key={exam.id} className="text-xs">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-gray-800">{exam.name}</p>
                      <p className="text-[10px] text-gray-400">{exam.type}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {exam.course}
                      <p className="text-[10px] text-gray-400">{exam.branch}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      Semester {exam.semester}
                      <p className="text-[10px] text-gray-400">{exam.session}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {exam.startDate}
                      <p className="text-[10px] text-gray-400">to {exam.endDate}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600">{exam.subjects.length}</td>
                    <td className="px-3 py-3">
                      <Badge color={exam.resultPublished ? "green" : getExamStatus(exam) === "Upcoming" ? "amber" : "blue"}>
                        {getExamStatus(exam)}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => { setSelectedExamId(String(exam.id)); setTab("subjects"); }} className="text-[11px] font-medium text-blue-600 hover:underline">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {!visibleExams.length && (
                  <tr><td colSpan="7" className="px-3 py-8 text-center text-xs text-gray-400">No examinations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab !== "overview" && tab !== "schedule" && (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-[11px] text-gray-500">
              Select Examination
              <select
                value={selectedExamId}
                onChange={(event) => {
                  setSelectedExamId(event.target.value);
                  setMarksSubjectId("");
                  setMarksDraft({});
                }}
                className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-800"
              >
                <option value="">Select examination</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} · {exam.course} · Sem {exam.semester}
                  </option>
                ))}
              </select>
            </label>

            {selectedExam && (
              <div className="flex items-end">
                <div className="text-xs text-gray-600">
                  <p className="font-semibold text-gray-800">{selectedExam.course} · {selectedExam.branch}</p>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Semester {selectedExam.semester} · {selectedExam.session} · {selectedExam.subjects.length} subjects
                  </p>
                </div>
              </div>
            )}
          </div>

          {!selectedExam && (
            <p className="py-10 text-center text-xs text-gray-400">
              Select an examination to manage this section.
            </p>
          )}

          {selectedExam && tab === "subjects" && (
            <div className="mt-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-800">Exam Subjects</h2>

              {!selectedExam.resultPublished && (
                <form onSubmit={addSubject} className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-5">
                  <input required value={subjectForm.code} onChange={(event) => setSubjectForm((previous) => ({ ...previous, code: event.target.value }))} placeholder="Subject code" className="h-9 rounded-md border border-gray-200 px-2 text-xs" />
                  <input required value={subjectForm.name} onChange={(event) => setSubjectForm((previous) => ({ ...previous, name: event.target.value }))} placeholder="Subject name" className="h-9 rounded-md border border-gray-200 px-2 text-xs" />
                  <input required type="number" min="1" value={subjectForm.maxMarks} onChange={(event) => setSubjectForm((previous) => ({ ...previous, maxMarks: event.target.value }))} placeholder="Maximum marks" className="h-9 rounded-md border border-gray-200 px-2 text-xs" />
                  <input required type="number" min="0" value={subjectForm.passMarks} onChange={(event) => setSubjectForm((previous) => ({ ...previous, passMarks: event.target.value }))} placeholder="Passing marks" className="h-9 rounded-md border border-gray-200 px-2 text-xs" />
                  <button type="submit" className="flex h-9 items-center justify-center gap-1 rounded-md bg-blue-600 px-3 text-xs font-medium text-white">
                    <Plus size={13} /> Add Subject
                  </button>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-3">Subject Code</th>
                      <th className="px-3 py-3">Subject Name</th>
                      <th className="px-3 py-3">Maximum Marks</th>
                      <th className="px-3 py-3">Passing Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedExam.subjects.map((subject) => (
                      <tr key={subject.id} className="text-xs">
                        <td className="px-3 py-3 font-medium text-gray-800">{subject.code}</td>
                        <td className="px-3 py-3 text-gray-600">{subject.name}</td>
                        <td className="px-3 py-3 text-gray-600">{subject.maxMarks}</td>
                        <td className="px-3 py-3 text-gray-600">{subject.passMarks}</td>
                      </tr>
                    ))}
                    {!selectedExam.subjects.length && (
                      <tr><td colSpan="4" className="px-3 py-8 text-center text-xs text-gray-400">No subjects added yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedExam && tab === "registrations" && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Student Registrations</h2>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Eligible students: {selectedExamStudents.length} · Registered: {registeredStudents.length}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={registerAllEligible} disabled={selectedExam.resultPublished} className="h-9 rounded-md bg-blue-600 px-3 text-xs font-medium text-white disabled:opacity-40">
                    Register All Eligible
                  </button>
                  <button onClick={exportRegistrations} className="flex h-9 items-center gap-1 rounded-md border border-gray-200 px-3 text-xs text-gray-600">
                    <Download size={13} /> Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-3">Student</th>
                      <th className="px-3 py-3">Enrollment No.</th>
                      <th className="px-3 py-3">Registration No.</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Admit Card</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registeredStudents.map((student) => {
                      const registration = examRegistrations.find((item) => item.studentId === student.id);
                      return (
                        <tr key={student.id} className="text-xs">
                          <td className="px-3 py-3 font-medium text-gray-800">{student.name}</td>
                          <td className="px-3 py-3 text-gray-600">{student.enrollmentNo}</td>
                          <td className="px-3 py-3 text-gray-600">{registration?.registrationNo}</td>
                          <td className="px-3 py-3"><Badge color="green">Registered</Badge></td>
                          <td className="px-3 py-3">
                            <button onClick={() => printAdmitCard(selectedExam, student, registration?.registrationNo)} className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline">
                              <Printer size={13} /> Print
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!registeredStudents.length && (
                      <tr><td colSpan="5" className="px-3 py-8 text-center text-xs text-gray-400">No students registered for this exam.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-400">
                Only active students matching the exam course, branch, semester, and session are eligible.
              </p>
            </div>
          )}

          {selectedExam && tab === "marks" && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Subject-wise Marks Entry</h2>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Enter marks for registered students only.
                  </p>
                </div>
                <label className="text-[11px] text-gray-500">
                  Select Subject
                  <select
                    value={marksSubjectId}
                    onChange={(event) => setMarksSubjectId(event.target.value)}
                    className="mt-1 block h-9 min-w-[220px] rounded-md border border-gray-200 px-2 text-xs"
                  >
                    <option value="">Select subject</option>
                    {selectedExam.subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.code} · {subject.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {selectedSubject && (
                <>
                  <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
                    <span>Maximum marks: <b className="text-gray-800">{selectedSubject.maxMarks}</b></span>
                    <span>Passing marks: <b className="text-gray-800">{selectedSubject.passMarks}</b></span>
                    <span>Entered: <b className="text-gray-800">{subjectMarksComplete}/{registeredStudents.length}</b></span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                        <tr>
                          <th className="px-3 py-3">Student</th>
                          <th className="px-3 py-3">Enrollment No.</th>
                          <th className="px-3 py-3">Marks Obtained</th>
                          <th className="px-3 py-3">Maximum</th>
                          <th className="px-3 py-3">Entry Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {registeredStudents.map((student) => {
                          const key = `${selectedExam.id}_${student.id}_${selectedSubject.id}`;
                          const value = marksDraft[key] ?? marks[key] ?? "";
                          return (
                            <tr key={student.id} className="text-xs">
                              <td className="px-3 py-3 font-medium text-gray-800">{student.name}</td>
                              <td className="px-3 py-3 text-gray-500">{student.enrollmentNo}</td>
                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  max={selectedSubject.maxMarks}
                                  disabled={selectedExam.resultPublished}
                                  value={value}
                                  onChange={(event) => updateMark(student.id, selectedSubject.id, event.target.value)}
                                  className="h-8 w-24 rounded-md border border-gray-200 px-2 text-xs disabled:bg-gray-100"
                                />
                              </td>
                              <td className="px-3 py-3 text-gray-600">{selectedSubject.maxMarks}</td>
                              <td className="px-3 py-3">
                                {value !== "" ? <Badge color="green">Entered</Badge> : <Badge color="amber">Pending</Badge>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveMarks}
                      disabled={selectedExam.resultPublished}
                      className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-medium text-white disabled:opacity-40"
                    >
                      <Save size={13} /> Save Marks
                    </button>
                  </div>
                </>
              )}

              {!selectedExam.subjects.length && (
                <p className="py-8 text-center text-xs text-gray-400">Add subjects before entering marks.</p>
              )}
              {!registeredStudents.length && (
                <p className="py-8 text-center text-xs text-gray-400">Register students before entering marks.</p>
              )}
            </div>
          )}

          {selectedExam && tab === "results" && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Examination Results</h2>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Results are calculated from subject-wise marks.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={exportResults} className="flex h-9 items-center gap-1 rounded-md border border-gray-200 px-3 text-xs text-gray-600">
                    <Download size={13} /> Export Results
                  </button>
                  <button
                    onClick={publishResults}
                    disabled={selectedExam.resultPublished}
                    className="h-9 rounded-md bg-blue-600 px-3 text-xs font-medium text-white disabled:opacity-40"
                  >
                    {selectedExam.resultPublished ? "Results Published" : "Publish Results"}
                  </button>
                </div>
              </div>

              {selectedExam.resultPublished && (
                <div className="flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
                  <CheckCircle2 size={15} /> Results have been marked as published in this demo.
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-3">Student</th>
                      <th className="px-3 py-3">Enrollment No.</th>
                      <th className="px-3 py-3">Total Marks</th>
                      <th className="px-3 py-3">Maximum</th>
                      <th className="px-3 py-3">Percentage</th>
                      <th className="px-3 py-3">Grade</th>
                      <th className="px-3 py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registeredStudents.map((student) => {
                      const result = calculateResult(student.id, selectedExam);
                      return (
                        <tr key={student.id} className="text-xs">
                          <td className="px-3 py-3 font-medium text-gray-800">{student.name}</td>
                          <td className="px-3 py-3 text-gray-500">{student.enrollmentNo}</td>
                          <td className="px-3 py-3 text-gray-700">{result.totalObtained}</td>
                          <td className="px-3 py-3 text-gray-700">{result.totalMax}</td>
                          <td className="px-3 py-3 text-gray-700">{result.result === "Pending" ? "—" : `${result.percentage.toFixed(2)}%`}</td>
                          <td className="px-3 py-3 font-semibold text-gray-700">{result.grade}</td>
                          <td className="px-3 py-3">
                            <Badge color={result.result === "Pass" ? "green" : result.result === "Fail" ? "red" : "amber"}>
                              {result.result}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {!registeredStudents.length && (
                      <tr><td colSpan="7" className="px-3 py-8 text-center text-xs text-gray-400">No registered students.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-400">
                Demo grading: A+ ≥90, A ≥80, B+ ≥70, B ≥60, C ≥50, P ≥40, F below 40. Students must pass every subject to pass the examination.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-400">
        Demo module: schedules, registrations, marks and publication status are stored in this browser. Published results are not yet connected to student portals or university systems.
      </p>
    </div>
  );
}