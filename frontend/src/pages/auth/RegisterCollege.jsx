import { useState } from "react";
import {
  GraduationCap,
  Building2,
  MapPin,
  Mail,
  Phone,
  User,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialForm = {
  collegeName: "",
  collegeType: "",
  university: "AKTU",
  affiliationNumber: "",
  officialEmail: "",
  phone: "",
  state: "Uttar Pradesh",
  city: "",
  address: "",
  adminName: "",
  adminEmail: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const universities = [
  "AKTU",
  "Deen Dayal Upadhyaya Gorakhpur University",
  "Chaudhary Charan Singh University",
  "University of Lucknow",
  "Other University",
];

function RegisterCollege() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    if (!form.terms) {
      setMessage("Please accept the terms and conditions.");
      return;
    }

    // Static frontend phase: no backend registration yet.
    setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const sectionClass =
    "rounded-2xl border border-slate-200 bg-white p-5 sm:p-7";

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={42} />
          </div>

          <h1 className="mt-7 text-2xl font-extrabold text-slate-900">
            Registration details validated!
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            Your college registration form passed frontend validation.
            No account has been created yet because backend registration
            is not connected.
          </p>

          <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
            <p className="text-xs font-semibold text-slate-400">
              INSTITUTION
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {form.collegeName}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              University: {form.university}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Administrator: {form.adminName}
            </p>
          </div>

          <button
            onClick={() => {
              setForm(initialForm);
              setSubmitted(false);
              setMessage("");
            }}
            className="mt-8 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Register Another College
          </button>

          <Link
            to="/login"
            className="mt-5 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
              <GraduationCap size={26} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                College<span className="text-indigo-600">ERP</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Campus Management
              </p>
            </div>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            Already registered?
            <span className="text-indigo-600">Login</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        {/* Page Heading */}
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Building2 size={28} />
          </div>

          <span className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
            Institution Onboarding
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Register Your College
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            Complete the information below to register your institution
            on our centralized college management platform.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SECTION 1 */}
          <section className={sectionClass}>
            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Building2 size={22} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Institution Details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Basic information about your college
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="collegeName" className={labelClass}>
                  College / Institution Name *
                </label>
                <input
                  id="collegeName"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={updateField}
                  required
                  placeholder="Enter official college name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="collegeType" className={labelClass}>
                  Institution Type *
                </label>
                <select
                  id="collegeType"
                  name="collegeType"
                  value={form.collegeType}
                  onChange={updateField}
                  required
                  className={inputClass}
                >
                  <option value="">Select institution type</option>
                  <option value="Engineering College">Engineering College</option>
                  <option value="Degree College">Degree College</option>
                  <option value="Management College">Management College</option>
                  <option value="Medical College">Medical College</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="university" className={labelClass}>
                  Affiliated University *
                </label>
                <select
                  id="university"
                  name="university"
                  value={form.university}
                  onChange={updateField}
                  required
                  className={inputClass}
                >
                  {universities.map((university) => (
                    <option key={university} value={university}>
                      {university}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="affiliationNumber" className={labelClass}>
                  Affiliation / Institution Number
                </label>
                <input
                  id="affiliationNumber"
                  name="affiliationNumber"
                  value={form.affiliationNumber}
                  onChange={updateField}
                  placeholder="Enter university affiliation number"
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-slate-400">
                  Enter the official affiliation number, if available.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className={sectionClass}>
            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <MapPin size={22} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Contact Information
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Official communication and campus address
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="officialEmail" className={labelClass}>
                  Official College Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="officialEmail"
                    name="officialEmail"
                    type="email"
                    value={form.officialEmail}
                    onChange={updateField}
                    required
                    placeholder="college@example.edu"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField}
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="state" className={labelClass}>
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={updateField}
                  required
                  className={inputClass}
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="city" className={labelClass}>
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  required
                  placeholder="Enter city"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClass}>
                  Complete College Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  required
                  rows={3}
                  placeholder="Enter complete institutional address"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* SECTION 3 */}
          <section className={sectionClass}>
            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <User size={22} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Administrator Account
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Initial college administrator information
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="adminName" className={labelClass}>
                  Administrator Full Name *
                </label>
                <input
                  id="adminName"
                  name="adminName"
                  value={form.adminName}
                  onChange={updateField}
                  required
                  placeholder="Enter administrator full name"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="adminEmail" className={labelClass}>
                  Administrator Email *
                </label>
                <input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  value={form.adminEmail}
                  onChange={updateField}
                  required
                  placeholder="admin@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Create Password *
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateField}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className={`${inputClass} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm Password *
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={updateField}
                    required
                    minLength={8}
                    placeholder="Re-enter password"
                    className={`${inputClass} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* TERMS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={updateField}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />

              <span className="text-sm leading-6 text-slate-600">
                I confirm that the information provided is accurate and
                that I am authorized to submit this institution's
                registration details. I agree to the platform's
                <a href="#terms" className="font-semibold text-indigo-600">
                  {" "}Terms & Conditions
                </a>
                .
              </span>
            </label>
          </div>

          {message && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {message}
            </div>
          )}

          {/* SUBMIT */}
          <div className="rounded-2xl bg-indigo-700 p-6 text-white sm:p-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-indigo-200" size={23} />
              <div>
                <h3 className="font-bold">Institutional Registration</h3>
                <p className="mt-2 text-xs leading-6 text-indigo-100">
                  Your information will be used to prepare your institution's
                  onboarding. Actual verification and account creation will
                  be enabled when backend registration is integrated.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Submit Registration
              <ArrowRight size={18} />
            </button>

            <p className="mt-4 text-center text-xs text-indigo-200">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-white underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-9 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} />
          Secure institutional onboarding
        </div>
      </main>
    </div>
  );
}

export default RegisterCollege;