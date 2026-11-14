import { evaluateOrder } from "../rules/pricingRules.js";
import { formatPrice } from "../utils/browse.js";

export default function OrderSummary({ subtotal, method, area }) {
  const result = evaluateOrder({ subtotal, method, area });

  return (
    <aside className="summary card" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Order summary</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div><dt>Delivery</dt><dd>{result.fee ? formatPrice(result.fee) : method === "delivery" ? "Free" : "None"}</dd></div>
        <div className="summary-total"><dt>Total</dt><dd>{formatPrice(result.total)}</dd></div>
      </dl>
      <p className={result.ok ? "status status-ok" : "status status-bad"} role={result.ok ? "status" : "alert"}>
        {result.message}
      </p>
    </aside>
  );
}
