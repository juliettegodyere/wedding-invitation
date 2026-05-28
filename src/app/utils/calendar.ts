type GoogleCalendarArgs = {
  title: string;
  details?: string;
  location?: string;
  /**
   * UTC time in format YYYYMMDDTHHMMSSZ (e.g. 20260701T100000Z)
   */
  startUtc: string;
  /**
   * UTC time in format YYYYMMDDTHHMMSSZ (e.g. 20260701T140000Z)
   */
  endUtc: string;
};

export function getGoogleCalendarUrl({
  title,
  details,
  location,
  startUtc,
  endUtc,
}: GoogleCalendarArgs) {
  const base = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  params.set("text", title);
  params.set("dates", `${startUtc}/${endUtc}`);
  if (details) params.set("details", details);
  if (location) params.set("location", location);
  return `${base}?${params.toString()}`;
}

