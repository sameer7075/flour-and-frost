export const MIN_DELIVERY_SUBTOTAL = 1500;
export const FREE_DELIVERY_THRESHOLD = 4000;

export const DELIVERY_FEES = {
  "satellite-town": 200,
  saddar: 200,
  "bahria-town": 350,
  dha: 350,
};

export function evaluateOrder({ subtotal, method, area }) {
  if (method === "pickup") {
    return result(true, "PICKUP_OK", "Pickup from Satellite Town shop.", 0, subtotal, 0);
  }

  const baseFee = DELIVERY_FEES[area];
  if (baseFee === undefined) {
    return result(false, "UNKNOWN_AREA", "Please choose a delivery area we serve.", 0, subtotal, 0);
  }

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

  const fee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : baseFee;
  const message = fee === 0 ? "Free delivery applied." : `Delivery fee: Rs. ${fee}.`;
  return result(true, fee === 0 ? "FREE_DELIVERY" : "DELIVERY_OK", message, fee, subtotal + fee, 0);
}

function result(ok, code, message, fee, total, shortfall) {
  return { ok, code, message, fee, total, shortfall };
}
