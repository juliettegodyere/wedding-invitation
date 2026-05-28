"use client";

import { useMemo, useState } from "react";
import { z } from "zod";

const RsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  attending: z.boolean(),
  additionalGuest: z.boolean(),
  childrenCount: z.number().int().min(0).max(12),
  phone: z
    .string()
    .trim()
    .max(64)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});

type RsvpPayload = z.infer<typeof RsvpSchema>;

export default function RsvpCard() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [additionalGuest, setAdditionalGuest] = useState<boolean>(false);
  const [childrenCountText, setChildrenCountText] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "success"; message: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const isReady = useMemo(() => attending !== null, [attending]);

  function getChildrenCountNumber() {
    if (!attending) return 0;
    if (childrenCountText.trim() === "") return 0;
    const n = Number(childrenCountText);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(12, Math.trunc(n)));
  }

  function bumpChildren(delta: -1 | 1) {
    if (attending !== true) return;
    const next = Math.max(0, Math.min(12, getChildrenCountNumber() + delta));
    setChildrenCountText(String(next));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (attending === null) return;

    setStatus({ kind: "submitting" });

    const payload: RsvpPayload = {
      name,
      attending,
      additionalGuest: attending ? additionalGuest : false,
      childrenCount: getChildrenCountNumber(),
      phone,
    };

    const parsed = RsvpSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus({ kind: "error", message: parsed.error.issues[0]?.message ?? "Invalid RSVP." });
      return;
    }

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok: true; message: string }
        | { ok: false; error: string }
        | null;

      if (!res.ok || !json || json.ok !== true) {
        setStatus({
          kind: "error",
          message: json && "error" in json ? json.error : "Something went wrong saving your RSVP.",
        });
        return;
      }

      setStatus({ kind: "success", message: json.message });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
      <h2 className="font-(--font-title) text-4xl leading-none text-brand">
        RSVP
      </h2>
      <p className="mt-2 text-black/70">
        Please select <span className="font-semibold">Yes</span> or{" "}
        <span className="font-semibold">No</span>. (Your invitation includes{" "}
        <span className="font-semibold">1 adult</span>, with the option to bring{" "}
        <span className="font-semibold">1 additional adult</span>. Add number of
        children if attending with kids.)
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className={[
            "rounded-2xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2",
            attending === true
              ? "border-brand bg-brand text-white focus:ring-brand/40"
              : "border-black/15 bg-white text-black/80 hover:bg-white/80 focus:ring-brand/30",
          ].join(" ")}
          onClick={() => setAttending(true)}
        >
          Yes, I’m coming
        </button>
        <button
          type="button"
          className={[
            "rounded-2xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2",
            attending === false
              ? "border-brand bg-brand text-white focus:ring-brand/40"
              : "border-black/15 bg-white text-black/80 hover:bg-white/80 focus:ring-brand/30",
          ].join(" ")}
          onClick={() => {
            setAttending(false);
            setAdditionalGuest(false);
            setChildrenCountText("");
          }}
        >
          No, I can’t make it
        </button>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-black/70">Full name</span>
          <input
            className="h-11 rounded-2xl border border-black/15 bg-white px-4 text-black/90 outline-none ring-0 focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane Doe"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-sm font-semibold text-black/70">
              Additional guest
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={attending !== true}
                className={[
                  "h-11 rounded-2xl border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:opacity-60",
                  additionalGuest === false
                    ? "border-brand bg-brand text-white focus:ring-brand/40"
                    : "border-black/15 bg-white text-black/80 hover:bg-white/80 focus:ring-brand/30",
                ].join(" ")}
                onClick={() => setAdditionalGuest(false)}
              >
                No
              </button>
              <button
                type="button"
                disabled={attending !== true}
                className={[
                  "h-11 rounded-2xl border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:opacity-60",
                  additionalGuest === true
                    ? "border-brand bg-brand text-white focus:ring-brand/40"
                    : "border-black/15 bg-white text-black/80 hover:bg-white/80 focus:ring-brand/30",
                ].join(" ")}
                onClick={() => setAdditionalGuest(true)}
              >
                Yes
              </button>
            </div>
            <p className="text-xs font-semibold text-black/50">
              Your invite includes 1 adult, with 1 additional guest (optional).
            </p>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-semibold text-black/70">
              Children (number)
            </span>
            <div className="flex items-stretch gap-2">
              <button
                type="button"
                disabled={attending !== true}
                className="w-12 rounded-2xl border border-black/15 bg-white text-xl font-semibold text-black/70 shadow-sm transition hover:bg-white/80 disabled:opacity-60"
                onClick={() => bumpChildren(-1)}
                aria-label="Decrease children"
              >
                −
              </button>
              <input
                className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-black/90 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 disabled:bg-black/3 disabled:text-black/50"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={attending === true ? "0" : "—"}
                value={attending === true ? childrenCountText : ""}
                onChange={(e) => {
                  const next = e.target.value.replace(/[^\d]/g, "");
                  setChildrenCountText(next);
                }}
                disabled={attending !== true}
              />
              <button
                type="button"
                disabled={attending !== true}
                className="w-12 rounded-2xl border border-black/15 bg-white text-xl font-semibold text-black/70 shadow-sm transition hover:bg-white/80 disabled:opacity-60"
                onClick={() => bumpChildren(1)}
                aria-label="Increase children"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-black/70">
            Phone (optional)
          </span>
          <input
            className="h-11 rounded-2xl border border-black/15 bg-white px-4 text-black/90 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +44 7789 594045"
          />
        </label>

        <button
          type="submit"
          disabled={!isReady || status.kind === "submitting"}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          {status.kind === "submitting" ? "Saving RSVP…" : "Submit RSVP"}
        </button>

        {status.kind === "success" ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {status.message}
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {status.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

