
import { useState } from "react";
import {
  Settings as SettingsIcon,
  Globe,
  Palette,
  ShieldCheck,
  Mail,
  Wrench,
  SlidersHorizontal,
  Save,
  RotateCcw,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  LockKeyhole,
  Bell,
  Clock,
  X,
} from "lucide-react";

const initialSettings = {
  general: {
    platformName: "College ERP",
    platformUrl: "https://collegeerp.example.com",
    supportEmail: "support@example.com",
    supportPhone: "",
    timezone: "Asia/Kolkata",
    language: "English",
  },
  branding: {
    logoText: "College ERP",
    primaryColor: "#2563EB",
    secondaryColor: "#0F172A",
    description: "Smart College Management Platform",
    faviconText: "CE",
  },
  security: {
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: true,
    twoFactor: false,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    lockoutDuration: "15",
  },
  email: {
    senderName: "College ERP",
    senderEmail: "noreply@example.com",
    smtpHost: "",
    smtpPort: "587",
    encryption: "TLS",
    smtpUsername: "",
    smtpPassword: "",
  },
  maintenance: {
    enabled: false,
    message: "We are currently performing scheduled maintenance. Please try again later.",
    estimatedTime: "",
    allowSuperAdmin: true,
  },
  preferences: {
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    academicSession: "2026-2027",
    language: "English",
    emailNotifications: true,
    systemNotifications: true,
    paymentNotifications: true,
    weeklyReports: false,
  },
};

const sections = [
  { id: "general", label: "General", icon: Globe, description: "Platform details and regional settings" },
  { id: "branding", label: "Branding", icon: Palette, description: "Logo, colors and identity" },
  { id: "security", label: "Security", icon: ShieldCheck, description: "Password and login policies" },
  { id: "email", label: "Email Configuration", icon: Mail, description: "SMTP and sender details" },
  { id: "maintenance", label: "Maintenance Mode", icon: Wrench, description: "Platform availability" },
  { id: "preferences", label: "System Preferences", icon: SlidersHorizontal, description: "Defaults and notifications" },
];

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-xs font-medium text-slate-700">{label}</p>
        {description && (
          <p className="mt-0.5 text-[10px] text-slate-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
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

function Field({ label, children, hint }) {
  return (
    <label className="block min-w-0">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-slate-400">{hint}</span>}
    </label>
  );
}

function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoName, setLogoName] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testMessage, setTestMessage] = useState("");

  const active = sections.find((item) => item.id === activeSection);
  const current = settings[activeSection];

  const update = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [key]: value,
      },
    }));
    setSaved(false);
  };

  const inputClass =
    "mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50";

  const saveSettings = (event) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  const resetSection = () => {
    setSettings((prev) => ({
      ...prev,
      [activeSection]: { ...initialSettings[activeSection] },
    }));
    setSaved(false);
  };

  const sendTestEmail = () => {
    if (!testEmail.trim()) {
      setTestMessage("Enter a recipient email address first.");
      return;
    }
    setTestMessage("Demo only: connect the Go email API to send a real test email.");
  };

  const renderGeneral = () => (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Platform Name">
          <input className={inputClass} value={current.platformName} onChange={(e) => update("platformName", e.target.value)} required />
        </Field>
        <Field label="Platform URL">
          <input type="url" className={inputClass} value={current.platformUrl} onChange={(e) => update("platformUrl", e.target.value)} />
        </Field>
        <Field label="Support Email">
          <input type="email" className={inputClass} value={current.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} />
        </Field>
        <Field label="Support Phone">
          <input className={inputClass} value={current.supportPhone} onChange={(e) => update("supportPhone", e.target.value)} placeholder="+91..." />
        </Field>
        <Field label="Timezone">
          <select className={inputClass} value={current.timezone} onChange={(e) => update("timezone", e.target.value)}>
            <option value="Asia/Kolkata">India Standard Time (IST)</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Dubai">Dubai</option>
            <option value="Europe/London">London</option>
            <option value="America/New_York">New York</option>
          </select>
        </Field>
        <Field label="Default Language">
          <select className={inputClass} value={current.language} onChange={(e) => update("language", e.target.value)}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </Field>
      </div>
    </div>
  );

  const renderBranding = () => (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Platform Display Name">
          <input className={inputClass} value={current.logoText} onChange={(e) => update("logoText", e.target.value)} />
        </Field>
        <Field label="Favicon Text">
          <input maxLength={3} className={inputClass} value={current.faviconText} onChange={(e) => update("faviconText", e.target.value)} />
        </Field>
        <Field label="Primary Brand Color">
          <div className="mt-1.5 flex h-9 items-center gap-2 rounded-md border border-slate-200 px-2">
            <input type="color" value={current.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} className="h-6 w-8 cursor-pointer border-0 bg-transparent" />
            <span className="text-xs text-slate-600">{current.primaryColor}</span>
          </div>
        </Field>
        <Field label="Secondary Brand Color">
          <div className="mt-1.5 flex h-9 items-center gap-2 rounded-md border border-slate-200 px-2">
            <input type="color" value={current.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)} className="h-6 w-8 cursor-pointer border-0 bg-transparent" />
            <span className="text-xs text-slate-600">{current.secondaryColor}</span>
          </div>
        </Field>
        <Field label="Platform Description">
          <input className={inputClass} value={current.description} onChange={(e) => update("description", e.target.value)} />
        </Field>
      </div>

      <Field label="Platform Logo">
        <label className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-4 hover:bg-slate-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: current.primaryColor }}>
            {current.faviconText || "CE"}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-700">Choose logo file</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{logoName || "PNG, JPG or SVG · Demo file selection only"}</p>
          </div>
          <Upload size={16} className="ml-auto text-slate-400" />
          <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => setLogoName(e.target.files?.[0]?.name || "")} />
        </label>
      </Field>

      <div className="rounded-lg border border-slate-200 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Brand preview</p>
        <div className="flex items-center gap-2 rounded-lg p-3" style={{ backgroundColor: current.secondaryColor }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white" style={{ backgroundColor: current.primaryColor }}>
            {current.faviconText || "CE"}
          </div>
          <span className="text-sm font-semibold text-white">{current.logoText}</span>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Minimum Password Length">
          <input type="number" min="8" max="32" className={inputClass} value={current.minPasswordLength} onChange={(e) => update("minPasswordLength", e.target.value)} />
        </Field>
        <Field label="Session Timeout">
          <select className={inputClass} value={current.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </Field>
        <Field label="Maximum Login Attempts">
          <input type="number" min="3" max="20" className={inputClass} value={current.maxLoginAttempts} onChange={(e) => update("maxLoginAttempts", e.target.value)} />
        </Field>
        <Field label="Lockout Duration">
          <select className={inputClass} value={current.lockoutDuration} onChange={(e) => update("lockoutDuration", e.target.value)}>
            <option value="5">5 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </Field>
      </div>

      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 px-3">
        <Toggle label="Require uppercase letters" checked={current.requireUppercase} onChange={(v) => update("requireUppercase", v)} />
        <Toggle label="Require numbers" checked={current.requireNumber} onChange={(v) => update("requireNumber", v)} />
        <Toggle label="Require special characters" checked={current.requireSpecial} onChange={(v) => update("requireSpecial", v)} />
        <Toggle label="Two-factor authentication" description="Require a second verification step at login." checked={current.twoFactor} onChange={(v) => update("twoFactor", v)} />
      </div>

      <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
        <LockKeyhole size={15} className="mt-0.5 shrink-0 text-amber-700" />
        <p className="text-[10px] leading-relaxed text-amber-800">
          These are configuration preferences only. The Go backend must enforce password policies, session expiry, login throttling and two-factor verification.
        </p>
      </div>
    </div>
  );

  const renderEmail = () => (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Sender Name">
          <input className={inputClass} value={current.senderName} onChange={(e) => update("senderName", e.target.value)} />
        </Field>
        <Field label="Sender Email">
          <input type="email" className={inputClass} value={current.senderEmail} onChange={(e) => update("senderEmail", e.target.value)} />
        </Field>
        <Field label="SMTP Host">
          <input className={inputClass} value={current.smtpHost} onChange={(e) => update("smtpHost", e.target.value)} placeholder="smtp.example.com" />
        </Field>
        <Field label="SMTP Port">
          <input type="number" className={inputClass} value={current.smtpPort} onChange={(e) => update("smtpPort", e.target.value)} />
        </Field>
        <Field label="Encryption">
          <select className={inputClass} value={current.encryption} onChange={(e) => update("encryption", e.target.value)}>
            <option>TLS</option>
            <option>SSL</option>
            <option>None</option>
          </select>
        </Field>
        <Field label="SMTP Username">
          <input className={inputClass} value={current.smtpUsername} onChange={(e) => update("smtpUsername", e.target.value)} />
        </Field>
        <Field label="SMTP Password">
          <div className="relative">
            <input type={showPassword ? "text" : "password"} className={`${inputClass} pr-9`} value={current.smtpPassword} onChange={(e) => update("smtpPassword", e.target.value)} autoComplete="new-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-3 text-slate-400">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-800">
        Never put SMTP credentials in frontend source code or browser storage. In production, save secrets using backend-only environment variables or a secrets manager.
      </div>

      <div className="border-t border-slate-100 pt-3">
        <h3 className="text-xs font-semibold text-slate-800">Send a test email</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="recipient@example.com" className="h-9 min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 text-xs outline-none focus:border-blue-400" />
          <button type="button" onClick={sendTestEmail} className="h-9 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Test Email
          </button>
        </div>
        {testMessage && <p className="mt-2 text-[10px] text-slate-500">{testMessage}</p>}
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-4">
      <div className={`rounded-lg border p-3 ${current.enabled ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
        <div className="flex items-center gap-2">
          {current.enabled ? <AlertTriangle size={17} className="text-amber-700" /> : <CheckCircle2 size={17} className="text-emerald-700" />}
          <div>
            <p className={`text-xs font-semibold ${current.enabled ? "text-amber-800" : "text-emerald-800"}`}>
              {current.enabled ? "Maintenance mode enabled in this demo" : "Platform operating normally"}
            </p>
            <p className={`mt-0.5 text-[10px] ${current.enabled ? "text-amber-700" : "text-emerald-700"}`}>
              {current.enabled ? "The real platform will require backend enforcement." : "Maintenance mode is currently disabled."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 px-3">
        <Toggle
          label="Enable maintenance mode"
          description="Show a maintenance notice to regular platform users."
          checked={current.enabled}
          onChange={(v) => update("enabled", v)}
        />
        <div className="border-t border-slate-100">
          <Toggle
            label="Allow Super Admin access"
            description="Keep platform administration accessible during maintenance."
            checked={current.allowSuperAdmin}
            onChange={(v) => update("allowSuperAdmin", v)}
          />
        </div>
      </div>

      <Field label="Maintenance Message">
        <textarea
          rows={4}
          className="mt-1.5 w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-700 outline-none focus:border-blue-400"
          value={current.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </Field>

      <Field label="Expected Completion (optional)">
        <input
          type="datetime-local"
          className={inputClass}
          value={current.estimatedTime}
          onChange={(e) => update("estimatedTime", e.target.value)}
        />
      </Field>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date Format">
          <select className={inputClass} value={current.dateFormat} onChange={(e) => update("dateFormat", e.target.value)}>
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
        <Field label="Default Currency">
          <select className={inputClass} value={current.currency} onChange={(e) => update("currency", e.target.value)}>
            <option value="INR">INR – Indian Rupee</option>
            <option value="USD">USD – US Dollar</option>
            <option value="EUR">EUR – Euro</option>
          </select>
        </Field>
        <Field label="Default Academic Session">
          <select className={inputClass} value={current.academicSession} onChange={(e) => update("academicSession", e.target.value)}>
            <option>2025-2026</option>
            <option>2026-2027</option>
            <option>2027-2028</option>
          </select>
        </Field>
        <Field label="Default Language">
          <select className={inputClass} value={current.language} onChange={(e) => update("language", e.target.value)}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </Field>
      </div>

      <div className="border-t border-slate-100 pt-3">
        <h3 className="mb-1 text-xs font-semibold text-slate-800">Notification Preferences</h3>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 px-3">
          <Toggle label="Email notifications" checked={current.emailNotifications} onChange={(v) => update("emailNotifications", v)} />
          <Toggle label="System notifications" checked={current.systemNotifications} onChange={(v) => update("systemNotifications", v)} />
          <Toggle label="Payment notifications" checked={current.paymentNotifications} onChange={(v) => update("paymentNotifications", v)} />
          <Toggle label="Weekly platform reports" description="Receive a weekly platform summary." checked={current.weeklyReports} onChange={(v) => update("weeklyReports", v)} />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "general": return renderGeneral();
      case "branding": return renderBranding();
      case "security": return renderSecurity();
      case "email": return renderEmail();
      case "maintenance": return renderMaintenance();
      case "preferences": return renderPreferences();
      default: return null;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Platform Settings</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Configure platform identity, security and system preferences.
          </p>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">
          Super Admin
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[210px_minmax(0,1fr)]">
        {/* Settings navigation */}
        <nav className="rounded-lg border border-slate-200 bg-white p-2">
          <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Configuration
          </p>
          <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {sections.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveSection(id);
                  setSaved(false);
                }}
                className={`flex min-w-0 items-center gap-2 rounded-md px-2 py-2 text-left transition ${
                  activeSection === id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-medium">{label}</span>
                  <span className="hidden truncate text-[9px] text-slate-400 lg:block">{description}</span>
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Settings form */}
        <form onSubmit={saveSettings} className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            {active && <active.icon size={17} className="text-blue-600" />}
            <div>
              <h2 className="text-sm font-semibold text-slate-800">{active?.label}</h2>
              <p className="mt-0.5 text-[10px] text-slate-400">{active?.description}</p>
            </div>
          </div>

          <div className="p-4">
            {renderContent()}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-1.5">
              {saved && (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-medium text-emerald-700">
                    Changes applied in this demo
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetSection}
                className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw size={13} /> Reset
              </button>
              <button
                type="submit"
                className="flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-[11px] font-medium text-white hover:bg-blue-700"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
        <p className="text-[10px] leading-relaxed text-amber-800">
          <strong>Development mode:</strong> Settings are currently held in React state only. Saving does not write to PostgreSQL, change server configuration, send emails, enforce security policies or activate maintenance mode for other users. Connect these controls to protected Go APIs before production.
        </p>
      </div>
    </div>
  );
}

export default Settings;