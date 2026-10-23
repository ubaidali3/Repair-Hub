
import React from "react";
import { Images, Image as ImageIcon } from "lucide-react";

export default function PhotoGrid({ urls = [] }) {
  const photos = Array.isArray(urls)
    ? urls.filter((url) => typeof url === "string" && url.trim())
    : [];

  if (!photos.length) return null;

  return (
    <div className="my-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Images size={17} className="text-teal-700" />
          Repair photos
        </div>

        <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </span>
      </div>

      <div
        className={`grid gap-2 overflow-hidden rounded-2xl ${
          photos.length === 1
            ? "grid-cols-1"
            : photos.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {photos.map((url, i) => (
          <a
            key={url + i}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open repair photo ${i + 1}`}
            className={`group relative block overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${
              photos.length === 1
                ? "aspect-[16/9]"
                : "aspect-square"
            }`}
          >
            <img
              src={url}
              alt={`Repair photo ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-slate-950/55 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="text-xs font-medium text-white">
                Photo {i + 1}
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-teal-700 shadow-sm">
                <ImageIcon size={16} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
