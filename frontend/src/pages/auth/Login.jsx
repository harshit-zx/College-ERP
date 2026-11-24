import { useState } from "react";
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  BookOpen,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    id: "superadmin",
    name: "Super Admin",
    description: "Platform management",
    icon: ShieldCheck,
    color: "text-indigo-600",
    active: "border-indigo-500 bg-indigo-50",
  },
  {
    id: "college",
    name: "College Admin",
    description: "Institution management",
    icon: Building2,
    color: "text-blue-600",
    active: "border-blue-500 bg-blue-50",
  },
  {
    id: "faculty",
    name: "Faculty",
    description: "Teaching & academics",
    icon: GraduationCap,
    color: "text-violet-600",
    active: "border-violet-500 bg-violet-50",
  },
  {
    id: "student",
    name: "Student",
    description: "Learning & academics",
    icon: BookOpen,
    color: "text-emerald-600",
    active: "border-emerald-500 bg-emerald-50",
  },
];

function Login() {
  const [selectedRole, setSelectedRole] = useState("college");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [message, setMessage] = useState("");

  const isCollegeUser = ["college", "faculty", "student"].includes(
    selectedRole
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (isCollegeUser && !collegeCode.trim()) {
      setMessage("Please enter your college code.");
      return;
    }

    // Static frontend phase: authentication is not connected yet.
    setMessage(
      "Login UI is ready. Backend authentication will be integrated later."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-indigo-700 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border-[70px] border-white/5" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full border-[70px] border-white/5" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2.5">
                <GraduationCap size={28} />
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
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-indigo-100">
              <Globe2 size={15} />
              One platform. Every campus.
            </div>

            <h2 className="text-5xl font-extrabold leading-tight xl:text-6xl">
              Welcome to
              <span className="block text-indigo-200">
                Smarter Campus
              </span>
              Management.
            </h2>

            <p className="mt-7 max-w-lg text-base leading-8 text-indigo-100">
              Access your academic and administrative workspace from one
              centralized platform. Connect students, faculty and institutions
              with a smarter way to manage education.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "One platform for multiple institutions",
                "Centralized academic management",
                "Role-based access and workflows",
                "Designed for modern education",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={19} className="shrink-0 text-emerald-300" />
                  <span className="text-sm font-medium text-indigo-100">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 border-t border-white/15 pt-6 text-xs text-indigo-200">
            © {new Date().getFullYear()} College ERP SaaS. All rights reserved.
          </div>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-[480px]">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                  <GraduationCap size={26} />
                </div>
                <span className="text-xl font-extrabold text-slate-900">
                  College<span className="text-indigo-600">ERP</span>
                </span>
              </Link>
            </div>

            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={17} />
              Back to home
            </Link>

            <div>
              <span className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                Welcome Back
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Select your account type and enter your login credentials.
              </p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="mt-8">
              <label className="mb-4 block text-sm font-bold text-slate-800">
                Select your account type
              </label>

              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isActive = selectedRole === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setMessage("");
                        if (role.id === "superadmin") {
                          setCollegeCode("");
                        }
                      }}
                      className={`relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:border-indigo-300 ${
                        isActive
                          ? `${role.active} shadow-sm`
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${role.color}`}
                      >
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 sm:text-sm">
                          {role.name}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                          {role.description}
                        </p>
                      </div>

                      {isActive && (
                        <CheckCircle2
                          size={16}
                          className="absolute right-2 top-2 text-indigo-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

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
                      size={19}
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
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address / Username
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    type="text"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or username"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Remember me
                  </span>
                </label>

                <span className="text-xs font-medium text-slate-400">
                  Secure login
                </span>
              </div>

              {message && (
                <div
                  role="status"
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    message.startsWith("Login UI")
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
              >
                Sign In to Dashboard
                <ArrowRight size={18} />
              </button>

            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                New institution?
                {" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Register your college
                </Link>
              </p>
            </div>

            <div className="mt-9 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400">
              <ShieldCheck size={16} />
              Your institutional workspace is designed for secure access.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;