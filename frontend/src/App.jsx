import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  Menu,
  ShieldCheck,
  Users,
  Wallet,
  X,
  Zap,
  Globe2,
  Sparkles,
  LockKeyhole,
  MonitorSmartphone,
  FileText,
  Clock3,
} from "lucide-react";

import api from "./services/api";
import "./App.css";

const modules = [
  {
    icon: Users,
    title: "Student Management",
    description:
      "Manage admissions, student profiles, enrollment, documents and academic records.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: GraduationCap,
    title: "Faculty Management",
    description:
      "Organize faculty profiles, departments, workloads and academic responsibilities.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Management",
    description:
      "Track attendance, monitor student participation and generate reports.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BookOpen,
    title: "Academic Management",
    description:
      "Manage courses, subjects, semesters, departments and academic sessions.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Wallet,
    title: "Fees Management",
    description:
      "Manage fee structures, payments, outstanding dues and financial records.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: CalendarDays,
    title: "Examination & Timetable",
    description:
      "Schedule examinations, create timetables and manage academic results.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Get actionable insights into institutional performance and academic activities.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: FileText,
    title: "Administration",
    description:
      "Centralize notices, documents, approvals and institutional workflows.",
    color: "bg-amber-50 text-amber-600",
  },
];

const benefits = [
  {
    icon: Building2,
    title: "Multi-College Management",
    description:
      "Manage multiple colleges from one centralized SaaS platform.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Data Isolation",
    description:
      "Designed for tenant-specific data access and institutional privacy.",
  },
  {
    icon: Zap,
    title: "Simplified Operations",
    description:
      "Reduce manual work with organized academic and administrative workflows.",
  },
  {
    icon: MonitorSmartphone,
    title: "Access Anywhere",
    description:
      "Use the platform across desktop, tablet and mobile devices.",
  },
];

const steps = [
  {
    number: "01",
    title: "Register Your College",
    description:
      "Create your institutional account and submit your college information.",
  },
  {
    number: "02",
    title: "Configure Your Campus",
    description:
      "Set up departments, courses, faculty, academic sessions and students.",
  },
  {
    number: "03",
    title: "Manage Everything",
    description:
      "Run your college operations from one centralized dashboard.",
  },
];

const plans = [
  {
    name: "Starter",
    description: "For small educational institutions.",
    features: [
      "Student management",
      "Faculty management",
      "Academic management",
      "Basic reports",
      "Email support",
    ],
  },
  {
    name: "Professional",
    description: "For growing colleges and institutions.",
    popular: true,
    features: [
      "Everything in Starter",
      "Attendance management",
      "Fees management",
      "Examination management",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description: "For large institutions and groups.",
    features: [
      "Everything in Professional",
      "Advanced administration",
      "Custom integrations",
      "Dedicated support",
      "Custom configuration",
    ],
  },
];

function App() {
  const [status, setStatus] = useState("Checking backend...");
  const [connected, setConnected] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/health");

        setStatus(
          response.data.message || "Backend connected successfully"
        );
        setConnected(Boolean(response.data.success));
      } catch (error) {
        setStatus("Backend connection unavailable");
        setConnected(false);
      }
    };

    checkBackend();
  }, []);

  const closeMenu = () => setMobileMenu(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                College<span className="text-indigo-600">ERP</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">
                Campus management
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            <a href="#home" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Home</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Features</a>
            <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Solutions</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600">How it works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Pricing</a>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Login
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
            >
              Get Started <ArrowUpRight size={17} />
            </a>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </nav>

        {mobileMenu && (
          <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-xl lg:hidden">
            <div className="flex flex-col gap-4">
              {[
                ["Home", "#home"],
                ["Features", "#features"],
                ["Solutions", "#solutions"],
                ["How it works", "#how-it-works"],
                ["Pricing", "#pricing"],
                ["Login", "/login"],
              ].map(([label, link]) => (
                <a
                  key={label}
                  href={link}
                  onClick={closeMenu}
                  className="text-sm font-semibold text-slate-700"
                >
                  {label}
                </a>
              ))}

              <a
                href="#contact"
                onClick={closeMenu}
                className="rounded-lg bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative overflow-hidden bg-[#F8FAFF]">
          <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-blue-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
                <Sparkles size={15} className="text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700">
                  Complete College Management Platform
                </span>
                <ArrowUpRight size={14} className="text-indigo-500" />
              </div>

              <h2 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                One Platform.
                <span className="block text-indigo-600">
                  Every Campus.
                </span>
                <span className="block">Smarter Education.</span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Simplify your entire college ecosystem with one powerful
                platform. Manage students, faculty, academics, fees,
                examinations and administration from anywhere.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700"
                >
                  Get Started <ArrowRight size={18} />
                </a>

                <a
                  href="#features"
                  className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  Explore Features <ArrowUpRight size={18} />
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  "Multi-college ready",
                  "Role-based access",
                  "Cloud-ready architecture",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-xs font-medium text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[35px] bg-gradient-to-br from-indigo-200/60 to-blue-100/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-indigo-100 sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                      <Building2 size={21} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Institution Overview
                      </h3>
                      <p className="text-xs text-slate-400">
                        Academic Dashboard
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                    LIVE PREVIEW
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, label: "Students", value: "2,450", color: "bg-blue-50 text-blue-600" },
                    { icon: GraduationCap, label: "Faculty", value: "128", color: "bg-violet-50 text-violet-600" },
                    { icon: BookOpen, label: "Courses", value: "36", color: "bg-orange-50 text-orange-600" },
                    { icon: Building2, label: "Departments", value: "12", color: "bg-emerald-50 text-emerald-600" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.color}`}>
                        <item.icon size={19} />
                      </div>
                      <p className="text-xs font-medium text-slate-500">{item.label}</p>
                      <h4 className="mt-1 text-2xl font-extrabold text-slate-900">{item.value}</h4>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-slate-100 p-4">
                  <div className="mb-5 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">Attendance Overview</h4>
                    <span className="text-xs font-semibold text-emerald-600">92% Average</span>
                  </div>

                  <div className="flex h-32 items-end justify-around gap-3">
                    {[65, 80, 72, 90, 76, 95, 85].map((height, index) => (
                      <div key={index} className="flex h-full flex-1 flex-col justify-end">
                        <div
                          className="rounded-t-md bg-gradient-to-t from-indigo-600 to-blue-400 transition-all hover:opacity-70"
                          style={{ height: `${height}%` }}
                        />
                        <span className="mt-2 text-center text-[10px] text-slate-400">
                          {["M", "T", "W", "T", "F", "S", "S"][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-indigo-50 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-indigo-600" size={22} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Institution Data</p>
                      <p className="text-[10px] text-slate-500">Designed for secure tenant isolation</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-emerald-500" size={20} />
                </div>
              </div>

              <div className="absolute -bottom-7 -left-5 hidden items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Zap size={21} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">One Connected Platform</p>
                  <p className="text-[10px] text-slate-400">Academics + Administration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / ecosystem */}
        <section className="border-y border-slate-100 bg-white py-9">
          <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
              Designed for the modern higher education ecosystem
            </p>

            <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {[
                ["University", Globe2],
                ["Affiliated Colleges", Building2],
                ["Faculty", GraduationCap],
                ["Students", Users],
              ].map(([label, Icon]) => (
                <div key={label} className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
                  <Icon size={19} className="text-indigo-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                Powerful Features
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Everything Your College Needs.
                <span className="block text-indigo-600">All in One Place.</span>
              </h2>
              <p className="mt-5 leading-7 text-slate-500">
                A unified platform to manage academic, administrative and
                institutional operations without switching between multiple tools.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <div
                  key={module.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50"
                >
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${module.color}`}>
                    <module.icon size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {module.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-indigo-600 opacity-0 transition group-hover:opacity-100">
                    Explore module <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                  Built for institutions
                </span>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
                  One ecosystem.
                  <span className="block text-indigo-600">
                    Multiple institutions.
                  </span>
                </h2>
                <p className="mt-5 leading-8 text-slate-500">
                  Whether you manage one college or a large affiliated
                  institution network, the platform is designed to support
                  centralized oversight and independent college operations.
                </p>

                <div className="mt-9 space-y-5">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <benefit.icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{benefit.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
                <div className="rounded-2xl bg-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <Globe2 size={28} />
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                      Multi-tenant model
                    </span>
                  </div>
                  <h3 className="mt-7 text-2xl font-extrabold">
                    Centralized Platform
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-indigo-100">
                    Independent institutions operating through one unified system.
                  </p>
                </div>

                <div className="my-5 flex justify-center">
                  <div className="h-8 w-px bg-indigo-200" />
                </div>

                <div className="rounded-xl border-2 border-indigo-100 bg-indigo-50 p-4 text-center">
                  <Building2 className="mx-auto text-indigo-600" size={27} />
                  <h4 className="mt-2 font-bold text-slate-900">
                    University / Institution Network
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Affiliation and academic hierarchy
                  </p>
                </div>

                <div className="my-5 flex justify-center">
                  <div className="h-8 w-px bg-indigo-200" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {["College A", "College B", "College C"].map((college) => (
                    <div key={college} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                      <Building2 className="mx-auto text-indigo-500" size={23} />
                      <p className="mt-2 text-xs font-bold text-slate-700">{college}</p>
                      <p className="mt-1 text-[10px] text-emerald-600">Independent tenant</p>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Illustrative multi-institution architecture
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                Simple Process
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Get Your Institution Started
              </h2>
              <p className="mt-4 text-slate-500">
                A straightforward process to bring your institution onto one platform.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.number} className="relative rounded-2xl border border-slate-200 p-8">
                  <span className="text-5xl font-extrabold text-indigo-100">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                  {index !== 2 && (
                    <ArrowRight className="absolute -right-6 top-1/2 hidden text-indigo-300 md:block" size={28} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                Flexible Plans
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Plans That Grow With Your College
              </h2>
              <p className="mt-4 text-slate-500">
                Choose a plan that fits your institution's requirements.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border bg-white p-8 ${
                    plan.popular
                      ? "border-indigo-500 shadow-xl shadow-indigo-100"
                      : "border-slate-200"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-8 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white">
                      Recommended
                    </span>
                  )}

                  <h3 className="text-xl font-extrabold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {plan.description}
                  </p>

                  <p className="mt-6 text-sm font-bold text-indigo-600">
                    Contact for pricing
                  </p>

                  <a
                    href="#contact"
                    className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    Get Started <ArrowRight size={16} />
                  </a>

                  <div className="my-7 h-px bg-slate-100" />

                  <p className="mb-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    What's included
                  </p>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={17} className="shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-indigo-700 px-7 py-16 text-center text-white sm:px-16">
              <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[45px] border-white/5" />
              <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full border-[45px] border-white/5" />

              <div className="relative">
                <Sparkles className="mx-auto mb-5 text-indigo-200" size={32} />
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  Ready to Transform Your Campus?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl leading-7 text-indigo-100">
                  Bring your academic and administrative operations together.
                  Start building a smarter, more connected institution.
                </p>

                <a
                  href="mailto:sales@example.com"
                  className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
                >
                  Contact Our Team <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 pt-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-600 p-2.5">
                <GraduationCap size={25} />
              </div>
              <span className="text-xl font-extrabold">
                College<span className="text-indigo-400">ERP</span>
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A unified college management platform designed to simplify
              institutional operations and connect the education ecosystem.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <Globe2 size={15} />
              Built for the modern education ecosystem
            </div>
          </div>

          <div>
            <h4 className="font-bold">Platform</h4>
            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#solutions" className="hover:text-white">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How it works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Account</h4>
            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li><a href="/login" className="hover:text-white">Login</a></li>
              <li><a href="/register" className="hover:text-white">Register College</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-xs text-slate-500 sm:flex-row lg:px-8">
            <p>© {new Date().getFullYear()} College ERP SaaS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#contact" className="hover:text-white">Privacy Policy</a>
              <a href="#contact" className="hover:text-white">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Backend Connection Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-lg">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connected ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <span className="text-xs font-semibold text-slate-600">
            {connected ? "Backend Connected" : status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;