
import React, { useState } from "react";
import {
  api,
} from "../lib/api.js";
import { message } from "../lib/helpers.js";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import Gate from "./Gate.jsx";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  ShieldCheck,
  MessagesSquare,
  Clock3,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function Messages({ user, flash }) {
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [refresh, setRefresh] = useState(0);

  async function send(e) {
    e.preventDefault();

    if (!selected || !text.trim()) return;

    try {
      await api.post(`/conversations/${selected}/messages`, {
        text: text.trim(),
      });

      setText("");
      setRefresh((x) => x + 1);
    } catch (e) {
      flash(message(e));
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbfa] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {!user ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <MessageCircle size={30} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Private Messages
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to access your private conversations with customers and
              technicians.
            </p>
            <div className="mt-6">
              <Gate />
            </div>
          </div>
        ) : (
          <>
            {/* Page heading */}
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                  <Sparkles size={14} />
                  Repair marketplace
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Your Messages
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Stay connected with customers and technicians throughout
                  your repair journey.
                </p>
              </div>

              <div className="flex w-fit items-center gap-3 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Private conversations
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Booking-related messages
                  </p>
                </div>
              </div>
            </div>

            {/* Chat layout */}
            <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_45px_rgba(15,118,110,0.06)] lg:grid-cols-[340px_minmax(0,1fr)]">
              {/* Conversations sidebar */}
              <aside
                className={`border-b border-slate-200 bg-white lg:border-b-0 lg:border-r ${
                  selected ? "hidden lg:block" : "block"
                }`}
              >
                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">
                        Conversations
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Your booking discussions
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <MessagesSquare size={21} />
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <Data url="/conversations">
                    {(items) =>
                      items.length ? (
                        <div className="space-y-2">
                          {items.map((c) => {
                            const active = selected === c._id;

                            return (
                              <button
                                key={c._id}
                                type="button"
                                onClick={() => setSelected(c._id)}
                                className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                                  active
                                    ? "border-teal-200 bg-teal-50 shadow-sm"
                                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <div
                                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                    active
                                      ? "bg-teal-700 text-white"
                                      : "bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700"
                                  }`}
                                >
                                  <MessageCircle size={21} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-slate-900">
                                    {c.booking?.category || "Booking"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Conversation #
                                    {String(c._id).slice(-6)}
                                  </p>
                                  <span
                                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                                      active
                                        ? "bg-white text-teal-700"
                                        : "bg-emerald-50 text-emerald-700"
                                    }`}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Booking conversation
                                  </span>
                                </div>

                                <ArrowLeft
                                  size={16}
                                  className={`rotate-180 shrink-0 transition ${
                                    active
                                      ? "text-teal-700"
                                      : "text-slate-300 group-hover:text-teal-600"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-2 py-8">
                          <Empty text="No conversations yet. Open a confirmed booking to start one." />
                        </div>
                      )
                    }
                  </Data>
                </div>

                <div className="mx-4 mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Keep it professional
                      </p>
                      <p className="mt-1 text-xs leading-5 text-emerald-800/80">
                        Discuss repair details and coordinate your booking
                        directly in your conversation.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Chat area */}
              <section
                className={`min-w-0 flex-col bg-[#fbfdfc] ${
                  selected ? "flex" : "hidden lg:flex"
                }`}
              >
                {selected ? (
                  <>
                    {/* Chat header */}
                    <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:hidden"
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft size={19} />
                      </button>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-700/20">
                        <UserRound size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-bold text-slate-950 sm:text-base">
                          {(() => {
                            const id = String(selected);
                            return `Conversation #${id.slice(-6)}`;
                          })()}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <ShieldCheck
                            size={13}
                            className="text-emerald-600"
                          />
                          Private booking conversation
                        </p>
                      </div>

                      <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active chat
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                      <div className="mx-auto mb-6 flex max-w-md items-center justify-center gap-2 rounded-xl border border-teal-100 bg-white px-4 py-3 text-center text-xs leading-5 text-slate-500 shadow-sm">
                        <ShieldCheck
                          size={16}
                          className="shrink-0 text-teal-700"
                        />
                        Messages in this conversation are associated with
                        your booking.
                      </div>

                      <Data
                        url={`/conversations/${selected}/messages`}
                        refresh={refresh}
                      >
                        {(items) =>
                          items.length ? (
                            <div className="space-y-4">
                              {items.map((m) => {
                                const mine =
                                  String(m.sender) === String(user.id);

                                return (
                                  <div
                                    key={m._id}
                                    className={`flex ${
                                      mine ? "justify-end" : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`max-w-[88%] sm:max-w-[75%] ${
                                        mine ? "items-end" : "items-start"
                                      } flex flex-col`}
                                    >
                                      <div
                                        className={`mb-1.5 flex items-center gap-2 px-1 text-[11px] font-medium text-slate-500 ${
                                          mine ? "flex-row-reverse" : ""
                                        }`}
                                      >
                                        <span>
                                          {mine ? "You" : "Other participant"}
                                        </span>
                                        <span className="text-slate-300">
                                          •
                                        </span>
                                        <span>
                                          {new Date(
                                            m.createdAt
                                          ).toLocaleString()}
                                        </span>
                                      </div>

                                      <div
                                        className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                          mine
                                            ? "rounded-tr-md bg-teal-700 text-white"
                                            : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
                                        }`}
                                      >
                                        <p className="whitespace-pre-wrap break-words">
                                          {m.text}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                                <MessageCircle size={29} />
                              </div>
                              <h3 className="text-base font-bold text-slate-900">
                                Start the conversation
                              </h3>
                              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                                Send your first message to discuss the repair
                                and coordinate the booking.
                              </p>
                            </div>
                          )
                        }
                      </Data>
                    </div>

                    {/* Message composer */}
                    <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
                      <form onSubmit={send}>
                        <label
                          htmlFor="message"
                          className="mb-2 block text-xs font-semibold text-slate-600"
                        >
                          Your message
                        </label>

                        <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-teal-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
                          <textarea
                            id="message"
                            required
                            maxLength={2000}
                            rows={2}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                !e.shiftKey &&
                                !e.nativeEvent.isComposing
                              ) {
                                e.preventDefault();
                                e.currentTarget.form?.requestSubmit();
                              }
                            }}
                            placeholder="Write your message here..."
                            className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-3 py-2.5 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
                          />

                          <button
                            type="submit"
                            disabled={!text.trim()}
                            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm shadow-teal-700/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <span className="hidden sm:inline">Send</span>
                            <Send size={17} />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3 px-1">
                          <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Clock3 size={12} />
                            Press Enter to send · Shift + Enter for a new line
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {text.length}/2000
                          </span>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-3xl bg-teal-200/40 blur-2xl" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-teal-100 bg-gradient-to-br from-emerald-50 to-cyan-50 text-teal-700 shadow-sm">
                        <MessagesSquare size={40} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                      <Sparkles size={13} />
                      Stay connected
                    </div>

                    <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                      Your conversations, all in one place
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                      Select a conversation from the left to read messages
                      and discuss repair details with the other participant.
                    </p>

                    <div className="mt-7 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500 shadow-sm">
                      <ArrowLeft
                        size={15}
                        className="hidden lg:block"
                      />
                      <span className="lg:hidden">
                        Choose a conversation above to get started
                      </span>
                      <span className="hidden lg:inline">
                        Choose a conversation to get started
                      </span>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              Your conversations are linked to bookings. Be sure to keep repair
              arrangements clear and professional.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
