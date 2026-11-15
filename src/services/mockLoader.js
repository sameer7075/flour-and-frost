import { items } from "../data/items.js";

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
