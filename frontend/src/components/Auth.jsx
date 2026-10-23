
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Wrench,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
} from "lucide-react";
import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";

const inputClass =
  "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100";

export default function Auth({ type, onAuth, flash }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [challenge, setChallenge] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = challenge
        ? await api.post("/auth/2fa/verify", {
            challengeToken: challenge,
            code,
          })
        : await api.post(
            type === "login" ? "/auth/login" : "/auth/register",
            form,
          );

      if (result.data.requiresTwoFactor) {
        setChallenge(result.data.challengeToken);
        setCode("");
        return;
      }

      onAuth(result.data.user);
      flash("Email verified. Welcome to UstaadBid!");
      navigate("/dashboard");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setBusy(true);
    setError("");

    try {
      await api.post("/auth/2fa/resend", {
        challengeToken: challenge,
      });

      flash("A new OTP was sent to your email");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  const isLogin = type === "login";

  return (
    <main className="relative isolate flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden bg-[#f7faf9] px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 size-80 rounded-full bg-teal-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 size-96 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white bg-white shadow-xl shadow-slate-900/[0.06] lg:grid-cols-2">
        {/* Intro Panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 p-10 text-white lg:flex xl:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border-[35px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 size-72 rounded-full bg-white/5 blur-2xl" />

          <Link to="/" className="relative flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Wrench size={25} />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              UstaadBid
            </span>
          </Link>

          <div className="relative py-12">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <ShieldCheck size={34} />
            </div>

            <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
              Home repairs,
              <br />
              made simpler.
            </h2>

            <p className="mt-5 max-w-sm text-base leading-8 text-teal-50">
              Connect with technicians, compare offers and manage your repair
              journey in one place.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Explore technician profiles",
                "Discuss pricing before work",
                "Manage your bookings",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={19} className="text-emerald-200" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-sm text-teal-100">
            Repair with confidence.
          </p>
        </aside>

        {/* Form Panel */}
        <section className="min-w-0 p-5 sm:p-8 md:p-10 xl:p-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900 lg:hidden"
          >
            <Wrench size={19} />
            UstaadBid
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              {challenge ? (
                <KeyRound size={24} />
              ) : isLogin ? (
                <LockKeyhole size={24} />
              ) : (
                <UserRound size={24} />
              )}
            </div>

            <p className="text-xs font-extrabold tracking-[0.2em] text-teal-700">
              {challenge
                ? "EMAIL VERIFICATION"
                : isLogin
                  ? "WELCOME BACK"
                  : "GET STARTED"}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {challenge
                ? "Verify your email"
                : isLogin
                  ? "Welcome back"
                  : "Create your account"}
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              {challenge
                ? "Enter the verification code sent to your email to continue."
                : isLogin
                  ? "Sign in to continue managing your repairs."
                  : "Join UstaadBid and get started with your account."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {challenge ? (
              <>
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="mt-0.5 shrink-0 text-teal-700" />
                    <p className="break-words text-sm leading-6 text-teal-900">
                      Enter the 6-digit code sent to{" "}
                      <strong>{form.email}</strong>. The code expires in 5
                      minutes. Six wrong attempts will block verification for
                      10 minutes.
                    </p>
                  </div>
                </div>

                <label className="block text-sm font-bold text-slate-700">
                  Email verification code
                  <input
                    className={`${inputClass} text-center text-xl font-extrabold tracking-[0.45em]`}
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    aria-label="6-digit verification code"
                  />
                </label>
              </>
            ) : (
              <>
                {type === "register" && (
                  <label className="block text-sm font-bold text-slate-700">
                    Full name
                    <span className="relative block">
                      <UserRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        className={`${inputClass} pl-11`}
                        required
                        minLength={2}
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                      />
                    </span>
                  </label>
                )}

                <label className="block text-sm font-bold text-slate-700">
                  Email address
                  <span className="relative block">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-11`}
                      required
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                    />
                  </span>
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Password
                  <span className="relative block">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-11`}
                      required
                      type="password"
                      minLength={type === "register" ? 12 : undefined}
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder={
                        isLogin
                          ? "Enter your password"
                          : "At least 12 characters"
                      }
                    />
                  </span>
                  {type === "register" && (
                    <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
                      Use at least 12 characters for your password.
                    </span>
                  )}
                </label>

                {type === "register" && (
                  <label className="block text-sm font-bold text-slate-700">
                    Account type
                    <select
                      className={inputClass}
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                    </select>
                  </label>
                )}
              </>
            )}

            {error && (
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-900/10 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {challenge
                    ? "Verify OTP & Continue"
                    : isLogin
                      ? "Send Login OTP"
                      : "Send Registration OTP"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {challenge ? (
            <div className="mt-5 space-y-3">
              <button
                type="button"
                disabled={busy}
                className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                onClick={resend}
              >
                Resend OTP
              </button>

              <button
                type="button"
                className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
                onClick={() => {
                  setChallenge("");
                  setCode("");
                  setError("");
                }}
              >
                Back to form
              </button>
            </div>
          ) : (
            <p className="mt-7 text-center text-sm leading-6 text-slate-500">
              {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
              <Link
                to={isLogin ? "/register" : "/login"}
                className="font-bold text-teal-700 hover:text-teal-900"
              >
                {isLogin ? "Create account" : "Sign in"}
              </Link>
            </p>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Secure account access
          </div>
        </section>
      </div>
    </main>
  );
}
