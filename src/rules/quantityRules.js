export function checkQuantity(quantity, stock) {
  const max = Math.min(6, Math.max(0, stock));

  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, max, message: "Quantity must be at least 1." };
  }
  if (stock <= 0) {
    return { ok: false, max, message: "This item is sold out." };
  }
  if (quantity > max) {
    return { ok: false, max, message: `Maximum ${max} per order.` };
  }
  return { ok: true, max, message: "" };
}
