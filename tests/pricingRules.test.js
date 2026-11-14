import test from "node:test";
import assert from "node:assert/strict";
import { evaluateOrder } from "../src/rules/pricingRules.js";

test("valid delivery order pays the area fee", () => {
  const r = evaluateOrder({ subtotal: 2000, method: "delivery", area: "satellite-town" });
  assert.equal(r.ok, true);
  assert.equal(r.fee, 200);
  assert.equal(r.total, 2200);
});

test("exactly the minimum (Rs. 1500) is allowed", () => {
  const r = evaluateOrder({ subtotal: 1500, method: "delivery", area: "dha" });
  assert.equal(r.ok, true);
  assert.equal(r.fee, 350);
});

test("one rupee below the minimum is blocked with the shortfall", () => {
  const r = evaluateOrder({ subtotal: 1499, method: "delivery", area: "saddar" });
  assert.equal(r.ok, false);
  assert.equal(r.code, "BELOW_MINIMUM");
  assert.equal(r.shortfall, 1);
});

test("exactly Rs. 4000 gets free delivery", () => {
  const r = evaluateOrder({ subtotal: 4000, method: "delivery", area: "bahria-town" });
  assert.equal(r.ok, true);
  assert.equal(r.fee, 0);
  assert.equal(r.total, 4000);
});

test("pickup ignores the minimum and has no fee", () => {
  const r = evaluateOrder({ subtotal: 400, method: "pickup" });
  assert.equal(r.ok, true);
  assert.equal(r.fee, 0);
});

test("unknown delivery area is rejected", () => {
  const r = evaluateOrder({ subtotal: 2000, method: "delivery", area: "mars" });
  assert.equal(r.ok, false);
  assert.equal(r.code, "UNKNOWN_AREA");
});
