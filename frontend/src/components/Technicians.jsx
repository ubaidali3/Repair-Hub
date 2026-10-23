
import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  UserRound,
  ShieldCheck,
  Wrench,
  Sparkles,
  BriefcaseBusiness,
  CheckCircle2,
  Users,
  CalendarCheck,
} from "lucide-react";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import PhotoGrid from "./PhotoGrid.jsx";

export default function Technicians({ user }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero section */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full bg-white/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-700">
                <Sparkles size={14} />
                Hire directly
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Find the right
                <span className="block text-teal-700">
                  repair professional.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Browse approved technicians, explore their skills and
                previous work, and request a booking for your repair needs.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-600 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={17} className="text-emerald-600" />
                  Approved technicians
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarCheck size={17} className="text-teal-700" />
                  Direct booking requests
                </span>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Users size={21} />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  Skilled people
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Explore technician profiles
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={21} />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  Reviewed profiles
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Approved by the platform
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section heading */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
              <Wrench size={17} />
              Our professionals
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Approved technicians
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Find a technician whose skills match your repair requirements.
            </p>
          </div>
        </div>

        {/* Technician cards */}
        <Data url="/technicians">
          {(items) =>
            items.length ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((t) => {
                  const skills = Array.isArray(t.skills)
                    ? t.skills.filter(Boolean)
                    : [];

                  const initials =
                    (t.name || "Technician")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase() || "T";

                  return (
                    <article
                      key={t._id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5"
                    >
                      {/* Card top */}
                      <div className="relative h-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
                        <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                          <CheckCircle2 size={14} />
                          Verified
                        </div>
                      </div>

                      {/* Technician identity */}
                      <div className="px-5 pb-5 sm:px-6">
                        <div className="-mt-11 mb-4 flex items-end justify-between gap-3">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-700 shadow-sm">
                            {t.avatarUrl ? (
                              <img
                                src={t.avatarUrl}
                                alt={t.name || "Technician"}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
                                {initials || <UserRound size={30} />}
                              </div>
                            )}
                          </div>

                          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                            <BriefcaseBusiness size={19} />
                          </div>
                        </div>

                        <h3 className="break-words text-xl font-bold text-slate-950 transition group-hover:text-teal-800">
                          {t.name || "Repair Technician"}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <MapPin
                            size={16}
                            className="shrink-0 text-teal-700"
                          />
                          <span className="break-words">
                            {[t.area, t.city].filter(Boolean).join(", ") ||
                              "Location not listed"}
                          </span>
                        </p>

                        {/* Skills */}
                        <div className="mt-5">
                          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <Wrench size={14} className="text-teal-700" />
                            Skills & services
                          </div>

                          {skills.length ? (
                            <div className="flex flex-wrap gap-2">
                              {skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="max-w-full break-words rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800"
                                >
                                  {skill}
                                </span>
                              ))}

                              {skills.length > 5 && (
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                  +{skills.length - 5} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">
                              General repair services
                            </p>
                          )}
                        </div>

                        {/* Portfolio */}
                        {Array.isArray(t.portfolioImages) &&
                          t.portfolioImages.length > 0 && (
                            <div className="mt-5 border-t border-slate-100 pt-4">
                              <PhotoGrid urls={t.portfolioImages} />
                            </div>
                          )}

                        {/* Booking button */}
                        <div className="mt-6 border-t border-slate-100 pt-5">
                          {user?.role === "technician" ? (
                            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs font-medium leading-5 text-slate-500">
                              <ShieldCheck
                                size={16}
                                className="shrink-0 text-slate-400"
                              />
                              Booking requests are for customers
                            </div>
                          ) : (
                            <Link
                              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-teal-700/10 transition hover:bg-teal-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-100"
                              to={`/technicians/${t._id}/book`}
                            >
                              Request booking
                              <ArrowRight
                                size={17}
                                className="transition group-hover:translate-x-1"
                              />
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Users size={30} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  No technicians available yet
                </h3>
                <p className="mx-auto mb-5 max-w-md text-sm leading-6 text-slate-500">
                  There are no approved technicians listed right now. Please
                  check back later.
                </p>
                <Empty text="No approved technicians listed yet." />
              </div>
            )
          }
        </Data>

        {/* Bottom banner */}
        <section className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 to-emerald-700 p-6 text-white shadow-lg shadow-teal-900/10 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <ShieldCheck size={25} />
              </div>
              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  Choose the right professional
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50/90">
                  Review each technician's listed skills and portfolio before
                  sending your booking request.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold">
              <CheckCircle2 size={17} />
              Make an informed choice
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
