import { NextResponse } from "next/server";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toIcsUtcStamp(d: Date) {
  return (
    d.getUTCFullYear() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcsText(s: string) {
  return s.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
}

export async function GET() {
  // Wedding: 2026-07-01 11:00 Europe/London. For a simple downloadable file,
  // we encode as UTC and include a human-friendly location/description.
  const start = new Date(Date.UTC(2026, 6, 1, 10, 0, 0)); // 10:00Z (11:00 BST)
  const end = new Date(Date.UTC(2026, 6, 1, 14, 0, 0)); // 14:00Z

  const now = new Date();
  const uid = `juliet-ohakwe-wedding-${toIcsUtcStamp(start)}@invite`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Juliet & Ohakwe//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtcStamp(now)}`,
    `DTSTART:${toIcsUtcStamp(start)}`,
    `DTEND:${toIcsUtcStamp(end)}`,
    `SUMMARY:${escapeIcsText("Juliet & Ohakwe — Wedding")}`,
    `DESCRIPTION:${escapeIcsText("Wedding celebration for Juliet Nkwor and Ohakwe Onyema.")}`,
    `LOCATION:${escapeIcsText(
      "Aston Hall, Trinity Road, Birmingham, West Midlands, B6 6JD, England, United Kingdom"
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="juliet-ohakwe-wedding.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}

