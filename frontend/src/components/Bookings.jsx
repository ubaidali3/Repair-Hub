
import React, { useState } from "react";
import {
  MapPin,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Wrench,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Banknote,
  Star,
  Clock3,
  ClipboardList,
  BadgeCheck,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import { api } from "../lib/api.js";
import { money, message } from "../lib/helpers.js";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import Gate from "./Gate.jsx";

const statusStyles = {
  requested: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-teal-50 text-teal-700 ring-teal-200",
  in_progress: "bg-sky-50 text-sky-700 ring-sky-200",
  awaiting_confirmation:
    "bg-violet-50 text-violet-700 ring-violet-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  declined: "bg-red-50 text-red-700 ring-red-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

const formatStatus = (status = "") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (c) =>
    c.toUpperCase()
  );

function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) {
  const styles = {
    primary:
      "bg-teal-700 text-white shadow-lg shadow-teal-900/10 hover:bg-teal-800",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700",
    danger:
      "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2
        rounded-xl px-4 py-3 text-sm font-bold
        transition duration-300 hover:-translate-y-0.5
        focus:outline-none focus:ring-4 focus:ring-teal-100
        disabled:cursor-not-allowed disabled:opacity-50
        disabled:hover:translate-y-0 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default function Bookings({ user, flash }) {
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState("");

  const isTechnician = user?.role === "technician";

  async function respond(id, decision) {
    setBusy(id);
    setError("");

    try {
      await api.patch(`/bookings/${id}/respond`, { decision });

      flash(
        decision === "accept"
          ? "Booking confirmed"
          : "Booking declined"
      );

      setRefresh((x) => x + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy("");
    }
  }

  async function runAction(key, action, successText) {
    setWorking(key);
    setError("");

    try {
      await action();
      if (successText) flash(successText);
      setRefresh((x) => x + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setWorking("");
    }
  }

  async function openChat(id) {
    try {
      await api.post(`/bookings/${id}/conversation`);
      flash("Conversation ready. Open Messages from navigation.");
    } catch (e) {
      flash(message(e));
    }
  }

  async function createWarranty(id) {
    const coveredFault = window.prompt(
      "Describe the covered fault / components"
    );

    if (!coveredFault?.trim()) return;

    await runAction(
      `warranty-${id}`,
      () =>
        api.post(`/bookings/${id}/warranty`, {
          coveredFault: coveredFault.trim(),
        }),
      "Warranty created"
    );
  }

  async function leaveReview(id) {
    const answer = window.prompt("Rating from 1 to 5");

    if (answer === null || answer.trim() === "") return;

    const rating = Number(answer);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      flash("Please enter a whole number from 1 to 5.");
      return;
    }

    await runAction(
      `review-${id}`,
      () =>
        api.post(`/bookings/${id}/reviews`, {
          rating,
          comment: "",
        }),
      "Review saved"
    );
  }

  function Progress({ actionKey }) {
    return working === actionKey ? (
      <LoaderCircle size={17} className="animate-spin" />
    ) : null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbfa] px-5 py-10 text-slate-800 sm:px-8 sm:py-14 lg:px-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-0 size-96 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-80 -z-0 size-96 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-9 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/90 px-4 py-2 text-xs font-bold text-teal-800 shadow-sm sm:text-sm">
            <ShieldCheck size={17} />
            Service management
            <Sparkles size={15} className="text-amber-500" />
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                My bookings
                <span className="ml-2 text-teal-700">.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                Manage your service requests, track repair progress,
                and keep everything organized in one place.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <ClipboardList size={24} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900">
                  RepairHub
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {isTechnician
                    ? "Technician dashboard"
                    : "Customer dashboard"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {!user ? (
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
            <Gate />
          </section>
        ) : (
          <>
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <XCircle size={20} className="mt-0.5 shrink-0" />
                <p className="flex-1">{error}</p>
                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Close error"
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}

            <Data url="/bookings/mine" refresh={refresh}>
              {(items) =>
                items.length ? (
                  <div className="space-y-6">
                    {/* Section heading */}
                    <div className="mb-2 flex items-center gap-3">
                      <div className="h-7 w-1.5 rounded-full bg-teal-600" />
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                          Your service requests
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Review booking details and manage your next steps.
                        </p>
                      </div>
                    </div>

                    {items.map((b, index) => {
                      const status = b.status;
                      const statusText = {
                        requested: "Waiting for technician",
                        confirmed: "Booking confirmed",
                        in_progress: "Repair in progress",
                        awaiting_confirmation: "Awaiting confirmation",
                        completed: "Repair completed",
                        declined: "Booking declined",
                        cancelled: "Booking cancelled",
                      };

                      const isBusy =
                        busy === b._id ||
                        working.endsWith(b._id);

                      return (
                        <article
                          key={b._id}
                          className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/[0.06]"
                          style={{
                            animationDelay: `${index * 80}ms`,
                          }}
                        >
                          {/* Card heading */}
                          <div className="p-5 sm:p-7">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex min-w-0 items-start gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition duration-300 group-hover:bg-teal-100 sm:size-16">
                                  <Wrench size={29} strokeWidth={1.7} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span
                                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${
                                        statusStyles[status] ||
                                        "bg-slate-100 text-slate-600 ring-slate-200"
                                      }`}
                                    >
                                      {formatStatus(status)}
                                    </span>

                                    <span className="text-xs text-slate-400">
                                      ID: {b._id.slice(-6).toUpperCase()}
                                    </span>
                                  </div>

                                  <h3 className="break-words text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
                                    {b.category}
                                  </h3>

                                  <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-slate-500">
                                    {b.description}
                                  </p>
                                </div>
                              </div>

                              <div className="rounded-2xl border border-teal-100/80 bg-gradient-to-br from-teal-50/80 to-emerald-50/70 p-4 sm:min-w-40 sm:text-right">
                                <p className="text-xs font-semibold uppercase tracking-wider text-teal-800/70">
                                  Service price
                                </p>
                                <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-teal-800">
                                  {money(b.price)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {b.source === "bid"
                                    ? "Accepted bid"
                                    : "Direct request"}
                                </p>
                              </div>
                            </div>

                            {/* Information grid */}
                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-teal-100 hover:bg-teal-50/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                                  <MapPin size={19} />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Location
                                  </p>
                                  <p className="mt-1.5 break-words text-sm font-bold text-slate-800">
                                    {[b.city, b.area]
                                      .filter(Boolean)
                                      .join(", ") || "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-teal-100 hover:bg-teal-50/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                                  <CalendarDays size={19} />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Preferred schedule
                                  </p>
                                  <p className="mt-1.5 break-words text-sm font-bold text-slate-800">
                                    {b.preferredAt
                                      ? new Date(
                                          b.preferredAt
                                        ).toLocaleString()
                                      : "Schedule to be agreed"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-teal-100 hover:bg-teal-50/40 sm:col-span-2 lg:col-span-1">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                                  {status === "completed" ? (
                                    <CheckCircle2 size={19} />
                                  ) : (
                                    <Clock3 size={19} />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Current progress
                                  </p>
                                  <p className="mt-1.5 break-words text-sm font-bold text-slate-800">
                                    {statusText[status] ||
                                      formatStatus(status)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action footer */}
                          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5 sm:px-7">
                            <div className="mb-4 flex items-center gap-2">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                                <BadgeCheck size={17} />
                              </div>
                              <p className="text-sm font-extrabold text-slate-800">
                                Manage booking
                              </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                              {[
                                "confirmed",
                                "in_progress",
                                "awaiting_confirmation",
                                "completed",
                              ].includes(status) && (
                                <ActionButton
                                  variant="secondary"
                                  onClick={() => openChat(b._id)}
                                >
                                  <MessageCircle size={18} />
                                  Open chat
                                  <ArrowRight size={15} />
                                </ActionButton>
                              )}

                              {isTechnician && status === "requested" && (
                                <>
                                  <ActionButton
                                    variant="danger"
                                    disabled={busy === b._id}
                                    onClick={() =>
                                      respond(b._id, "decline")
                                    }
                                  >
                                    {busy === b._id ? (
                                      <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <XCircle size={17} />
                                    )}
                                    Decline
                                  </ActionButton>

                                  <ActionButton
                                    disabled={busy === b._id}
                                    onClick={() =>
                                      respond(b._id, "accept")
                                    }
                                  >
                                    {busy === b._id ? (
                                      <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <CheckCircle2 size={17} />
                                    )}
                                    Accept booking
                                    <ArrowRight size={16} />
                                  </ActionButton>
                                </>
                              )}

                              {isTechnician && status === "confirmed" && (
                                <ActionButton
                                  disabled={isBusy}
                                  onClick={() =>
                                    runAction(
                                      `start-${b._id}`,
                                      () =>
                                        api.patch(
                                          `/bookings/${b._id}/status`,
                                          { status: "in_progress" }
                                        ),
                                      "Repair started"
                                    )
                                  }
                                >
                                  <Wrench size={18} />
                                  Start repair
                                  <Progress actionKey={`start-${b._id}`} />
                                </ActionButton>
                              )}

                              {isTechnician && status === "in_progress" && (
                                <ActionButton
                                  disabled={isBusy}
                                  onClick={() =>
                                    runAction(
                                      `finish-${b._id}`,
                                      () =>
                                        api.patch(
                                          `/bookings/${b._id}/status`,
                                          {
                                            status:
                                              "awaiting_confirmation",
                                          }
                                        ),
                                      "Completion requested"
                                    )
                                  }
                                >
                                  <CheckCircle2 size={18} />
                                  Request completion
                                  <Progress actionKey={`finish-${b._id}`} />
                                </ActionButton>
                              )}

                              {user.role === "customer" &&
                                status === "awaiting_confirmation" && (
                                  <ActionButton
                                    variant="success"
                                    disabled={isBusy}
                                    onClick={() =>
                                      runAction(
                                        `complete-${b._id}`,
                                        () =>
                                          api.patch(
                                            `/bookings/${b._id}/status`,
                                            { status: "completed" }
                                          ),
                                        "Repair marked as completed"
                                      )
                                    }
                                  >
                                    <CheckCircle2 size={18} />
                                    Confirm repair complete
                                    <Progress
                                      actionKey={`complete-${b._id}`}
                                    />
                                  </ActionButton>
                                )}

                              {status === "completed" && (
                                <ActionButton
                                  variant="secondary"
                                  disabled={isBusy}
                                  onClick={() =>
                                    runAction(
                                      `cash-${b._id}`,
                                      () =>
                                        api.post(`/bookings/${b._id}/cash`),
                                      isTechnician
                                        ? "Cash marked received"
                                        : "Cash payment confirmed"
                                    )
                                  }
                                >
                                  <Banknote size={18} />
                                  {isTechnician
                                    ? "Mark cash received"
                                    : "Confirm cash paid"}
                                  <Progress actionKey={`cash-${b._id}`} />
                                </ActionButton>
                              )}

                              {isTechnician &&
                                status === "completed" &&
                                b.warrantyDays > 0 && (
                                  <ActionButton
                                    variant="secondary"
                                    disabled={isBusy}
                                    onClick={() => createWarranty(b._id)}
                                  >
                                    <ShieldCheck size={18} />
                                    Issue warranty
                                    <Progress
                                      actionKey={`warranty-${b._id}`}
                                    />
                                  </ActionButton>
                                )}

                              {user.role === "customer" &&
                                status === "completed" && (
                                  <ActionButton
                                    variant="secondary"
                                    disabled={isBusy}
                                    onClick={() => leaveReview(b._id)}
                                  >
                                    <Star size={18} />
                                    Leave review
                                    <Progress
                                      actionKey={`review-${b._id}`}
                                    />
                                  </ActionButton>
                                )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-teal-200 bg-white/80 px-5 py-12 text-center shadow-sm sm:py-16">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <ClipboardList size={30} />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                      No bookings yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                      Your service requests will appear here. Once you
                      book a technician, you can manage your repair
                      right from this page.
                    </p>

                    <div className="mt-6 flex justify-center">
                      <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
                        <ShieldCheck size={17} />
                        RepairHub
                      </div>
                    </div>
                  </div>
                )
              }
            </Data>
          </>
        )}

        {/* Bottom trust note */}
        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-teal-100/80 bg-white/70 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <ShieldCheck size={23} />
          </div>

          <div>
            <p className="font-extrabold text-slate-900">
              Your repair, your decision.
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Keep track of your bookings and coordinate with your
              technician throughout the repair process.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
