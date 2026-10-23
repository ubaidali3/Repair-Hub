
import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  History,
  Users,
  ArrowRight,
  Sparkles,
  ClipboardList,
  Clock3,
  Activity,
  LoaderCircle,
  UserCheck,
  FileText,
} from "lucide-react";

import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import Gate from "./Gate.jsx";

const verificationStyles = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
};

function SectionHeading({
  icon: Icon,
  title,
  description,
  color = "teal",
}) {
  const iconStyles = {
    teal: "bg-teal-50 text-teal-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="mb-6 flex items-start gap-3 sm:items-center">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
          iconStyles[color]
        }`}
      >
        <Icon size={23} />
      </div>

      <div className="min-w-0">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:border-teal-100 hover:shadow-md sm:p-7 lg:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

export default function Admin({ user, flash }) {
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function verify(id, verification) {
    if (busy) return;

    setBusy(id);
    setError("");

    try {
      await api.patch(`/admin/technicians/${id}/verification`, {
        verification,
      });

      flash(
        verification === "approved"
          ? "Technician approved successfully"
          : "Technician rejected"
      );

      setRefresh((x) => x + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbfa] px-5 py-10 text-slate-800 sm:px-8 sm:py-14 lg:px-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-0 size-96 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-80 -z-0 size-96 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/90 px-4 py-2 text-xs font-bold text-teal-800 shadow-sm sm:text-sm">
            <ShieldCheck size={17} />
            ADMINISTRATION
            <Sparkles size={15} className="text-amber-500" />
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Admin control
                <br className="hidden sm:block" />
                <span className="text-teal-700"> center.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                Manage technician verification, monitor platform
                statistics, and review recent administrative activity
                from one place.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <ShieldCheck size={25} />
              </div>

              <div>
                <p className="font-extrabold text-slate-900">
                  RepairHub
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Administration panel
                </p>
              </div>
            </div>
          </div>
        </header>

        {user?.role !== "admin" ? (
          <Panel>
            <Gate />
          </Panel>
        ) : (
          <div className="space-y-7 sm:space-y-9">
            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <XCircle size={20} className="mt-0.5 shrink-0" />
                <p className="flex-1">{error}</p>
                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                  className="rounded-lg p-1 hover:bg-red-100"
                >
                  <XCircle size={17} />
                </button>
              </div>
            )}

            {/* Statistics */}
            <Panel>
              <SectionHeading
                icon={Activity}
                title="Platform statistics"
                description="Current data returned by your admin API."
              />

              <Data url="/admin/stats">
                {(data) => {
                  const stats =
                    data && typeof data === "object" && !Array.isArray(data)
                      ? data
                      : null;

                  const entries = stats
                    ? Object.entries(stats).filter(
                        ([, value]) =>
                          value === null ||
                          ["string", "number", "boolean"].includes(
                            typeof value
                          )
                      )
                    : [];

                  const formatLabel = (key) =>
                    key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/[_-]/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());

                  return (
                    <div>
                      {entries.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {entries.map(([key, value], index) => {
                            const icons = [
                              Users,
                              ClipboardList,
                              UserCheck,
                              Activity,
                              CheckCircle2,
                              Clock3,
                            ];

                            const StatIcon = icons[index % icons.length];

                            return (
                              <div
                                key={key}
                                className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:bg-teal-50/40 hover:shadow-md"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold text-slate-500">
                                    {formatLabel(key)}
                                  </p>

                                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm transition group-hover:bg-teal-100">
                                    <StatIcon size={20} />
                                  </div>
                                </div>

                                <p className="mt-4 break-words text-3xl font-extrabold tracking-tight text-slate-950">
                                  {value === null
                                    ? "—"
                                    : typeof value === "boolean"
                                      ? value
                                        ? "Yes"
                                        : "No"
                                      : String(value)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <p className="mb-3 text-sm text-slate-500">
                            Detailed API response
                          </p>
                          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs leading-6 text-emerald-100 sm:text-sm">
                            {JSON.stringify(data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                }}
              </Data>
            </Panel>

            {/* Technician verification */}
            <Panel>
              <SectionHeading
                icon={Users}
                title="Technician verification"
                description="Review technician accounts and approve or reject verification requests."
              />

              <Data url="/admin/technicians" refresh={refresh}>
                {(items) =>
                  items.length ? (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                      {items.map((technician, index) => {
                        const status =
                          technician.verification || "pending";

                        return (
                          <article
                            key={technician._id}
                            className="group min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-lg hover:shadow-teal-900/[0.05]"
                            style={{
                              animationDelay: `${index * 80}ms`,
                            }}
                          >
                            <div className="p-5 sm:p-6">
                              <div className="flex items-start gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition duration-300 group-hover:bg-teal-100">
                                  <Users size={26} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <h3 className="break-words text-lg font-extrabold text-slate-950 sm:text-xl">
                                      {technician.name}
                                    </h3>

                                    <span
                                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${
                                        verificationStyles[status] ||
                                        verificationStyles.pending
                                      }`}
                                    >
                                      {status === "approved" ? (
                                        <CheckCircle2 size={14} />
                                      ) : status === "rejected" ? (
                                        <XCircle size={14} />
                                      ) : (
                                        <Clock3 size={14} />
                                      )}

                                      {status
                                        .replaceAll("_", " ")
                                        .replace(/\b\w/g, (c) =>
                                          c.toUpperCase()
                                        )}
                                    </span>
                                  </div>

                                  <p className="mt-2 break-all text-sm leading-6 text-slate-500">
                                    {technician.email}
                                  </p>

                                  <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                                    <ShieldCheck
                                      size={15}
                                      className="shrink-0 text-teal-700"
                                    />
                                    Technician account
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                  type="button"
                                  disabled={Boolean(busy)}
                                  onClick={() =>
                                    verify(
                                      technician._id,
                                      "approved"
                                    )
                                  }
                                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {busy === technician._id ? (
                                    <LoaderCircle
                                      size={18}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2 size={18} />
                                  )}

                                  {busy === technician._id
                                    ? "Updating..."
                                    : "Approve technician"}
                                </button>

                                <button
                                  type="button"
                                  disabled={Boolean(busy)}
                                  onClick={() =>
                                    verify(
                                      technician._id,
                                      "rejected"
                                    )
                                  }
                                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition duration-300 hover:-translate-y-0.5 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <XCircle size={18} />
                                  Reject
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">
                              <span className="text-xs font-medium text-slate-500">
                                Verification status
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                <ShieldCheck
                                  size={15}
                                  className="text-teal-700"
                                />
                                RepairHub
                              </span>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/30 px-5 py-10 text-center">
                      <Empty text="No technicians" />
                    </div>
                  )
                }
              </Data>
            </Panel>

            {/* Audit history */}
            <Panel>
              <SectionHeading
                icon={History}
                color="violet"
                title="Audit history"
                description="Review recent recorded administrative actions."
              />

              <Data url="/admin/audit">
                {(items) =>
                  items.length ? (
                    <div className="space-y-4">
                      {items.map((entry) => (
                        <article
                          key={entry._id}
                          className="group flex min-w-0 gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition duration-300 hover:border-violet-100 hover:bg-violet-50/30 sm:p-5"
                        >
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm transition group-hover:bg-violet-50">
                            <History size={21} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <h3 className="break-words font-extrabold text-slate-900">
                                {entry.action}
                              </h3>

                              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                                <Clock3 size={13} />
                                {new Date(
                                  entry.createdAt
                                ).toLocaleString()}
                              </span>
                            </div>

                            <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                              <span className="font-bold text-slate-800">
                                Target:
                              </span>{" "}
                              {entry.target}
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-violet-700">
                              <FileText size={14} />
                              Administrative activity
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/30 px-5 py-10 text-center">
                      <Empty text="No audit history available." />
                    </div>
                  )
                }
              </Data>
            </Panel>

            {/* Trust banner */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 p-6 text-white shadow-xl shadow-teal-900/10 sm:p-9 lg:p-10">
              <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border-[35px] border-white/5" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:size-14">
                    <ShieldCheck size={28} />
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-teal-100">
                      TRUST & QUALITY
                    </p>

                    <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
                      Keep RepairHub reliable.
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-teal-50">
                      Verify technician accounts carefully and use
                      the audit history to monitor administrative
                      activity.
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold sm:self-center">
                  <CheckCircle2 size={18} />
                  Admin workspace
                  <ArrowRight size={16} />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}