import assert from "node:assert/strict";
import test from "node:test";
import { resolveRedirect } from "../src/server/redirects.ts";

test("resolves the first event redirect", () => {
  assert.equal(resolveRedirect("/1"), "https://luma.com/mi9hata3");
  assert.equal(resolveRedirect("/1/"), "https://luma.com/mi9hata3");
});

test("ignores unknown paths", () => {
  assert.equal(resolveRedirect("/"), null);
  assert.equal(resolveRedirect("/2"), null);
});
