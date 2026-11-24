
import { useState } from "react";
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  GraduationCap as FacultyIcon,
  BookOpen,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    id: "superadmin",
    name: "Super Admin",
    icon: ShieldCheck,
  },
  {
    id: "college",
    name: "College Admin",
    icon: Building2,
  },
  {
    id: "faculty",
    name: "Faculty",
    icon: FacultyIcon,
  },
  {
    id: "student",
    name: "Student",
    icon: BookOpen,
  },
];

function ForgotPassword() {
  const [selectedRole, setSelectedRole] = useState("college");
  const [email, setEmail] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isCollegeUser = selectedRole !== "superadmin";

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your registered email address.");
      return;
    }

    if (isCollegeUser && !collegeCode.trim()) {
      setMessage("Please enter your college code.");
      return;
    }

    // Static frontend only. No email is actually sent.
    setSubmitted(true);
  };

  const handleResend = () => {
    setSubmitted(false);
    setMessage("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-[1050px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid lg:grid-cols-2">

        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-indigo-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[55px] border-white/5" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border-[55px] border-white/5" />

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2.5">
              <GraduationCap size={27} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold">
                College<span className="text-indigo-200">ERP</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[2px] text-indigo-200">
                Campus Management
              </p>
            </div>
          </Link>

          <div className="relative z-10">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <LockKeyhole size={32} />
            </div>

            <h2 className="text-4xl font-extrabold leading-tight">
              Don't worry.
              <span className="block text-indigo-200">
                We've got you.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-8 text-indigo-100">
              Forgot your password? Recover access to your institutional
              workspace through a simple and secure password recovery process.
            </p>

            <div className="mt-9 space-y-5">
              {[
                "Simple account recovery",
                "Role-based account identification",
                "Secure password reset workflow",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  <span className="text-sm text-indigo-100">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 border-t border-white/15 pt-6 text-xs text-indigo-200">
            © {new Date().getFullYear()} College ERP SaaS. All rights reserved.
          </p>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-[430px]">

            <div className="mb-9 flex items-center justify-between lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                  <GraduationCap size={25} />
                </div>
                <span className="text-xl font-extrabold text-slate-900">
                  College<span className="text-indigo-600">ERP</span>
                </span>
              </Link>
            </div>

            <Link
              to="/login"
              className="mb-9 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={17} />
              Back to Login
            </Link>

            {!submitted ? (
              <>
                <div className="mb-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <LockKeyhole size={27} />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                    Account Recovery
                  </span>

                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
                    Forgot Password?
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    Enter your registered account details. We'll guide you
                    through the password recovery process.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* ROLE SELECTION */}
                  <div>
                    <label className="mb-3 block text-sm font-bold text-slate-800">
                      Select Account Type
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => {
                        const Icon = role.icon;
                        const active = selectedRole === role.id;

                        return (
                          <button
                            type="button"
                            key={role.id}
                            onClick={() => {
                              setSelectedRole(role.id);
                              setMessage("");
                              if (role.id === "superadmin") {
                                setCollegeCode("");
                              }
                            }}
                            className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                              active
                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                : "border-slate-200 text-slate-600 hover:border-indigo-200"
                            }`}
                          >
                            <Icon size={19} />
                            <span className="text-xs font-bold">
                              {role.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* COLLEGE CODE */}
                  {isCollegeUser && (
                    <div>
                      <label
                        htmlFor="collegeCode"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        College Code
                      </label>

                      <div className="relative">
                        <Building2
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="collegeCode"
                          type="text"
                          value={collegeCode}
                          onChange={(e) =>
                            setCollegeCode(e.target.value.toUpperCase())
                          }
                          placeholder="Enter your college code"
                          className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Registered Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your registered email"
                        className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>
                  </div>

                  {message && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                  >
                    Send Reset Instructions
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                  <p className="text-xs leading-6 text-slate-400">
                    Remember your password?
                  </p>
                  <Link
                    to="/login"
                    className="mt-1 inline-block text-sm font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              /* SUCCESS STATE */
              <div className="py-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={43} />
                </div>

                <span className="mt-7 block text-xs font-bold uppercase tracking-[2px] text-emerald-600">
                  Request Validated
                </span>

                <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
                  Check Your Email
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Your password recovery request has passed frontend
                  validation.
                </p>

                <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
                  <p className="text-xs font-semibold text-slate-400">
                    REGISTERED EMAIL
                  </p>
                  <p className="mt-2 break-all text-sm font-bold text-slate-800">
                    {email}
                  </p>

                  {isCollegeUser && (
                    <>
                      <p className="mt-4 text-xs font-semibold text-slate-400">
                        COLLEGE CODE
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {collegeCode}
                      </p>
                    </>
                  )}
                </div>

                <p className="mt-5 text-xs leading-6 text-slate-400">
                  No email or reset link has actually been sent. Email
                  integration will be added with the Go backend.
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <RefreshCw size={17} />
                  Try Again
                </button>

                <Link
                  to="/login"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <ArrowLeft size={16} />
                  Return to Login
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ForgotPassword;