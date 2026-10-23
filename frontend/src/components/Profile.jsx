
import React, { useEffect, useState } from "react";
import {
  UserRound,
  MapPin,
  BriefcaseBusiness,
  Camera,
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  Save,
  Sparkles,
  AlertCircle,
  LoaderCircle,
  KeyRound,
  Copy,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";
import Gate from "./Gate.jsx";
import ImageUploader from "./ImageUploader.jsx";

export default function Profile({ user, setUser, flash }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    city: user?.city || "",
    area: user?.area || "",
    skills: (user?.skills || []).join(", "),
    avatarUrl: user?.avatarUrl || "",
    portfolioImages: user?.portfolioImages || [],
  });

  const [password, setPassword] = useState("");
  const [qr, setQr] = useState("");
  const [manual, setManual] = useState("");
  const [otp, setOtp] = useState("");
  const [recovery, setRecovery] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [securityBusy, setSecurityBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        city: user.city || "",
        area: user.area || "",
        skills: (user.skills || []).join(", "),
        avatarUrl: user.avatarUrl || "",
        portfolioImages: user.portfolioImages || [],
      });
    }
  }, [user]);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const d = {
        ...form,
        skills: form.skills
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      if (user.role !== "technician") {
        delete d.skills;
        delete d.portfolioImages;
      }

      const r = await api.patch("/profile", d);
      setUser({ ...user, ...r.data.user });
      flash("Profile saved");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  async function setup() {
    setError("");
    setSecurityBusy(true);

    try {
      const r = await api.post("/auth/2fa/setup", { password });
      setQr(r.data.qrCode);
      setManual(r.data.manualKey);
      setOtp("");
    } catch (e) {
      setError(message(e));
    } finally {
      setSecurityBusy(false);
    }
  }

  async function enable() {
    setError("");
    setSecurityBusy(true);

    try {
      const r = await api.post("/auth/2fa/enable", { code: otp });
      setRecovery(r.data.recoveryCodes || []);
      setQr("");
      setManual("");
      setPassword("");
      setOtp("");
      setUser({ ...user, twoFactorEnabled: true });
      flash("Two-factor authentication enabled");
    } catch (e) {
      setError(message(e));
    } finally {
      setSecurityBusy(false);
    }
  }

  async function disable() {
    setError("");
    setSecurityBusy(true);

    try {
      await api.post("/auth/2fa/disable", {
        password,
        code: otp,
      });

      setUser({ ...user, twoFactorEnabled: false });
      setOtp("");
      setPassword("");
      setQr("");
      setManual("");
      setRecovery([]);
      flash("2FA disabled");
    } catch (e) {
      setError(message(e));
    } finally {
      setSecurityBusy(false);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f8fbfa] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <UserRound size={30} />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">
            Profile & Security
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to manage your profile and security settings.
          </p>
          <div className="mt-6">
            <Gate />
          </div>
        </div>
      </main>
    );
  }

  const initials =
    form.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/50 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-700">
                <Sparkles size={14} />
                Account settings
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Profile & Security
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Manage your personal information, update your profile photo
                and keep your account secure.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck size={25} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Account security
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Manage your settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile overview */}
        <div className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-100 text-2xl font-bold text-teal-800">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}

              <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-teal-700 text-white">
                <Camera size={13} />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-slate-950">
                {form.name || "Your profile"}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {user.email || "Account email"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
                  <UserRound size={13} />
                  {user.role || "Member"}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    user.twoFactorEnabled
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {user.twoFactorEnabled ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <ShieldAlert size={13} />
                  )}
                  {user.twoFactorEnabled ? "2FA enabled" : "2FA not enabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p className="leading-6">{error}</p>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main profile form */}
          <form
            onSubmit={save}
            className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <UserRound size={23} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Personal information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your profile details up to date.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full name <span className="text-rose-500">*</span>
              </label>
              <input
                id="profile-name"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
              />
            </div>

            {/* Location */}
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-teal-700" />
                <h3 className="text-sm font-bold text-slate-800">
                  Location details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-city"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    City
                  </label>
                  <input
                    id="profile-city"
                    maxLength={100}
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    placeholder="Your city"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-area"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Area / Neighborhood
                  </label>
                  <input
                    id="profile-area"
                    maxLength={150}
                    value={form.area}
                    onChange={(e) =>
                      setForm({ ...form, area: e.target.value })
                    }
                    placeholder="Your area"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="mb-7 rounded-2xl border border-dashed border-teal-200 bg-teal-50/40 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <Camera size={19} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Profile photo
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add a photo to personalize your account.
                  </p>
                </div>
              </div>

              <ImageUploader
                urls={form.avatarUrl ? [form.avatarUrl] : []}
                max={1}
                onChange={(urls) =>
                  setForm({ ...form, avatarUrl: urls[0] || "" })
                }
              />
            </div>

            {/* Technician fields */}
            {user.role === "technician" && (
              <div className="space-y-7 border-t border-slate-100 pt-7">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <BriefcaseBusiness size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Professional skills
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Separate each skill with a comma.
                      </p>
                    </div>
                  </div>

                  <label
                    htmlFor="profile-skills"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Skills
                  </label>
                  <input
                    id="profile-skills"
                    value={form.skills}
                    onChange={(e) =>
                      setForm({ ...form, skills: e.target.value })
                    }
                    placeholder="Electrical, AC service, Plumbing"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />

                  {form.skills.trim() && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                        .map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <BriefcaseBusiness size={19} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Work portfolio
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Showcase photos of your previous work.
                      </p>
                    </div>
                  </div>

                  <ImageUploader
                    urls={form.portfolioImages}
                    max={12}
                    onChange={(urls) =>
                      setForm({ ...form, portfolioImages: urls })
                    }
                  />
                  <p className="mt-3 text-xs text-slate-400">
                    Add up to 12 portfolio images.
                  </p>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-400">
                Changes are saved to your account.
              </p>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/15 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save profile
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security panel */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <LockKeyhole size={24} />
              </div>

              <h2 className="text-lg font-bold text-slate-950">
                Two-factor security
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {user.twoFactorEnabled
                  ? "Two-factor authentication is enabled on your account."
                  : "Add an extra verification step to help protect your account."}
              </p>

              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-sm font-semibold ${
                  user.twoFactorEnabled
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {user.twoFactorEnabled ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <ShieldAlert size={18} />
                )}
                {user.twoFactorEnabled ? "Protection enabled" : "Setup required"}
              </div>

              <p className="mt-4 text-xs leading-6 text-slate-500">
                Your authentication setup may require your password and a
                verification code, depending on the action.
              </p>

              {!user.twoFactorEnabled && !qr && (
                <div className="mt-5 space-y-3">
                  <label
                    htmlFor="setup-password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Confirm your password
                  </label>
                  <input
                    id="setup-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />

                  <button
                    type="button"
                    onClick={setup}
                    disabled={securityBusy || !password}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {securityBusy ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <KeyRound size={17} />
                    )}
                    Set up two-factor authentication
                  </button>
                </div>
              )}

              {qr && (
                <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-bold text-slate-900">
                    Complete authenticator setup
                  </h3>

                  <p className="text-xs leading-5 text-slate-500">
                    Scan this QR code with your authenticator app, then enter
                    the current verification code below.
                  </p>

                  {qr.startsWith("data:image/") && (
                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
                      <img
                        src={qr}
                        alt="Authenticator setup QR code"
                        className="h-48 w-48 object-contain"
                      />
                    </div>
                  )}

                  {manual && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-2 text-xs font-semibold text-slate-600">
                        Manual setup key
                      </p>
                      <code className="break-all text-xs text-slate-800">
                        {manual}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard?.writeText) {
                            navigator.clipboard.writeText(manual).catch(() => {
                              setError("Unable to copy the setup key.");
                            });
                          } else {
                            setError(
                              "Clipboard is unavailable. Please copy the key manually."
                            );
                          }
                        }}
                        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-700 hover:text-teal-800"
                      >
                        <Copy size={14} />
                        Copy setup key
                      </button>
                    </div>
                  )}

                  <label
                    htmlFor="enable-otp"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Verification code
                  </label>
                  <input
                    id="enable-otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit code"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg tracking-[0.3em] outline-none transition placeholder:text-sm placeholder:tracking-normal focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />

                  <button
                    type="button"
                    onClick={enable}
                    disabled={securityBusy || otp.length !== 6}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {securityBusy ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={17} />
                    )}
                    Verify and enable
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQr("");
                      setManual("");
                      setOtp("");
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel setup
                  </button>
                </div>
              )}

              {user.twoFactorEnabled && (
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <label
                    htmlFor="disable-password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Confirm your password
                  </label>
                  <input
                    id="disable-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />

                  <label
                    htmlFor="disable-otp"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Authentication code
                  </label>
                  <input
                    id="disable-otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit code"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg tracking-[0.3em] outline-none transition placeholder:text-sm placeholder:tracking-normal focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  />

                  <button
                    type="button"
                    onClick={disable}
                    disabled={securityBusy || !password || otp.length !== 6}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {securityBusy ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <LockKeyhole size={17} />
                    )}
                    Disable two-factor authentication
                  </button>
                </div>
              )}
            </div>

            {/* Recovery codes */}
            {recovery.length > 0 && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-700">
                  <KeyRound size={22} />
                </div>

                <h3 className="text-base font-bold text-amber-950">
                  Save your recovery codes
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-900/80">
                  Store these codes somewhere secure. Treat them like
                  passwords and do not share them.
                </p>

                <div className="mt-4 rounded-xl border border-amber-200 bg-white p-3">
                  <div className="space-y-2">
                    {recovery.map((code, index) => (
                      <code
                        key={`${code}-${index}`}
                        className="block break-all text-sm text-slate-800"
                      >
                        {code}
                      </code>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard?.writeText) {
                      navigator.clipboard
                        .writeText(recovery.join("\n"))
                        .catch(() =>
                          setError("Unable to copy recovery codes.")
                        );
                    } else {
                      setError(
                        "Clipboard is unavailable. Please save the codes manually."
                      );
                    }
                  }}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
                >
                  <Copy size={16} />
                  Copy recovery codes
                </button>
              </div>
            )}

            {/* Security note */}
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700">
                <ShieldCheck size={21} />
              </div>

              <h3 className="text-sm font-bold text-emerald-950">
                Keep your account secure
              </h3>

              <p className="mt-2 text-xs leading-6 text-emerald-900/80">
                Never share your password, authenticator codes or recovery
                codes with anyone.
              </p>
            </div>
          </aside>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldCheck size={14} />
          Your profile and security settings
        </p>
      </div>
    </main>
  );
}
