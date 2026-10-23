
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Sparkles,
  Wrench,
  Zap,
  Fan,
  Snowflake,
  Droplets,
  Refrigerator,
  WashingMachine,
  Settings,
  AlertCircle,
  LoaderCircle,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";
import Gate from "./Gate.jsx";
import ImageUploader from "./ImageUploader.jsx";

const categories = [
  { name: "Electrical", icon: Zap, description: "Wiring, switches and power" },
  { name: "Fan Repair", icon: Fan, description: "Fans and ventilation" },
  { name: "AC Service", icon: Snowflake, description: "Cooling and AC service" },
  { name: "Plumbing", icon: Droplets, description: "Pipes, taps and leaks" },
  {
    name: "Refrigerator",
    icon: Refrigerator,
    description: "Fridge and cooling issues",
  },
  {
    name: "Washing Machine",
    icon: WashingMachine,
    description: "Washer repair and service",
  },
  {
    name: "Appliance Repair",
    icon: Settings,
    description: "Other home appliances",
  },
];

export default function PostRequest({ user, flash }) {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electrical",
    city: "",
    area: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await api.post("/requests", { ...form, images });
      flash("Repair request published");
      navigate("/dashboard");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {user?.role !== "customer" ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-teal-100 bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <ClipboardList size={30} />
            </div>
            <h1 className="text-2xl font-bold text-slate-950">
              Post a repair request
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in with a customer account to publish a repair request.
            </p>
            <div className="mt-6">
              <Gate />
            </div>
          </div>
        ) : (
          <>
            {/* Back navigation */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-teal-700"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            {/* Hero section */}
            <div className="relative mb-8 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6 sm:p-10">
              <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />

              <div className="relative z-10 max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-700">
                  <Sparkles size={14} />
                  Find the right repair professional
                </div>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Tell us what needs
                  <span className="block text-teal-700">to be repaired.</span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Share the details of your repair problem, add photos and
                  provide your location so technicians can understand your
                  requirements.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-600 sm:text-sm">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Easy request form
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={16} className="text-teal-700" />
                    Booking-based service
                  </span>
                </div>
              </div>
            </div>

            {/* Form and side information */}
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <form
                onSubmit={submit}
                className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,118,110,0.05)] sm:p-8"
              >
                <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <FileText size={23} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      Repair details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Fields marked with * are required.
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Request title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    minLength={5}
                    maxLength={120}
                    value={form.title}
                    onChange={updateField}
                    placeholder="e.g. AC not cooling properly"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Give your repair request a clear, descriptive title.
                  </p>
                </div>

                {/* Description */}
                <div className="mb-7">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Describe the problem{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    minLength={15}
                    maxLength={3000}
                    rows={5}
                    value={form.description}
                    onChange={updateField}
                    placeholder="Explain what's wrong, when the problem started and any details that may help the technician..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />
                  <div className="mt-2 flex justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      Include useful details to help technicians.
                    </p>
                    <span className="shrink-0 text-xs text-slate-400">
                      {form.description.length}/3000
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-7">
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Choose a category{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {categories.map(({ name, icon: Icon, description }) => {
                      const active = form.category === name;

                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              category: name,
                            }))
                          }
                          aria-pressed={active}
                          className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition duration-200 ${
                            active
                              ? "border-teal-300 bg-teal-50 shadow-sm shadow-teal-700/5 ring-2 ring-teal-100"
                              : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              active
                                ? "bg-teal-700 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {name}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {description}
                            </p>
                          </div>

                          {active && (
                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-teal-700"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-7">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Service location
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Where should the repair take place?
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        required
                        maxLength={100}
                        value={form.city}
                        onChange={updateField}
                        placeholder="e.g. Peshawar"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="area"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Area / Neighborhood{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="area"
                        name="area"
                        required
                        maxLength={150}
                        value={form.area}
                        onChange={updateField}
                        placeholder="e.g. Hayatabad"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div className="mb-7 rounded-2xl border border-dashed border-teal-200 bg-teal-50/40 p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                      <Wrench size={19} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Add repair photos
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Photos can help explain the problem more clearly.
                      </p>
                    </div>
                  </div>

                  <ImageUploader
                    urls={images}
                    onChange={setImages}
                    max={5}
                  />

                  <p className="mt-3 text-xs text-slate-500">
                    You can add up to 5 photos if needed.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                  >
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0"
                    />
                    <p className="leading-6">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-400">
                    Please review your details before publishing.
                  </p>

                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/15 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin" />
                        Publishing request...
                      </>
                    ) : (
                      <>
                        Publish repair request
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Helpful sidebar */}
              <aside className="space-y-5">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <BadgeCheck size={24} />
                  </div>

                  <h3 className="text-base font-bold text-slate-950">
                    Get better responses
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    A detailed request helps technicians understand what you
                    need before responding.
                  </p>

                  <div className="mt-5 space-y-4">
                    {[
                      {
                        title: "Be specific",
                        detail: "Describe the issue and any unusual symptoms.",
                      },
                      {
                        title: "Choose the right category",
                        detail: "Select the service that best fits the problem.",
                      },
                      {
                        title: "Add clear photos",
                        detail: "Show the affected appliance or repair area.",
                      },
                      {
                        title: "Enter your location",
                        detail: "Provide your city and neighborhood accurately.",
                      },
                    ].map((item, index) => (
                      <div key={item.title} className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 to-emerald-700 p-5 text-white shadow-lg shadow-teal-900/10 sm:p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <ShieldCheck size={23} />
                  </div>

                  <h3 className="text-base font-bold">
                    Ready to get started?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-teal-50/90">
                    Complete the form with accurate details to publish your
                    repair request.
                  </p>

                  <div className="mt-5 flex items-center gap-2 border-t border-white/15 pt-4 text-xs font-medium text-teal-50">
                    <CheckCircle2 size={16} />
                    Review before publishing
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
