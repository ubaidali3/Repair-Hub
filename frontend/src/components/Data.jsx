
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  RefreshCw,
  Wifi,
  LoaderCircle,
} from "lucide-react";
import api from "../lib/api.js";
import { message } from "../lib/helpers.js";

export default function Data({ url, children, refresh = 0 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    api
      .get(url)
      .then((r) => {
        if (active) {
          setItems(r.data.items || []);
        }
      })
      .catch((e) => {
        if (active) {
          setError(message(e));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [url, refresh, retry]);

  // Loading state
  if (loading) {
    return (
      <div
        className="space-y-4"
        role="status"
        aria-label="Loading records"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm shadow-teal-900/5 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <LoaderCircle size={22} className="animate-spin" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-slate-800">
              Loading your records
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Please wait while we fetch the latest information.
            </p>
          </div>
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-teal-50" />

              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/5 rounded-full bg-slate-100" />
                <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                <div className="h-3 w-3/5 rounded-full bg-slate-100" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="h-9 w-24 rounded-xl bg-teal-50" />
              <div className="h-9 w-28 rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}

        <span className="sr-only">Loading records...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        role="alert"
        className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-lg shadow-rose-900/5"
      >
        <div className="h-1.5 bg-gradient-to-r from-rose-400 to-orange-400" />

        <div className="flex flex-col items-center px-5 py-8 text-center sm:px-8 sm:py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <AlertCircle size={30} />
          </div>

          <h3 className="mt-5 text-xl font-black text-slate-900">
            Unable to load records
          </h3>

          <p className="mt-2 max-w-md break-words text-sm leading-6 text-slate-500">
            {error}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Check your connection and try again.
          </p>

          <button
            type="button"
            onClick={() => setRetry((value) => value + 1)}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-700 active:translate-y-0"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Successful response
  return children(items);
}
