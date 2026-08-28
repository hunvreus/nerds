import assert from "node:assert/strict";
import test from "node:test";
import { extractHiddenFields, parseSubmission, SubmissionError } from "../src/server/google-form.ts";

test("extracts Google Forms submission metadata", () => {
  const html = [
    '<input type="hidden" name="fvv" value="1">',
    '<input type="hidden" name="partialResponse" value="[null,null,&quot;123&quot;]">',
    '<input type="hidden" name="pageHistory" value="0">',
    '<input type="hidden" name="fbzx" value="123">',
    '<input type="hidden" name="submissionTimestamp" value="-1">',
  ].join("");

  const fields = extractHiddenFields(html);
  assert.equal(fields.get("partialResponse"), '[null,null,"123"]');
  assert.equal(fields.get("fbzx"), "123");
});

test("normalizes a valid submission", () => {
  const data = new FormData();
  data.set("name", " Ronan ");
  data.set("email", "ronan@example.com");
  data.set("social", "https://x.com/hunvreus");
  data.set("background", "Builder");
  data.set("interests", "Computers");

  assert.deepEqual(parseSubmission(data), {
    name: "Ronan",
    email: "ronan@example.com",
    social: "https://x.com/hunvreus",
    background: "Builder",
    interests: "Computers",
  });
});

test("rejects a bare social handle before Google does", () => {
  const data = new FormData();
  data.set("name", "Ronan");
  data.set("email", "ronan@example.com");
  data.set("social", "@hunvreus");
  data.set("background", "Builder");
  data.set("interests", "Computers");

  assert.throws(() => parseSubmission(data), (error) => error instanceof SubmissionError && error.status === 422);
});
