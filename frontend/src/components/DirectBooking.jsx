import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Wrench,
  MapPin,
  CalendarDays,
  FileText,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  LoaderCircle,
  Zap,
  Snowflake,
  Droplets,
  Refrigerator,
  WashingMachine,
  Settings,
  Clock3,
} from "lucide-react";

import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";
import Gate from "./Gate.jsx";

const categories = [
  { name: "Electrical", icon: Zap },
  { name: "Fan Repair", icon: Settings },
  { name: "AC Service", icon: Snowflake },
  { name: "Plumbing", icon: Droplets },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Appliance Repair", icon: Wrench },
];

const inputStyles =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-teal-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

function FieldLabel({ children, icon: Icon }) {
  return (
    <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
      {Icon && <Icon size={16} className="text-teal-600" />}
      {children}
    </span>
  );
}

export default function DirectBooking({ user, flash }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "Electrical",
    description: "",
    city: "",
    area: "",
    preferredAt: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      await api.post("/bookings/direct", {
        ...form,
        city: form.city.trim(),
        area: form.area.trim(),
        description: form.description.trim(),
        technicianId: id,
        preferredAt: new Date(form.preferredAt).toISOString(),
      });

      flash("Booking request sent. The technician must accept it.");
      navigate("/bookings");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  const minDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  if (user?.role !== "customer") {
    return (
      <main className="min-h-screen bg-[#f8fbfa] px-4 py-12 sm:px-6">
        <Gate />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 sm:py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-96 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-teal-700"
        >
          <ArrowLeft size={17} />
          Go back
        </button>

        <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          {/* Left information panel */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 p-6 text-white shadow-xl shadow-teal-900/10 sm:p-8 lg:sticky lg:top-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-2xl" />

            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Wrench size={28} />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-50">
                <Sparkles size={14} />
                Direct booking
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Book a trusted technician
              </h1>

              <p className="mt-4 text-sm leading-7 text-teal-50 sm:text-base">
                Tell us about your repair problem, share your location, and
                choose a convenient visit time.
              </p>

              <div className="my-7 h-px bg-white/20" />

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <FileText size={19} />
                  </div>
                  <div>
                    <h3 className="font-extrabold">Describe your problem</h3>
                    <p className="mt-1 text-sm leading-6 text-teal-50">
                      Explain the issue so the technician understands your
                      repair needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <h3 className="font-extrabold">Provide your location</h3>
                    <p className="mt-1 text-sm leading-6 text-teal-50">
                      Enter your city and area to help arrange the visit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <CalendarDays size={19} />
                  </div>
                  <div>
                    <h3 className="font-extrabold">Choose a visit time</h3>
                    <p className="mt-1 text-sm leading-6 text-teal-50">
                      Select a preferred date and time for your repair.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                <ShieldCheck size={23} className="shrink-0" />
                <p className="text-xs leading-5 text-teal-50 sm:text-sm">
                  Your booking request is sent to the technician for
                  acceptance.
                </p>
              </div>
            </div>
          </section>

          {/* Booking form */}
          <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/[0.04]">
            <div className="border-b border-slate-100 p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <ClipboardIcon />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    Booking details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete the form below to request a visit.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
              {/* Category */}
              <div>
                <FieldLabel icon={Wrench}>Service category</FieldLabel>

                <div className="relative">
                  <select
                    required
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className={`${inputStyles} appearance-none pr-10`}
                  >
                    {categories.map(({ name }) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <Settings
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-teal-600"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => updateField("category", name)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                        form.category === name
                          ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-600/15"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      }`}
                    >
                      <Icon size={14} />
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <FieldLabel icon={FileText}>Describe the problem</FieldLabel>

                <textarea
                  required
                  minLength={15}
                  rows={4}
                  maxLength={2000}
                  placeholder="For example: My ceiling fan is making noise and needs repair..."
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  className={`${inputStyles} min-h-32 resize-y`}
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    Please provide at least 15 characters.
                  </p>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">
                    {form.description.length}/2000
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Service location
                    </h3>
                    <p className="text-xs text-slate-500">
                      Where should the technician visit?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <FieldLabel>City</FieldLabel>
                    <input
                      required
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="e.g. Peshawar"
                      className={inputStyles}
                    />
                  </label>

                  <label className="block">
                    <FieldLabel>Area / Locality</FieldLabel>
                    <input
                      required
                      autoComplete="address-level3"
                      value={form.area}
                      onChange={(e) => updateField("area", e.target.value)}
                      placeholder="e.g. Hayatabad"
                      className={inputStyles}
                    />
                  </label>
                </div>
              </div>

              {/* Preferred date */}
              <div>
                <FieldLabel icon={CalendarDays}>
                  Preferred visit date and time
                </FieldLabel>

                <input
                  required
                  type="datetime-local"
                  min={minDate}
                  value={form.preferredAt}
                  onChange={(e) =>
                    updateField("preferredAt", e.target.value)
                  }
                  className={inputStyles}
                />

                <p className="mt-2 flex items-center gap-1.5 text-xs leading-5 text-slate-400">
                  <Clock3 size={14} className="shrink-0" />
                  Select a future date and time that works for you.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700"
                >
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="break-words">{error}</span>
                </div>
              )}

              {/* Submit */}
              <div className="border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {busy ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Sending booking request...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={19} />
                      Send booking request
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                  Your booking will be confirmed once the technician accepts
                  your request.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function ClipboardIcon() {
  return <FileText size={23} />;
}
