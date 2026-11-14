import { Link } from "react-router-dom";
import { formatPrice } from "../utils/browse.js";

export default function ConfirmationPage({ order }) {
  if (!order) {
    return <section className="empty"><h1>No recent order</h1><p>Place an order first to see its confirmation.</p><Link className="btn btn-primary" to="/">Browse the menu</Link></section>;
  }
  return (
    <section className="confirmation">
      <p className="status status-ok">Order confirmed</p>
      <h1>Thanks, {order.form.name}!</h1>
      <p>Your simulated order <strong>{order.id}</strong> has been recorded. We will not charge you.</p>
      <div className="card"><h2>Final summary</h2><p>{order.cart.reduce((sum, entry) => sum + entry.quantity, 0)} item(s) · {formatPrice(order.pricing.total)}</p><p>{order.pricing.message}</p></div>
      <Link className="btn btn-primary" to="/">Order something else</Link>
    </section>
  );
}
