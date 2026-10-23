
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Wrench,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  Banknote,
  UserRound,
  Pencil,
  Trash2,
  LoaderCircle,
  BriefcaseBusiness,
  BadgeCheck,
  FileText,
} from "lucide-react";

import { api } from "../lib/api.js";
import { money, message } from "../lib/helpers.js";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import Gate from "./Gate.jsx";
import PhotoGrid from "./PhotoGrid.jsx";

const statusStyles = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  accepted: "bg-teal-50 text-teal-700 ring-teal-100",
  completed: "bg-blue-50 text-blue-700 ring-blue-100",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
  rejected: "bg-rose-50 text-rose-700 ring-rose-100",
  in_progress: "bg-sky-50 text-sky-700 ring-sky-100",
};

function StatusBadge({ status }) {
  const normalized = String(status || "unknown").toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ${
        statusStyles[normalized] ||
        "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-5 flex items-start gap-3 sm:gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 sm:h-12 sm:w-12">
        <Icon size={22} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "secondary",
  disabled = false,
}) {
  const styles =
    variant === "primary"
      ? "border-transparent bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700"
      : variant === "danger"
        ? "border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100"
        : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${styles}`}
    >
      {children}
    </button>
  );
}

function InfoItem({ icon: Icon, children }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 text-sm text-slate-500">
      <Icon size={17} className="mt-0.5 shrink-0 text-teal-600" />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export default function Dashboard({ user, flash }) {
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  async function accept(id) {
    if (busy) return;

    if (!window.confirm("Accept this bid? Other offers will close.")) return;

    setBusy(id);
    setError("");

    try {
      await api.post(`/bids/${id}/accept`);
      flash("Bid accepted. Booking confirmed.");
      setRefresh((x) => x + 1);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy("");
    }
  }

  async function editRequest(request) {
    const title = window.prompt("Update repair title", request.title);

    if (!title?.trim() || title.trim() === request.title) return;

    setError("");

    try {
      await api.patch(`/requests/${request._id}`, {
        title: title.trim(),
      });

      flash("Repair request title updated.");
      setRefresh((x) => x + 1);
    } catch (e) {
      setError(message(e));
    }
  }

  async function cancelRequest(id) {
    if (!window.confirm("Cancel this repair request?")) return;

    setError("");

    try {
      await api.delete(`/requests/${id}`);
      flash("Repair request cancelled.");
      setRefresh((x) => x + 1);
    } catch (e) {
      setError(message(e));
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f8fbfa] px-4 py-12 sm:px-6">
        <Gate />
      </main>
    );
  }

  const isCustomer = user.role === "customer";
  const isTechnician = user.role === "technician";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbfa] text-slate-800">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-80 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Dashboard header */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-teal-100 bg-white p-5 shadow-xl shadow-teal-900/5 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-24 h-32 w-32 rounded-full bg-emerald-100/60 blur-2xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-teal-700">
                <Sparkles size={15} />
                {user.role} workspace
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="h-16 w-16 shrink-0 rounded-2xl border-2 border-white object-cover shadow-lg ring-1 ring-teal-100 sm:h-20 sm:w-20"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-600/20 sm:h-20 sm:w-20">
                    <UserRound size={34} />
                  </div>
                )}

                <div className="min-w-0">
                  <h1 className="break-words text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                    Hello,{" "}
                    <span className="text-teal-600">{user.name}</span>
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    {isCustomer
                      ? "Manage your repair requests, compare technician bids, and keep track of your bookings."
                      : "Discover repair opportunities, manage your submitted bids, and keep your work organized."}
                  </p>

                  <Link
                    to="/profile"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:gap-3 hover:text-teal-800"
                  >
                    <ShieldCheck size={17} />
                    Manage profile, photos & 2FA
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              {isCustomer ? (
                <Link
                  to="/requests/new"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition duration-200 hover:-translate-y-1 hover:bg-teal-700"
                >
                  <Wrench size={18} />
                  New repair request
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  to="/jobs"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition duration-200 hover:-translate-y-1 hover:bg-teal-700"
                >
                  <BriefcaseBusiness size={18} />
                  Browse jobs
                  <ArrowRight size={16} />
                </Link>
              )}

              <Link
                to="/bookings"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                <CalendarDays size={18} />
                My bookings
              </Link>
            </div>
          </div>
        </section>

        {/* Technician verification notice */}
        {isTechnician && (
          <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                <ShieldCheck size={23} />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900">
                  Technician verification
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Only approved technicians can submit bids or accept bookings.
                </p>
              </div>
            </div>

            <StatusBadge status={user.verification || "pending"} />
          </section>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
          >
            <XCircle size={20} className="mt-0.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-rose-100"
              aria-label="Dismiss error"
            >
              <XCircle size={17} />
            </button>
          </div>
        )}

        {/* Customer dashboard */}
        {isCustomer ? (
          <section>
            <SectionHeading
              eyebrow="Your activity"
              title="My repair requests"
              description="Track your requests, review offers, and choose the right technician."
              icon={ClipboardList}
            />

            <Data url="/requests/mine" refresh={refresh}>
              {(items) =>
                items.length ? (
                  <div className="space-y-6">
                    {items.map((r) => (
                      <article
                        key={r._id}
                        className="group overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/[0.03] transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/[0.06] sm:p-7"
                      >
                        {/* Request title */}
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <StatusBadge status={r.status} />
                              <span className="text-xs font-medium text-slate-400">
                                Repair request
                              </span>
                            </div>

                            <h3 className="break-words text-xl font-black text-slate-900 transition group-hover:text-teal-700 sm:text-2xl">
                              {r.title}
                            </h3>

                            <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                              {r.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                              <InfoItem icon={Wrench}>
                                {r.category || "General repair"}
                              </InfoItem>
                              <InfoItem icon={MapPin}>
                                {r.city || "Location not specified"}
                              </InfoItem>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 self-start rounded-2xl bg-teal-50 px-4 py-3 text-teal-700 ring-1 ring-teal-100">
                            <FileText size={19} />
                            <span className="text-sm font-extrabold">
                              {r.status === "open"
                                ? "Open request"
                                : "Request details"}
                            </span>
                          </div>
                        </div>

                        {/* Request photos */}
                        {r.images?.length > 0 && (
                          <div className="mt-6 rounded-2xl bg-slate-50 p-3 sm:p-4">
                            <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                              <Sparkles size={15} className="text-teal-600" />
                              Repair photos
                            </p>
                            <PhotoGrid urls={r.images} />
                          </div>
                        )}

                        {/* Request actions */}
                        {r.status === "open" && (
                          <div className="mt-5 flex flex-col gap-2 border-b border-slate-100 pb-6 sm:flex-row">
                            <ActionButton onClick={() => editRequest(r)}>
                              <Pencil size={16} />
                              Edit title
                            </ActionButton>

                            <ActionButton
                              variant="danger"
                              onClick={() => cancelRequest(r._id)}
                            >
                              <Trash2 size={16} />
                              Cancel request
                            </ActionButton>
                          </div>
                        )}

                        {/* Bids */}
                        <div className="mt-6">
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h4 className="text-lg font-black text-slate-900">
                                Received bids
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                Compare offers before accepting one.
                              </p>
                            </div>

                            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700">
                              Offers
                            </span>
                          </div>

                          <Data
                            url={`/requests/${r._id}/bids`}
                            refresh={refresh}
                          >
                            {(bids) =>
                              bids.length ? (
                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                  {bids.map((b) => (
                                    <div
                                      key={b._id}
                                      className="rounded-2xl border border-slate-100 bg-[#fbfdfc] p-4 transition duration-200 hover:border-teal-200 hover:bg-white sm:p-5"
                                    >
                                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                                              <UserRound size={21} />
                                            </div>

                                            <div className="min-w-0">
                                              <h5 className="break-words font-extrabold text-slate-900">
                                                {b.technician?.name ||
                                                  "Technician"}
                                              </h5>
                                              <div className="mt-1">
                                                <StatusBadge
                                                  status={b.status}
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mt-4 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                                            <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                                              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                <Banknote
                                                  size={14}
                                                  className="text-teal-600"
                                                />
                                                Price
                                              </p>
                                              <p className="mt-1 break-words text-lg font-black text-teal-700">
                                                {money(b.price)}
                                              </p>
                                            </div>

                                            <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                                              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                <Clock3
                                                  size={14}
                                                  className="text-teal-600"
                                                />
                                                Duration
                                              </p>
                                              <p className="mt-1 text-sm font-extrabold text-slate-800">
                                                {b.durationHours} hours
                                              </p>
                                            </div>
                                          </div>

                                          <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                                            <BadgeCheck
                                              size={17}
                                              className="mt-0.5 shrink-0 text-emerald-600"
                                            />
                                            <span>
                                              {b.warrantyDays} days warranty
                                            </span>
                                          </div>

                                          {b.message && (
                                            <p className="mt-3 break-words rounded-xl bg-white p-3 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
                                              {b.message}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {r.status === "open" &&
                                        b.status === "pending" && (
                                          <button
                                            type="button"
                                            disabled={Boolean(busy)}
                                            onClick={() => accept(b._id)}
                                            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-extrabold text-white shadow-md shadow-teal-600/15 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                          >
                                            {busy === b._id ? (
                                              <>
                                                <LoaderCircle
                                                  size={17}
                                                  className="animate-spin"
                                                />
                                                Accepting offer...
                                              </>
                                            ) : (
                                              <>
                                                <CheckCircle2 size={17} />
                                                Accept bid
                                                <ArrowRight size={16} />
                                              </>
                                            )}
                                          </button>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-7">
                                  <Empty text="No bids received yet." />
                                </div>
                              )
                            }
                          </Data>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-lg shadow-slate-900/[0.03]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                      <Wrench size={30} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      No repair requests yet
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Post your first repair request and start receiving offers
                      from technicians.
                    </p>
                    <Link
                      to="/requests/new"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
                    >
                      Create repair request
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                )
              }
            </Data>
          </section>
        ) : (
          /* Technician dashboard */
          <section>
            <SectionHeading
              eyebrow="Your activity"
              title="My submitted bids"
              description="Review the offers you've submitted and check their current status."
              icon={BriefcaseBusiness}
            />

            <Data url="/bids/mine" refresh={refresh}>
              {(items) =>
                items.length ? (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {items.map((b) => (
                      <article
                        key={b._id}
                        className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/[0.03] transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/[0.06] sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 transition group-hover:bg-teal-600 group-hover:text-white">
                            <Wrench size={23} />
                          </div>
                          <StatusBadge status={b.status} />
                        </div>

                        <h3 className="mt-5 break-words text-xl font-black text-slate-900 transition group-hover:text-teal-700">
                          {b.request?.title || "Repair request"}
                        </h3>

                        <div className="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                          <div className="rounded-2xl bg-teal-50/70 p-4 ring-1 ring-teal-100/70">
                            <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <Banknote size={15} className="text-teal-700" />
                              Your bid
                            </p>
                            <p className="mt-2 break-words text-xl font-black text-teal-700">
                              {money(b.price)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                            <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <Clock3 size={15} className="text-teal-700" />
                              Duration
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-800">
                              {b.durationHours} hours
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                          <BadgeCheck
                            size={17}
                            className="shrink-0 text-emerald-600"
                          />
                          {b.warrantyDays} days warranty
                        </div>

                        {b.message && (
                          <div className="mt-4 rounded-2xl border border-slate-100 bg-[#fbfdfc] p-4">
                            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                              Your message
                            </p>
                            <p className="break-words text-sm leading-6 text-slate-600">
                              {b.message}
                            </p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-lg shadow-slate-900/[0.03]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                      <BriefcaseBusiness size={30} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      No bids submitted yet
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Browse available repair jobs and submit a bid to get
                      started.
                    </p>
                    <Link
                      to="/jobs"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
                    >
                      Browse available jobs
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                )
              }
            </Data>
          </section>
        )}

        {/* Bottom banner */}
        <section className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 text-white shadow-xl shadow-teal-900/10 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <ShieldCheck size={25} />
              </div>
              <div>
                <h3 className="text-lg font-black sm:text-xl">
                  Your repairs, organized in one place
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50">
                  Keep track of your activity, review your offers, and manage
                  your bookings through your personalized workspace.
                </p>
              </div>
            </div>

            <Link
              to="/bookings"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-teal-700 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-50"
            >
              Manage bookings
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pb-3 text-xs font-medium text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-teal-600" />
            Your workspace
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-teal-600" />
            Repair activity tracking
          </span>
        </footer>
      </div>
    </main>
  );
}
