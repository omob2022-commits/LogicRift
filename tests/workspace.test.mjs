import test from "node:test";
import assert from "node:assert/strict";
import {
  createCode,
  createProject,
  demoProject,
  newId,
  questionsFor,
  progress,
  invitationError,
  normalizeCode,
  extractDrafts,
  reviseRequirement,
  csv,
} from "../src/lib/workspace.ts";
const project = () =>
  createProject("owner", {
    name: "Test",
    client: "Client",
    sector: "Services",
    description: "Goal",
    scope: "",
  });
test("invitation validation distinguishes missing, revoked, and expired codes", () => {
  const p = project();
  assert.equal(normalizeCode(" lr-abcd 1234 "), "LRABCD1234");
  assert.equal(invitationError(p), null);
  assert.match(invitationError(undefined), /غير صحيح/);
  assert.match(invitationError({ ...p, inviteActive: false }), /أوقفت/);
  assert.match(
    invitationError({ ...p, expiresAt: new Date(0).toISOString() }),
    /انتهت/,
  );
});

test("generated ids and codes remain valid without crashing when crypto is unavailable", () => {
  const originalCrypto = globalThis.crypto;
  Object.defineProperty(globalThis, "crypto", {
    value: undefined,
    configurable: true,
    writable: true,
  });

  try {
    const id = newId();
    const code = createCode();
    assert.match(
      id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    assert.match(code, /^LR-[A-Z0-9]{8}$/);
  } finally {
    Object.defineProperty(globalThis, "crypto", {
      value: originalCrypto,
      configurable: true,
      writable: true,
    });
  }
});
test("payment follow-up appears only when relevant and counts toward completion", () => {
  const p = project();
  assert.equal(questionsFor(p).length, 5);
  for (const q of questionsFor(p))
    p.answers[q.id] = { text: "تفاصيل", deferred: false, updatedAt: "" };
  assert.equal(progress(p), 100);
  p.answers.features.text = "نحتاج دفع إلكتروني";
  assert.equal(questionsFor(p).length, 6);
  assert.equal(progress(p), 83);
  p.answers.payment = { text: "", deferred: true, updatedAt: "" };
  assert.equal(progress(p), 100);
});
test("drafts retain literal source, remain unapproved, and repeated extraction is idempotent", () => {
  const p = project();
  p.answers.goal = {
    text: "نريد جدولة الحجوزات",
    deferred: false,
    updatedAt: "",
  };
  p.answers.users = { text: "", deferred: true, updatedAt: "" };
  const extracted = extractDrafts(p);
  assert.equal(extracted.requirements[0].sourceText, p.answers.goal.text);
  assert.equal(extracted.requirements[0].status, "draft");
  assert.equal(extracted.decisions.length, 1);
  assert.deepEqual(extractDrafts({ ...p, ...extracted }), extracted);
  const changed = {
    ...p,
    ...extracted,
    answers: {
      ...p.answers,
      goal: { ...p.answers.goal, text: "تغيير قرار سابق" },
    },
  };
  assert.equal(extractDrafts(changed).requirements.length, 2);
  assert.equal(extracted.requirements[0].title, "نريد جدولة الحجوزات");
});
test("approved content changes require reapproval without mutating saved versions", () => {
  const p = demoProject();
  const r = p.requirements[0];
  const snapshot = structuredClone(r);
  const revised = reviseRequirement(r, {
    title: "New meaning",
    status: "approved",
  });
  assert.equal(revised.status, "review");
  assert.equal(revised.history.length, r.history.length + 1);
  assert.deepEqual(r, snapshot);
});
test("CSV includes only approved requirements, escapes quoting, and neutralizes spreadsheet formulas", () => {
  const p = demoProject();
  p.requirements[0].title = '=HYPERLINK("x")';
  const result = csv(p);
  assert.ok(result.startsWith("\uFEFF"));
  assert.ok(result.includes("'=HYPERLINK("));
  assert.ok(result.includes('""x""'));
  assert.ok(result.includes("REQ-001"));
  assert.ok(!result.includes("REQ-002"));
  assert.ok(!result.includes("REQ-003"));
});
