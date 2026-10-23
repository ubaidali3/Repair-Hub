
import React, { useState } from "react";
import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import Gate from "./Gate.jsx";
import {
  ShieldCheck,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ClipboardCheck,
  FileText,
  Sparkles,
  Wrench,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Send,
  X,
} from "lucide-react";

const statusStyles = {
  active: "border-emerald-100 bg-emerald-50 text-emerald-700",
  issued: "border-emerald-100 bg-emerald-50 text-emerald-700",
  submitted: "border-amber-100 bg-amber-50 text-amber-700",
  reviewing: "border-sky-100 bg-sky-50 text-sky-700",
  revisit_scheduled: "border-teal-100 bg-teal-50 text-teal-700",
  resolved: "border-emerald-100 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-100 bg-rose-50 text-rose-700",
  escalated: "border-orange-100 bg-orange-50 text-orange-700",
  expired: "border-slate-200 bg-slate-100 text-slate-600",
};

function StatusBadge({ status }) {
  const normalized = String(status || "unknown")
    .toLowerCase()
    .replaceAll("_", " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
        statusStyles[status] ||
        "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status === "resolved" || status === "active" ? (
        <CheckCircle2 size={13} />
      ) : status === "expired" ||
        status === "rejected" ||
        status === "escalated" ? (
        <AlertCircle size={13} />
      ) : (
        <Clock3 size={13} />
      )}
      {normalized}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "Not specified";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not specified"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function Warranties({ user, flash }) {
  const [refresh, setRefresh] = useState(0);
  const [claiming, setClaiming] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [updating, setUpdating] = useState(null);

  function openClaim(w) {
    setClaiming(w);
    setDescription("");
    setError("");
  }

  async function claim(e) {
    e.preventDefault();

    if (!claiming || description.trim().length < 10) {
      setError("Please describe the covered fault in at least 10 characters.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await api.post(`/warranties/${claiming._id}/claims`, {
        description: description.trim(),
      });

      flash("Claim submitted for technician review");
      setClaiming(null);
      setDescription("");
      setRefresh((x) => x + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  async function update(c, status) {
    setError("");
    setUpdating(c._id);

    try {
      await api.patch(`/claims/${c._id}/status`, { status });
      flash("Claim updated");
      setRefresh((x) => x + 1);
    } catch (e) {
      flash(message(e));
    } finally {
      setUpdating(null);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f8fbfa] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <ShieldCheck size={30} />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">
            Digital warranties
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to view your warranties and manage warranty claims.
          </p>
          <div className="mt-6">
            <Gate />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full bg-white/50 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-700">
                <Sparkles size={14} />
                After-service protection
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Digital warranties
                <span className="block text-teal-700">
                  & claims.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Keep track of your repair coverage, check expiry dates and
                manage revisit requests from one convenient place.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-600 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={17} className="text-emerald-600" />
                  Digital warranty records
                </span>
                <span className="inline-flex items-center gap-2">
                  <RefreshCw size={16} className="text-teal-700" />
                  Revisit claim tracking
                </span>
              </div>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ClipboardCheck size={25} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Warranty center
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Coverage and claim details
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Warranties */}
        <section className="mb-10">
          <div className="mb-5 flex items-end gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <ShieldCheck size={23} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                My warranties
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review coverage and validity for your repairs.
              </p>
            </div>
          </div>

          <Data url="/warranties" refresh={refresh}>
            {(items) =>
              items.length ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {items.map((w) => {
                    const expiry = new Date(w.expiresAt);
                    const validExpiry =
                      w.expiresAt && !Number.isNaN(expiry.getTime());
                    const expired = validExpiry && expiry <= new Date();
                    const canClaim =
                      user.role === "customer" &&
                      validExpiry &&
                      !expired &&
                      !["expired", "cancelled", "void"].includes(
                        String(w.status || "").toLowerCase()
                      );

                    return (
                      <article
                        key={w._id}
                        className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5"
                      >
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-teal-50/80 to-emerald-50/60 p-5 sm:p-6">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                              <FileText size={23} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Warranty number
                              </p>
                              <h3 className="mt-1 break-all text-lg font-bold text-slate-950">
                                {w.number || "Warranty record"}
                              </h3>
                            </div>
                          </div>

                          <StatusBadge
                            status={expired ? "expired" : w.status}
                          />
                        </div>

                        <div className="p-5 sm:p-6">
                          <div className="mb-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Service category
                            </p>
                            <p className="mt-1.5 text-base font-bold text-slate-900">
                              {w.category || "Repair service"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-800">
                              <Wrench size={16} />
                              Covered fault
                            </div>
                            <p className="text-sm leading-6 text-slate-700">
                              {w.coveredFault || "Coverage details not listed"}
                            </p>
                          </div>

                          <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                            <CalendarDays
                              size={18}
                              className="mt-0.5 shrink-0 text-teal-700"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-500">
                                Expiry date
                              </p>
                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {formatDate(w.expiresAt)}
                              </p>
                            </div>
                          </div>

                          {w.exclusions && (
                            <div className="mt-4">
                              <p className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <AlertCircle size={14} />
                                Exclusions
                              </p>
                              <p className="text-sm leading-6 text-slate-600">
                                {w.exclusions}
                              </p>
                            </div>
                          )}

                          {user.role === "customer" && (
                            <div className="mt-5 border-t border-slate-100 pt-5">
                              {canClaim ? (
                                <button
                                  type="button"
                                  onClick={() => openClaim(w)}
                                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-teal-700/10 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100"
                                >
                                  <RefreshCw size={17} />
                                  Claim free revisit
                                  <ArrowRight size={17} />
                                </button>
                              ) : (
                                <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                                  <AlertCircle
                                    size={16}
                                    className="mt-0.5 shrink-0"
                                  />
                                  {expired
                                    ? "This warranty has passed its expiry date."
                                    : "A revisit claim is not available for this warranty."}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <ShieldCheck size={30} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    No warranties yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Your issued digital warranties will appear here when
                    available.
                  </p>
                  <Empty text="No warranties issued yet" />
                </div>
              )
            }
          </Data>
        </section>

        {/* Claims */}
        <section>
          <div className="mb-5 flex items-end gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ClipboardCheck size={23} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                Warranty claims
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track claim progress and manage the next steps.
              </p>
            </div>
          </div>

          <Data url="/claims" refresh={refresh}>
            {(items) =>
              items.length ? (
                <div className="space-y-4">
                  {items.map((c) => (
                    <article
                      key={c._id}
                      className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-teal-200 sm:p-6"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                            <FileText size={21} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-950">
                              Warranty claim
                            </h3>
                            <p className="mt-1 break-words text-xs text-slate-500">
                              Claim reference: {String(c._id).slice(-8)}
                            </p>
                          </div>
                        </div>

                        <StatusBadge status={c.status} />
                      </div>

                      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Reported issue
                        </p>
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {c.description}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {user.role === "technician" &&
                          ["submitted", "reviewing"].includes(c.status) && (
                            <button
                              type="button"
                              disabled={updating === c._id}
                              onClick={() =>
                                update(c, "revisit_scheduled")
                              }
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
                            >
                              {updating === c._id ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <CalendarDays size={16} />
                              )}
                              Arrange revisit
                            </button>
                          )}

                        {user.role === "customer" &&
                          c.status === "revisit_scheduled" && (
                            <button
                              type="button"
                              disabled={updating === c._id}
                              onClick={() => update(c, "resolved")}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                            >
                              {updating === c._id ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <CircleCheck size={16} />
                              )}
                              Confirm revisit completed
                            </button>
                          )}

                        {user.role === "customer" &&
                          !["resolved", "rejected", "escalated"].includes(
                            c.status
                          ) && (
                            <button
                              type="button"
                              disabled={updating === c._id}
                              onClick={() => update(c, "escalated")}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-800 transition hover:bg-orange-100 disabled:opacity-50"
                            >
                              <AlertCircle size={16} />
                              Escalate claim
                            </button>
                          )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <ClipboardCheck size={30} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    No warranty claims
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Claims you submit or need to review will appear here.
                  </p>
                  <Empty text="No warranty claims" />
                </div>
              )
            }
          </Data>
        </section>

        {/* Claim dialog */}
        {claiming && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && !busy) {
                setClaiming(null);
                setError("");
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="claim-dialog-title"
              className="my-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <RefreshCw size={23} />
                  </div>
                  <div>
                    <h2
                      id="claim-dialog-title"
                      className="text-xl font-bold text-slate-950"
                    >
                      Claim free revisit
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {claiming.number || claiming.category || "Warranty"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setClaiming(null);
                    setError("");
                  }}
                  aria-label="Close claim form"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                This claim should relate to the same fault covered by your
                warranty. Your technician will review the request.
              </div>

              <form onSubmit={claim}>
                <label
                  htmlFor="claim-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Describe the covered fault
                </label>

                <textarea
                  id="claim-description"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError("");
                  }}
                  placeholder="Explain the same issue that was covered by the original repair warranty..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                />

                <div className="mt-2 flex justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    Minimum 10 characters
                  </p>
                  <p className="text-xs text-slate-400">
                    {description.length}/2000
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                  >
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <p className="leading-5">{error}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setClaiming(null);
                      setError("");
                    }}
                    className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={busy || description.trim().length < 10}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Submit claim
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-emerald-700"
          />
          <p className="text-xs leading-6 text-emerald-900/80">
            Warranty coverage depends on the issued warranty's terms,
            expiry date and exclusions. Claim status reflects the current
            workflow recorded by the platform.
          </p>
        </div>
      </div>
    </main>
  );
}
