
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Wrench,
  Sparkles,
  ShieldCheck,
  Clock3,
  Banknote,
  BadgeCheck,
  FileText,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ClipboardList,
  Info,
} from "lucide-react";

import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import PhotoGrid from "./PhotoGrid.jsx";

const inputStyles =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-teal-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

function FieldLabel({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
      {Icon && <Icon size={16} className="text-teal-600" />}
      {children}
    </span>
  );
}

export default function JobDetail({ user, flash }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bid, setBid] = useState({
    price: "",
    durationHours: "",
    warrantyDays: "0",
    message: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      await api.post(`/requests/${id}/bids`, {
        ...bid,
        price: Number(bid.price),
        durationHours: Number(bid.durationHours),
        warrantyDays: Number(bid.warrantyDays),
      });

      flash("Bid submitted successfully");
      navigate("/dashboard");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 sm:py-10 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-96 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-teal-700"
        >
          <ArrowLeft size={17} />
          Go back
        </button>

        <Data url="/requests">
          {(items) => {
            const job = items.find((x) => x._id === id);

            if (!job) {
              return (
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-900/[0.03] sm:p-10">
                  <Empty text="This request is no longer open or does not exist." />
                  <div className="mt-5 flex justify-center">
                    <Link
                      to="/jobs"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-700"
                    >
                      Browse available jobs
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <>
                {/* Job hero */}
                <section className="relative mb-7 overflow-hidden rounded-3xl border border-teal-100 bg-white p-5 shadow-xl shadow-teal-900/5 sm:p-8 lg:p-10">
                  <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-teal-100/70 blur-3xl" />

                  <div className="relative">
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700">
                        <Wrench size={14} />
                        {job.category}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                        <Sparkles size={14} />
                        Repair opportunity
                      </span>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <h1 className="break-words text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                          {job.title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                          Review the repair requirements and submit your best
                          offer to the customer.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                            <MapPin
                              size={18}
                              className="shrink-0 text-teal-600"
                            />
                            {job.city}
                            {job.area ? `, ${job.area}` : ""}
                          </div>

                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                            <ClipboardList
                              size={18}
                              className="shrink-0 text-teal-600"
                            />
                            Repair request details
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-100">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                          <ShieldCheck size={23} />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-900">
                            RepairHub
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Technician workspace
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.1fr_0.9fr]">
                  {/* Job information */}
                  <div className="space-y-6">
                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/[0.03] sm:p-7">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                          <FileText size={22} />
                        </div>

                        <div>
                          <h2 className="text-xl font-black text-slate-900">
                            Repair description
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Customer's reported issue
                          </p>
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 sm:text-base">
                        {job.description || "No description provided."}
                      </p>
                    </section>

                    {/* Photos */}
                    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/[0.03] sm:p-7">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                          <Sparkles size={22} />
                        </div>

                        <div>
                          <h2 className="text-xl font-black text-slate-900">
                            Repair photos
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Images provided with the request
                          </p>
                        </div>
                      </div>

                      {job.images?.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4">
                          <PhotoGrid urls={job.images} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                            <FileText size={23} />
                          </div>
                          <p className="mt-3 text-sm font-bold text-slate-700">
                            No photos available
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            The customer did not attach any images.
                          </p>
                        </div>
                      )}
                    </section>

                    {/* Location */}
                    <section className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-lg shadow-teal-900/[0.03]">
                      <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                          <MapPin size={22} />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-900">
                            Service location
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Where the repair is needed
                          </p>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6">
                        <p className="break-words text-lg font-extrabold text-slate-900">
                          {[job.area, job.city].filter(Boolean).join(", ") ||
                            "Location not specified"}
                        </p>

                        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-teal-50/70 p-4 text-sm leading-6 text-teal-800">
                          <Info size={18} className="mt-0.5 shrink-0" />
                          <p>
                            Confirm the service location and repair details
                            with the customer before arranging the visit.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Bid form */}
                  <aside className="space-y-5 lg:sticky lg:top-6">
                    {user?.role === "technician" ? (
                      <>
                        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/[0.04]">
                          <div className="bg-gradient-to-r from-teal-700 to-emerald-600 p-5 text-white sm:p-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                                <Banknote size={24} />
                              </div>

                              <div>
                                <h2 className="text-xl font-black">
                                  Submit your bid
                                </h2>
                                <p className="mt-1 text-sm text-teal-50">
                                  Send your offer to the customer.
                                </p>
                              </div>
                            </div>
                          </div>

                          <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
                            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                              <div className="flex items-start gap-2.5">
                                <ShieldCheck
                                  size={19}
                                  className="mt-0.5 shrink-0 text-amber-600"
                                />
                                <div>
                                  <p className="text-sm font-extrabold text-amber-900">
                                    Technician verification required
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-amber-800">
                                    Only admin-approved technicians can submit
                                    bids. Your account must be approved.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div>
                              <FieldLabel icon={Banknote}>
                                Your price (PKR)
                              </FieldLabel>
                              <input
                                required
                                type="number"
                                min="1"
                                step="any"
                                value={bid.price}
                                onChange={(e) =>
                                  setBid({
                                    ...bid,
                                    price: e.target.value,
                                  })
                                }
                                placeholder="e.g. 2500"
                                className={inputStyles}
                              />
                            </div>

                            {/* Duration */}
                            <div>
                              <FieldLabel icon={Clock3}>
                                Estimated duration (hours)
                              </FieldLabel>
                              <input
                                required
                                type="number"
                                min="1"
                                step="0.5"
                                value={bid.durationHours}
                                onChange={(e) =>
                                  setBid({
                                    ...bid,
                                    durationHours: e.target.value,
                                  })
                                }
                                placeholder="e.g. 2.5"
                                className={inputStyles}
                              />
                              <p className="mt-2 text-xs text-slate-400">
                                Estimate the time needed to finish the repair.
                              </p>
                            </div>

                            {/* Warranty */}
                            <div>
                              <FieldLabel icon={BadgeCheck}>
                                Warranty (days)
                              </FieldLabel>
                              <input
                                required
                                type="number"
                                min="0"
                                step="1"
                                value={bid.warrantyDays}
                                onChange={(e) =>
                                  setBid({
                                    ...bid,
                                    warrantyDays: e.target.value,
                                  })
                                }
                                placeholder="0"
                                className={inputStyles}
                              />
                              <p className="mt-2 text-xs text-slate-400">
                                Enter 0 if no warranty is offered.
                              </p>
                            </div>

                            {/* Message */}
                            <div>
                              <FieldLabel icon={FileText}>
                                Message to customer
                              </FieldLabel>
                              <textarea
                                rows={4}
                                maxLength={1000}
                                value={bid.message}
                                onChange={(e) =>
                                  setBid({
                                    ...bid,
                                    message: e.target.value,
                                  })
                                }
                                placeholder="Explain your approach, what's included, and any important details..."
                                className={`${inputStyles} min-h-28 resize-y`}
                              />

                              <p className="mt-2 text-right text-xs text-slate-400">
                                {bid.message.length}/1000
                              </p>
                            </div>

                            {error && (
                              <div
                                role="alert"
                                className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700"
                              >
                                <AlertCircle
                                  size={20}
                                  className="mt-0.5 shrink-0"
                                />
                                <span className="break-words">{error}</span>
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={busy}
                              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                              {busy ? (
                                <>
                                  <LoaderCircle
                                    size={19}
                                    className="animate-spin"
                                  />
                                  Submitting bid...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={19} />
                                  Submit bid
                                  <ArrowRight size={18} />
                                </>
                              )}
                            </button>

                            <p className="text-center text-xs leading-5 text-slate-400">
                              Make sure your price and estimated duration are
                              accurate before submitting.
                            </p>
                          </form>
                        </section>
                      </>
                    ) : (
                      <section className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-lg shadow-slate-900/[0.03] sm:p-8">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                          <ShieldCheck size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                          Technician access
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {user
                            ? "Only admin-approved technicians can submit bids for repair requests."
                            : "Sign in with a technician account to submit a bid on this repair request."}
                        </p>

                        {!user && (
                          <Link
                            to="/login"
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-700"
                          >
                            Sign in
                            <ArrowRight size={17} />
                          </Link>
                        )}

                        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-500">
                          <BadgeCheck
                            size={16}
                            className="text-teal-600"
                          />
                          Verified technicians only
                        </div>
                      </section>
                    )}

                    {/* Helpful note */}
                    <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                        <CalendarDays size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          Set clear expectations
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Include a fair price, realistic completion time, and
                          clear warranty terms in your offer.
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>

                {/* Bottom navigation */}
                <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <h3 className="font-black text-slate-900">
                      Looking for more opportunities?
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Explore other available repair requests.
                    </p>
                  </div>

                  <Link
                    to="/jobs"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  >
                    Browse jobs
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </>
            );
          }}
        </Data>
      </div>
    </main>
  );
}
