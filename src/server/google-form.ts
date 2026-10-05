const formId = "1FAIpQLScJ7ZLNlhl7tMkQZ1X3L4myWc255r9NSn9aQUvqtXeIUEAxUA";
const formBase = `https://docs.google.com/forms/d/e/${formId}`;
const maxGooglePageBytes = 512_000;
const loadRetryDelays = [200, 800];
const retryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

const entries = {
  name: "entry.1664089668",
  email: "entry.2126035526",
  social: "entry.747648027",
  background: "entry.705353409",
  interests: "entry.970253744",
} as const;

export interface JoinSubmission {
  name: string;
  email: string;
  social: string;
  background: string;
  interests: string;
}

interface SubmitOptions {
  fetcher?: typeof fetch;
  wait?: (milliseconds: number) => Promise<void>;
}

export class SubmissionError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function value(data: FormData, key: keyof JoinSubmission, maxLength: number): string {
  const item = data.get(key);
  if (typeof item !== "string") throw new SubmissionError(`Missing ${key}`, 400);

  const normalized = item.trim();
  if (normalized.length > maxLength) throw new SubmissionError(`${key} is too long`, 422);
  return normalized;
}

export function parseSubmission(data: FormData): JoinSubmission {
  const submission = {
    name: value(data, "name", 200),
    email: value(data, "email", 320),
    social: value(data, "social", 500),
    background: value(data, "background", 4_000),
    interests: value(data, "interests", 4_000),
  };

  if (!submission.name || !submission.email || !submission.background || !submission.interests) {
    throw new SubmissionError("Complete every required field", 422);
  }
  if (!/^\S+@\S+\.\S+$/.test(submission.email)) throw new SubmissionError("Enter a valid email", 422);
  return submission;
}

function decodeHtml(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

export function extractHiddenFields(html: string): URLSearchParams {
  const fields = new URLSearchParams();
  const pattern = /<input\s+type="hidden"\s+name="([^"]+)"\s+value="([^"]*)">/g;

  for (const match of html.matchAll(pattern)) fields.set(match[1], decodeHtml(match[2]));
  for (const key of ["fvv", "partialResponse", "pageHistory", "fbzx", "submissionTimestamp"]) {
    if (!fields.has(key)) throw new SubmissionError(`Google form is missing ${key}`, 502);
  }
  return fields;
}

async function readBoundedText(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > maxGooglePageBytes) throw new SubmissionError("Google form response is too large", 502);
  if (!response.body) throw new SubmissionError("Google form returned no body", 502);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxGooglePageBytes) {
      await reader.cancel();
      throw new SubmissionError("Google form response is too large", 502);
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

async function loadGoogleForm(fetcher: typeof fetch, wait: SubmitOptions["wait"]): Promise<Response> {
  for (let attempt = 0; attempt <= loadRetryDelays.length; attempt += 1) {
    try {
      const response = await fetcher(`${formBase}/viewform`, { headers: { accept: "text/html" } });
      if (response.ok) return response;

      const canRetry = retryableStatuses.has(response.status) && attempt < loadRetryDelays.length;
      console.warn(JSON.stringify({ event: "google_form_load_failed", attempt: attempt + 1, status: response.status, retrying: canRetry }));
      if (!canRetry) throw new SubmissionError("Could not load Google form", 502);
      await response.body?.cancel();
    } catch (error) {
      if (error instanceof SubmissionError) throw error;
      if (attempt >= loadRetryDelays.length) {
        console.warn(JSON.stringify({ event: "google_form_load_failed", attempt: attempt + 1, status: null, retrying: false }));
        throw new SubmissionError("Could not load Google form", 502);
      }
      console.warn(JSON.stringify({ event: "google_form_load_failed", attempt: attempt + 1, status: null, retrying: true }));
    }

    await (wait ?? ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))))(loadRetryDelays[attempt]);
  }

  throw new SubmissionError("Could not load Google form", 502);
}

export async function submitToGoogleForm(submission: JoinSubmission, options: SubmitOptions = {}): Promise<void> {
  const fetcher = options.fetcher ?? fetch;
  const viewResponse = await loadGoogleForm(fetcher, options.wait);

  const fields = extractHiddenFields(await readBoundedText(viewResponse));
  for (const [key, entry] of Object.entries(entries)) fields.set(entry, submission[key as keyof JoinSubmission]);

  const response = await fetcher(`${formBase}/formResponse`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      referer: `${formBase}/viewform`,
    },
    body: fields,
    redirect: "follow",
  });
  if (!response.ok) throw new SubmissionError(`Google form returned ${response.status}`, 502);
}
