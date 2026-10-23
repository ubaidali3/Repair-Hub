
import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Zap,
  Snowflake,
  Droplets,
  Settings,
  CheckCircle2,
  Wrench,
  BadgeCheck,
  Clock3,
  Sparkles,
  CircleCheck,
} from "lucide-react";

const services = [
  {
    title: "Electrical",
    description: "Wiring, fans, switches and electrical repairs.",
    icon: Zap,
    color: "bg-amber-50 text-amber-600",
    accent: "group-hover:bg-amber-100",
  },
  {
    title: "AC Repair",
    description: "Cooling problems, installation and maintenance.",
    icon: Snowflake,
    color: "bg-sky-50 text-sky-600",
    accent: "group-hover:bg-sky-100",
  },
  {
    title: "Plumbing",
    description: "Leaking taps, blocked drains and pipe repairs.",
    icon: Droplets,
    color: "bg-cyan-50 text-cyan-700",
    accent: "group-hover:bg-cyan-100",
  },
  {
    title: "Appliances",
    description: "Get help repairing your everyday home appliances.",
    icon: Settings,
    color: "bg-violet-50 text-violet-600",
    accent: "group-hover:bg-violet-100",
  },
];

const benefits = [
  "Explore technician profiles",
  "Compare service offers",
  "Discuss pricing before work",
];

export default function Home({ user }) {
  const postRepairPath =
    user?.role === "customer" ? "/requests/new" : "/register";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbfa] text-slate-800">
      {/* Hero Section */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute -left-40 top-10 -z-10 size-96 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-40 -z-10 size-96 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          {/* Hero Text */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/90 px-4 py-2 text-xs font-bold text-teal-800 shadow-sm sm:text-sm">
              <ShieldCheck size={17} />
              Pakistan's repair marketplace
              <Sparkles size={15} className="text-amber-500" />
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
              Home repairs,
              <br />
              <span className="relative mt-2 inline-block text-teal-700">
                made simple.
                <span className="absolute -bottom-2 left-0 h-1.5 w-2/3 rounded-full bg-teal-200" />
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Find trusted local technicians, compare service offers, and
              get your home repairs sorted without the hassle.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={postRepairPath}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-teal-700 px-7 py-4 font-bold text-white shadow-lg shadow-teal-900/15 transition duration-300 hover:-translate-y-1 hover:bg-teal-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                Post a Repair
                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/technicians"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-100"
              >
                <Wrench size={19} className="text-teal-700" />
                Find a Technician
              </Link>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-teal-100/80 bg-white/70 p-4 sm:max-w-lg">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-teal-700"
              />
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-bold text-slate-800">
                  Your repair, your decision.
                </span>{" "}
                Compare offers and discuss service terms before work begins.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-teal-700" />
                Trusted profiles
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 size={17} className="text-teal-700" />
                Easy booking
              </span>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:150ms]">
            <div className="absolute inset-8 rounded-full bg-teal-200/50 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-slate-900/[0.08] sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Wrench size={25} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      RepairHub
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Your home, in good hands
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                  Ready to help
                </span>
              </div>

              <div className="relative my-7 flex min-h-56 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
                <div className="absolute left-5 top-5 size-16 rounded-full border border-teal-200/60" />
                <div className="absolute bottom-5 right-5 size-24 rounded-full border border-teal-200/60" />

                <div className="relative flex size-36 items-center justify-center rounded-[2.5rem] border border-white/80 bg-white/70 text-teal-700 shadow-lg shadow-teal-900/5 transition duration-500 hover:rotate-6 hover:scale-105 sm:size-44">
                  <Settings
                    size={110}
                    strokeWidth={1.1}
                    className="animate-[spin_24s_linear_infinite]"
                  />
                </div>

                <div className="absolute bottom-5 right-[19%] flex size-16 rotate-[-12deg] items-center justify-center rounded-2xl border-4 border-white bg-teal-700 text-white shadow-xl sm:bottom-7 sm:right-[23%]">
                  <Wrench size={30} />
                </div>

                <div className="absolute left-5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white text-amber-500 shadow-lg">
                  <Zap size={23} />
                </div>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Need something fixed?
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base">
                Find the right professional for your home repair.
              </p>

              <div className="my-6 h-px bg-slate-100" />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <ShieldCheck size={22} className="text-teal-700" />
                  <p className="mt-3 text-sm font-bold text-slate-800">
                    Trusted profiles
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review technician details
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <BadgeCheck size={22} className="text-teal-700" />
                  <p className="mt-3 text-sm font-bold text-slate-800">
                    Compare offers
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Choose what suits you
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Info Card */}
            <div className="absolute -right-2 top-16 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/10 sm:flex lg:-right-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CircleCheck size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  More control
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  You choose the offer
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-2 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/10 sm:flex lg:-left-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Clock3 size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Simple process
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Find help with ease
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.2em] text-teal-700 sm:text-sm">
              <span className="h-0.5 w-7 rounded-full bg-teal-600" />
              OUR SERVICES
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              What needs fixing?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              From small household problems to essential repairs, find
              technicians for your everyday needs.
            </p>
          </div>

          <Link
            to="/technicians"
            className="group inline-flex items-center gap-2 self-start rounded-xl px-1 py-2 font-bold text-teal-700 transition hover:text-teal-900 sm:self-auto"
          >
            Explore technicians
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Link
                to="/technicians"
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/[0.06] sm:p-7"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl ${service.color} ${service.accent} transition duration-300 group-hover:scale-110`}
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <div className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition duration-300 group-hover:bg-teal-50 group-hover:text-teal-700">
                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-teal-700">
                  Find a technician
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 p-7 text-white shadow-xl shadow-teal-900/10 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border-[40px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 right-1/3 size-64 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:size-14">
                  <ShieldCheck size={29} />
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-teal-100">
                    REPAIR WITH CONFIDENCE
                  </p>

                  <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                    Your home deserves the right hands.
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-teal-50 sm:text-base">
                Review technician profiles, compare offers, and discuss
                pricing and warranty terms before your repair starts.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-white/95"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-200"
                    />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative shrink-0">
              <Link
                to="/technicians"
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-extrabold text-teal-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-teal-50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 sm:w-auto"
              >
                Get Started
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <p className="mt-3 text-center text-xs text-teal-100">
                Start exploring technicians today
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
