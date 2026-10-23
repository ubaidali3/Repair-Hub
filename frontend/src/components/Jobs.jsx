
import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Wrench,
  ClipboardList,
  Plus,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import PhotoGrid from "./PhotoGrid.jsx";

export default function Jobs({ user, flash }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-teal-800 shadow-sm sm:text-sm">
            <ShieldCheck size={17} />
            Repair Marketplace
            <Sparkles size={15} className="text-amber-500" />
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="animate-fade-up">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Available Repair Jobs
                <span className="mt-1 block text-teal-700">
                  Find the right opportunity.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Explore repair requests, connect with customers, and
                find the right technician or service opportunity for
                your home repairs.
              </p>
            </div>

            {user?.role === "customer" && (
              <Link
                to="/requests/new"
                className="group inline-flex min-h-14 w-fit shrink-0 items-center justify-center gap-3 rounded-2xl bg-teal-700 px-6 py-4 font-bold text-white shadow-lg shadow-teal-900/15 transition duration-300 hover:-translate-y-1 hover:bg-teal-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                <Plus size={19} />
                Post a Repair
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
        </header>

        {/* Marketplace Banner */}
        <section className="relative isolate mb-10 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-5 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 -z-10 size-48 rounded-full bg-teal-200/40 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-teal-700 shadow-sm">
              <Wrench size={28} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-950 sm:text-xl">
                  Your next repair starts here
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 size={13} />
                  Easy to explore
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Check the job description, view available photos,
                and review the location before opening a request.
              </p>
            </div>

            <div className="hidden size-16 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/60 text-teal-700 sm:flex">
              <ClipboardList size={32} strokeWidth={1.5} />
            </div>
          </div>
        </section>

        {/* Section Heading */}
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.2em] text-teal-700">
                <span className="h-0.5 w-7 rounded-full bg-teal-600" />
                OPPORTUNITIES
              </div>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Open Repair Requests
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                Browse customer requests and discover available jobs.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm sm:self-auto">
              <ClipboardList size={18} className="text-teal-700" />
              Repair listings
            </div>
          </div>

          {/* Jobs Data */}
          <Data url="/requests">
            {(items) =>
              items.length ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((x) => (
                    <article
                      key={x._id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/[0.06]"
                    >
                      {/* Card Header */}
                      <div className="p-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 ring-1 ring-teal-100">
                            <Wrench size={14} className="shrink-0" />
                            <span className="break-words">
                              {x.category || "General Repair"}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            Open
                          </span>
                        </div>

                        <h3 className="break-words text-xl font-extrabold leading-7 text-slate-950 transition-colors duration-200 group-hover:text-teal-800">
                          {x.title}
                        </h3>
                      </div>

                      {/* Images */}
                      <div className="px-5 sm:px-6">
                        {x.images?.length ? (
                          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-[#f8fbfa]">
                            <PhotoGrid urls={x.images} />
                          </div>
                        ) : (
                          <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-teal-100 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 text-teal-700">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-white shadow-sm">
                              <ImageIcon size={24} />
                            </div>

                            <span className="text-xs font-semibold text-slate-500">
                              No images available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <p className="mb-5 whitespace-pre-line break-words text-sm leading-7 text-slate-600">
                          {x.description || "No description provided."}
                        </p>

                        {/* Location */}
                        <div className="mt-auto flex items-start gap-3 rounded-2xl border border-teal-100/70 bg-[#f8fbfa] p-4">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                            <MapPin size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                              Job Location
                            </p>

                            <p className="mt-1.5 break-words text-sm font-bold text-slate-800">
                              {[x.city, x.area]
                                .filter(Boolean)
                                .join(", ") || "Location not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-5 border-t border-slate-100 pt-5">
                          <Link
                            to={"/jobs/" + x._id}
                            className="group/button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-teal-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-200"
                          >
                            View Request
                            <ArrowRight
                              size={17}
                              className="transition-transform duration-300 group-hover/button:translate-x-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-teal-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16">
                  <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <ClipboardList size={30} />
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                    No repair requests yet
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                    New repair requests will appear here when customers
                    post jobs on the marketplace.
                  </p>

                  {user?.role === "customer" && (
                    <Link
                      to="/requests/new"
                      className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3 font-bold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200"
                    >
                      <Plus size={18} />
                      Post a Repair
                    </Link>
                  )}

                  <div className="mt-5">
                    <Empty text="No open repair requests yet." />
                  </div>
                </div>
              )
            }
          </Data>
        </section>

        {/* Bottom Trust Banner */}
        <section className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 p-6 text-white shadow-xl shadow-teal-900/10 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full border-[30px] border-white/5" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <ShieldCheck size={26} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold sm:text-2xl">
                  Find the right repair professional
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-teal-50">
                  Explore job details and take the next step toward
                  getting your repair sorted.
                </p>
              </div>
            </div>

            <Link
              to="/technicians"
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-teal-800 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Find a Technician
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
