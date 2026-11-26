
import { useState } from "react";
import {
  Building2,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  Bell,
  Save,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const STORAGE_KEY = "college_erp_settings_v1";

const DEFAULT_SETTINGS = {
  collegeName: "Demo Engineering College",
  collegeCode: "DEC001",
  university: "Dr. A.P.J. Abdul Kalam Technical University",
  affiliationNumber: "AKTU-2026-001",
  email: "admin@democollege.edu",
  phone: "+91 9876543210",
  address: "GIDA, Gorakhpur, Uttar Pradesh",
  website: "https://www.democollege.edu",
  academicSession: "2026-27",
  currentSemester: "Odd Semester",
  semesterStart: "2026-07-01",
  semesterEnd: "2026-12-31",
  attendanceThreshold: 75,
  passingMarks: 40,
  gradingSystem: "Percentage",
  enableEmailNotifications: true,
  enableAdmissionNotifications: true,
  enableFeeNotifications: true,
  enableExamNotifications: true,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-indigo-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function CollageSettings() {
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSaved(false);
  };

  const updateToggle = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch {
      alert("Unable to save settings in browser storage.");
    }
  };

  const handleReset = () => {
    if (!window.confirm("Reset all college settings to default values?")) {
      return;
    }

    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            College Settings
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure your institution's profile and academic preferences.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="submit"
            className="flex h-9 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={16} />
          Settings saved successfully in this browser.
        </div>
      )}

      {/* College Profile */}
      <SettingsSection
        icon={Building2}
        title="College Profile"
        description="Basic institutional information and contact details"
      >
        <InputField
          label="College Name"
          name="collegeName"
          value={settings.collegeName}
          onChange={handleChange}
        />
        <InputField
          label="College Code"
          name="collegeCode"
          value={settings.collegeCode}
          onChange={handleChange}
        />
        <InputField
          label="Official Email"
          name="email"
          type="email"
          value={settings.email}
          onChange={handleChange}
        />
        <InputField
          label="Contact Number"
          name="phone"
          value={settings.phone}
          onChange={handleChange}
        />
        <InputField
          label="Website"
          name="website"
          value={settings.website}
          onChange={handleChange}
        />
        <InputField
          label="College Address"
          name="address"
          value={settings.address}
          onChange={handleChange}
        />
      </SettingsSection>

      {/* University Affiliation */}
      <SettingsSection
        icon={GraduationCap}
        title="University Affiliation"
        description="University and affiliation information"
      >
        <div className="sm:col-span-2">
          <SelectField
            label="Affiliated University"
            name="university"
            value={settings.university}
            onChange={handleChange}
            options={[
              "Dr. A.P.J. Abdul Kalam Technical University",
              "Deen Dayal Upadhyaya Gorakhpur University",
              "Chaudhary Charan Singh University",
              "University of Lucknow",
              "Other University",
            ]}
          />
        </div>
        <InputField
          label="Affiliation Number"
          name="affiliationNumber"
          value={settings.affiliationNumber}
          onChange={handleChange}
        />
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-[11px] text-blue-700">
          <ShieldCheck size={17} />
          Affiliation details are currently for display and local configuration.
        </div>
      </SettingsSection>

      {/* Academic Configuration */}
      <SettingsSection
        icon={CalendarDays}
        title="Academic Configuration"
        description="Manage your academic calendar and semester"
      >
        <SelectField
          label="Academic Session"
          name="academicSession"
          value={settings.academicSession}
          onChange={handleChange}
          options={["2025-26", "2026-27", "2027-28", "2028-29"]}
        />
        <SelectField
          label="Current Semester"
          name="currentSemester"
          value={settings.currentSemester}
          onChange={handleChange}
          options={[
            "Odd Semester",
            "Even Semester",
            "Summer Semester",
          ]}
        />
        <InputField
          label="Semester Start Date"
          name="semesterStart"
          type="date"
          value={settings.semesterStart}
          onChange={handleChange}
        />
        <InputField
          label="Semester End Date"
          name="semesterEnd"
          type="date"
          value={settings.semesterEnd}
          onChange={handleChange}
        />
      </SettingsSection>

      {/* Academic Rules */}
      <SettingsSection
        icon={ClipboardCheck}
        title="Academic Rules"
        description="Set attendance and examination requirements"
      >
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Minimum Attendance (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            name="attendanceThreshold"
            value={settings.attendanceThreshold}
            onChange={handleChange}
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Passing Marks (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            name="passingMarks"
            value={settings.passingMarks}
            onChange={handleChange}
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <div className="sm:col-span-2">
          <SelectField
            label="Grading System"
            name="gradingSystem"
            value={settings.gradingSystem}
            onChange={handleChange}
            options={[
              "Percentage",
              "CGPA",
              "GPA",
              "Grade Based",
            ]}
          />
        </div>
      </SettingsSection>

      {/* Notifications */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Bell size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Notification Preferences
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Choose which notification categories are enabled in settings.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 px-4">
          <Toggle
            label="Email Notifications"
            description="General email notification preference"
            checked={settings.enableEmailNotifications}
            onChange={(value) =>
              updateToggle("enableEmailNotifications", value)
            }
          />
          <Toggle
            label="Admission Updates"
            description="New applications and admission status"
            checked={settings.enableAdmissionNotifications}
            onChange={(value) =>
              updateToggle("enableAdmissionNotifications", value)
            }
          />
          <Toggle
            label="Fee Notifications"
            description="Fee payments and pending dues"
            checked={settings.enableFeeNotifications}
            onChange={(value) =>
              updateToggle("enableFeeNotifications", value)
            }
          />
          <Toggle
            label="Examination Updates"
            description="Exam schedules and result announcements"
            checked={settings.enableExamNotifications}
            onChange={(value) =>
              updateToggle("enableExamNotifications", value)
            }
          />
        </div>
      </section>

      {/* Bottom save */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <p className="text-xs font-semibold text-slate-800">
            Save your configuration
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Changes are stored locally in this browser.
          </p>
        </div>
        <button
          type="submit"
          className="flex h-9 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          <Save size={14} />
          Save Settings
        </button>
      </div>
    </form>
  );
}