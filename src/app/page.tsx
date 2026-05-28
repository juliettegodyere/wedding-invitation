import Image from "next/image";
import RsvpCard from "./rsvp/RsvpCard";
import { getGoogleCalendarUrl } from "./utils/calendar";

export default function Home() {
  const googleCalUrl = getGoogleCalendarUrl({
    title: "Juliet & Ohakwe — Wedding",
    details: "Wedding celebration for Juliet Nkwor and Ohakwe Onyema.",
    location: "Aston Hall, Trinity Road, Birmingham, West Midlands, B6 6JD, England, United Kingdom",
    // 2026-07-01 11:00 (Europe/London) approximated as UTC+1 for link purposes
    startUtc: "20260701T100000Z",
    endUtc: "20260701T140000Z",
  });

  const invitationDownloadUrl =
    process.env.NEXT_PUBLIC_INVITATION_DOWNLOAD_URL?.trim() ||
    "/invitation-card.png";

  return (
    <div className="relative flex-1">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/invitation-card.png"
          alt="Wedding invitation card background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
            <p className="text-sm tracking-wide text-black/70">
              You are invited to the wedding of
            </p>
            <h1 className="mt-4 font-(--font-title) text-5xl leading-[1.1] text-brand sm:text-6xl">
              Juliet Nkwor
              <span className="mx-2 inline-block align-middle text-black/60">
                &
              </span>
              Ohakwe Onyema
            </h1>

            <div className="mt-5 rounded-2xl border border-black/10 bg-white/70 p-4">
              <div className="text-xs uppercase tracking-wider text-black/60">
                Colors of the day
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-brand-soft/70 p-3">
                  <span
                    className="h-10 w-10 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: "#C2185B" }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-sm font-semibold text-black/80">
                      Fuchsia / Raspberry Pink
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold tracking-wide text-black/70 ring-1 ring-black/10">
                        #C2185B
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-accent-soft/70 p-3">
                  <span
                    className="h-10 w-10 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: "#5A8F3D" }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-sm font-semibold text-black/80">
                      Leaf Green
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold tracking-wide text-black/70 ring-1 ring-black/10">
                        #5A8F3D
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-base text-black/80 sm:grid-cols-2">
              <div className="rounded-2xl bg-brand-soft/70 p-4">
                <div className="text-xs uppercase tracking-wider text-black/60">
                  Date
                </div>
                <div className="mt-1 text-lg font-semibold">
                  Wednesday, July 1, 2026
                </div>
              </div>
              <div className="rounded-2xl bg-brand-soft/70 p-4">
                <div className="text-xs uppercase tracking-wider text-black/60">
                  Time
                </div>
                <div className="mt-1 text-lg font-semibold">11:00 AM</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
              <div className="text-xs uppercase tracking-wider text-black/60">
                Venue
              </div>
              <div className="mt-1 font-semibold">
                Aston Hall, Trinity Road
              </div>
              <div className="text-black/70">
                Birmingham, West Midlands, B6 6JD, England, United Kingdom
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand/40"
                href={googleCalUrl}
                target="_blank"
                rel="noreferrer"
              >
                Add to Google Calendar
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black/80 shadow-sm transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                href="/api/calendar"
              >
                Download iCal (iPhone)
              </a>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <a
                className="text-sm font-semibold text-brand underline-offset-4 hover:underline"
                href={invitationDownloadUrl}
                download
                target={invitationDownloadUrl.startsWith("http") ? "_blank" : undefined}
                rel={invitationDownloadUrl.startsWith("http") ? "noreferrer" : undefined}
              >
                Download invitation card
              </a>
              <p className="text-sm text-black/60">
                RSVP before <span className="font-semibold">17th July</span>
              </p>
            </div>

            <div className="mt-6 border-t border-black/10 pt-5">
              <h2 className="text-lg font-semibold text-black/80">Our story</h2>
              <p className="mt-2 text-black/70">
                We can’t wait to celebrate with you. Please RSVP below so we can
                plan accordingly.
              </p>
            </div>
          </div>

          <RsvpCard />
        </section>
      </main>
    </div>
  );
}
