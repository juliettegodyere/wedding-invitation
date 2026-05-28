## Wedding Invitation Site

Simple wedding invitation site with RSVP tracking (Supabase) and calendar buttons.

### Features

- Landing page styled from your invitation card
- RSVP: Yes/No
- RSVP rules: **1 adult only**, and **number of children** if attending with kids
- “Add to Calendar”
  - Google Calendar link
  - iCal download (iPhone)
- Download invitation card link (local file by default, or configurable URL)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables

Create a `.env.local` in the project root:

```bash
SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"

# Optional: override the download link shown on the site.
# If not set, the site uses /invitation-card.png.
NEXT_PUBLIC_INVITATION_DOWNLOAD_URL=""
```

### Supabase table

Create a table called `rsvps`:

```sql
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  attending boolean not null,
  adult_count int not null default 1,
  children_count int not null default 0,
  phone text null,
  note text null
);
```

> Note: this app writes RSVPs from a server route using the **service role key**.
> Keep it in server-only env vars (Vercel project settings), never expose it to the client.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
