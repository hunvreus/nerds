import { parseSubmission, SubmissionError, submitToGoogleForm } from "./google-form";

export async function handleJoin(request: Request): Promise<Response> {
  try {
    const submission = parseSubmission(await request.formData());
    await submitToGoogleForm(submission);
    return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const known = error instanceof SubmissionError;
    console.error(JSON.stringify({ event: "join_submission_failed", message: known ? error.message : "Unexpected error" }));
    return Response.json(
      { ok: false, error: known ? error.message : "Could not submit the form" },
      { status: known ? error.status : 500, headers: { "cache-control": "no-store" } },
    );
  }
}
