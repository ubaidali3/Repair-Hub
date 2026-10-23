
import React, { useRef, useState } from "react";
import {
  ImagePlus,
  Upload,
  X,
  Trash2,
  Images,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { api } from "../lib/api.js";
import { message } from "../lib/helpers.js";
import PhotoGrid from "./PhotoGrid.jsx";

export default function ImageUploader({
  urls = [],
  onChange,
  max = 5,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const remaining = Math.max(0, max - urls.length);
  const isFull = remaining === 0;

  async function uploadFiles(fileList) {
    const selectedFiles = Array.from(fileList || []);
    if (!selectedFiles.length || busy || isFull) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const validFiles = selectedFiles
      .filter((file) => allowedTypes.includes(file.type))
      .filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== selectedFiles.length) {
      setError(
        "Only JPG, PNG, or WebP images up to 5MB each are allowed.",
      );
    }

    const files = validFiles.slice(0, remaining);

    if (!files.length) return;

    setBusy(true);

    try {
      const form = new FormData();

      files.forEach((file) => form.append("images", file));

      const response = await api.post("/media/upload", form);
      const uploadedUrls = response.data.urls || [];

      onChange([...urls, ...uploadedUrls].slice(0, max));
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleInputChange(e) {
    uploadFiles(e.target.files);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);

    if (!busy && !isFull) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function removeImage(index) {
    onChange(urls.filter((_, i) => i !== index));
    setError("");
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-900/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <Images size={23} />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              Repair photos
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Add photos to help explain the repair.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700 ring-1 ring-teal-100">
          <ImagePlus size={14} />
          {urls.length} / {max} photos
        </span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* Upload area */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy && !isFull) setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={handleDrop}
          className={`group flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition duration-200 sm:min-h-56 ${
            isFull
              ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
              : dragging
                ? "cursor-copy border-teal-500 bg-teal-50 ring-4 ring-teal-500/10"
                : "cursor-pointer border-teal-200 bg-[#f8fbfa] hover:border-teal-400 hover:bg-teal-50/70"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={busy || isFull}
            onChange={handleInputChange}
            className="sr-only"
          />

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition duration-200 ${
              dragging
                ? "scale-110 bg-teal-600 text-white"
                : "bg-white text-teal-600 shadow-md shadow-teal-900/5 ring-1 ring-teal-100 group-hover:-translate-y-1 group-hover:bg-teal-600 group-hover:text-white"
            }`}
          >
            {busy ? (
              <LoaderCircle size={30} className="animate-spin" />
            ) : (
              <Upload size={29} />
            )}
          </div>

          <h4 className="mt-5 text-base font-extrabold text-slate-800">
            {busy
              ? "Uploading your photos..."
              : isFull
                ? "Photo limit reached"
                : dragging
                  ? "Drop your photos here"
                  : "Choose photos to upload"}
          </h4>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {isFull
              ? `You can upload up to ${max} photos. Remove a photo to add another.`
              : "Click to browse or drag and drop your images here."}
          </p>

          {!isFull && !busy && (
            <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-md shadow-teal-600/15 transition group-hover:bg-teal-700">
              <ImagePlus size={16} />
              Browse images
            </span>
          )}

          <p className="mt-4 text-xs font-medium text-slate-400">
            JPG, PNG or WebP · Maximum 5MB per image
          </p>
        </label>

        {/* Upload progress indicator */}
        {busy && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50/70 p-4"
          >
            <LoaderCircle
              size={20}
              className="shrink-0 animate-spin text-teal-600"
            />
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-teal-800">
                Upload in progress
              </p>
              <p className="mt-1 text-xs text-teal-700">
                Please wait while your images are being uploaded.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <span className="min-w-0 flex-1 break-words">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 rounded-lg p-1 transition hover:bg-rose-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Uploaded photos */}
        {urls.length > 0 && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-slate-900">
                  Uploaded photos
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Review your images and remove any you don't need.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={15} />
                {urls.length} added
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4">
              <PhotoGrid urls={urls} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {urls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 transition hover:border-teal-100 hover:bg-teal-50/30"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-emerald-600"
                    />
                    <span className="truncate text-sm font-bold text-slate-700">
                      Photo {index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove photo ${index + 1}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {urls.length === 0 && !busy && (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Sparkles size={19} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                No photos added yet
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Photos are optional, but they can help explain your repair.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-start gap-2 border-t border-slate-100 pt-4">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-teal-600"
          />
          <p className="text-xs leading-5 text-slate-500">
            Only upload images you have permission to share. Each image must
            be a JPG, PNG, or WebP file no larger than 5MB.
          </p>
        </div>
      </div>
    </section>
  );
}