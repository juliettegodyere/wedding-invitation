import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const RsvpSchema = z.object({
  name: z.string().trim().min(2).max(120),
  attending: z.boolean(),
  additionalGuest: z.boolean(),
  childrenCount: z.number().int().min(0).max(12),
  phone: z.string().trim().max(64).optional(),
  note: z.string().trim().max(500).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid RSVP." },
        { status: 400 }
      );
    }

    const { name, attending, additionalGuest, childrenCount, phone, note } =
      parsed.data;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("rsvps").insert({
      name,
      attending,
      children_count: attending ? childrenCount : 0,
      adult_count: attending ? (additionalGuest ? 2 : 1) : 1,
      phone: phone || null,
      note: note || null,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to save RSVP." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: attending
        ? "Thank you! We’ve saved your RSVP — see you at the wedding."
        : "Thank you! We’ve saved your RSVP.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}

