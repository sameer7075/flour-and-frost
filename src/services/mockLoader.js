import { items } from "../data/items.js";

// Pretends to call a server. Returns a Promise so the app has real loading and error states.
// fail: demo control (see the checkbox in the footer) that forces a failure.
export function loadItems({ delayMs = 700, fail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error("Simulated loading failure"));
      } else {
        // Return copies so the pages can never mutate the source data.
        resolve(items.map((item) => ({ ...item })));
      }
    }, delayMs);
  });
}
