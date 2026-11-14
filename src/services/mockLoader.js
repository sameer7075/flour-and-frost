import { items } from "../data/items.js";

// Pretends to call a server. Returns a Promise so the app has real loading and error states.
// fail and changedStock are demo controls in the footer.
export function loadItems({ delayMs = 700, fail = false, changedStock = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error("Simulated loading failure"));
      } else {
        const stockChanges = {
          "red-velvet-cake": 1,
          "ice-cream-cake": 0,
          "cupcake-box-6": 3,
        };
        resolve(items.map((item) => ({
          ...item,
          ...(changedStock && Object.hasOwn(stockChanges, item.id) ? { stock: stockChanges[item.id] } : {}),
        })));
      }
    }, delayMs);
  });
}
