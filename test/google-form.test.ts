import assert from "node:assert/strict";
import test from "node:test";
import { extractHiddenFields, parseSubmission, submitToGoogleForm } from "../src/server/google-form.ts";

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

test("accepts free-form social details", () => {
  const data = new FormData();
  data.set("name", "Ronan");
  data.set("email", "ronan@example.com");
  data.set("social", "@hunvreus");
  data.set("background", "Builder");
  data.set("interests", "Computers");

  assert.equal(parseSubmission(data).social, "@hunvreus");
});

test("retries transient Google form load failures before submitting", async () => {
  const html = [
    '<input type="hidden" name="fvv" value="1">',
    '<input type="hidden" name="partialResponse" value="[null,null,&quot;123&quot;]">',
    '<input type="hidden" name="pageHistory" value="0">',
    '<input type="hidden" name="fbzx" value="123">',
    '<input type="hidden" name="submissionTimestamp" value="-1">',
  ].join("");
  let loads = 0;
  let submissions = 0;
  const fetcher: typeof fetch = async (_input, init) => {
    if (init?.method === "POST") {
      submissions += 1;
      return new Response(null, { status: 200 });
    }

    loads += 1;
    return loads < 3 ? new Response(null, { status: 503 }) : new Response(html, { status: 200 });
  };

  await submitToGoogleForm(
    {
      name: "Yohann Leon",
      email: "yohann@example.com",
      social: "https://github.com/obynio",
      background: "Engineer",
      interests: "Infrastructure",
    },
    { fetcher, wait: async () => {} },
  );

  assert.equal(loads, 3);
  assert.equal(submissions, 1);
});
