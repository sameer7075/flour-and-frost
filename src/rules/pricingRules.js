// Rule 3 (pricing / fulfilment): delivery minimum, area fee, free-delivery threshold.
// Pure function: no React, no browser APIs, so Node can test it directly.

export const MIN_DELIVERY_SUBTOTAL = 1500;
export const FREE_DELIVERY_THRESHOLD = 4000;

// Delivery fee in Rs. per area. An area not listed here is not served.
export const DELIVERY_FEES = {
  "satellite-town": 200,
  saddar: 200,
  "bahria-town": 350,
  dha: 350,
};

/**
 * Work out whether an order can be confirmed and what it costs.
 * @param {{ subtotal: number, method: "pickup" | "delivery", area?: string }} order
 * @returns {{ ok: boolean, code: string, message: string, fee: number, total: number, shortfall: number }}
 */
export function evaluateOrder({ subtotal, method, area }) {
  // Pickup has no minimum and no fee.
  if (method === "pickup") {
    return result(true, "PICKUP_OK", "Pickup from Satellite Town shop.", 0, subtotal, 0);
  }

  const baseFee = DELIVERY_FEES[area];
  if (baseFee === undefined) {
    return result(false, "UNKNOWN_AREA", "Please choose a delivery area we serve.", 0, subtotal, 0);
  }

  // Boundary: exactly the minimum is allowed, one rupee less is not.
  if (subtotal < MIN_DELIVERY_SUBTOTAL) {
    const shortfall = MIN_DELIVERY_SUBTOTAL - subtotal;
    return result(
      false,
      "BELOW_MINIMUM",
      `Delivery needs Rs. ${MIN_DELIVERY_SUBTOTAL} minimum. Add Rs. ${shortfall} more or choose pickup.`,
      baseFee,
      subtotal,
      shortfall
    );
  }

  // Boundary: exactly the threshold already counts as free delivery.
  const fee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : baseFee;
  const message = fee === 0 ? "Free delivery applied." : `Delivery fee: Rs. ${fee}.`;
  return result(true, fee === 0 ? "FREE_DELIVERY" : "DELIVERY_OK", message, fee, subtotal + fee, 0);
}

function result(ok, code, message, fee, total, shortfall) {
  return { ok, code, message, fee, total, shortfall };
}
