import { Link } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import { checkItemForArea } from "../rules/areaRules.js";
import { formatPrice } from "../utils/browse.js";

const areas = [
  ["satellite-town", "Satellite Town"],
  ["saddar", "Saddar"],
  ["bahria-town", "Bahria Town"],
  ["dha", "DHA"],
];

export default function CartPage({ items, cart, method, area, onMethodChange, onAreaChange, onChangeQuantity, onRemove }) {
  const cartItems = cart.map((entry) => ({ ...entry, item: items.find((item) => item.id === entry.id) })).filter((entry) => entry.item);
  const subtotal = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const incompatibilities = cartItems.map((entry) => ({
    id: entry.id,
    result: checkItemForArea(entry.item, method, area),
  }));
  const hasConflict = incompatibilities.some((entry) => !entry.result.ok);

  if (cartItems.length === 0) {
    return (
      <section className="empty">
        <h1>Your cart is empty</h1>
        <p>Choose something from the menu to start a mixed order.</p>
        <Link className="btn btn-primary" to="/">Browse the menu</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>
      <p className="notice">Delivery is Rs. 200 in Satellite Town/Saddar or Rs. 350 in Bahria Town/DHA. Delivery needs a Rs. 1,500 subtotal and is free from Rs. 4,000.</p>
      <ul className="cart-list">
        {cartItems.map((entry) => {
          const issue = incompatibilities.find((value) => value.id === entry.id)?.result;
          return <CartItem key={entry.id} item={entry.item} quantity={entry.quantity} incompatible={!issue?.ok && issue.message} onChange={(quantity) => onChangeQuantity(entry.id, quantity)} onRemove={() => onRemove(entry.id)} />;
        })}
      </ul>
      <div className="checkout-layout">
        <div className="card">
          <h2>Fulfilment</h2>
          <fieldset>
            <legend>How will you receive it?</legend>
            <label><input type="radio" name="method" checked={method === "pickup"} onChange={() => onMethodChange("pickup")} /> Pickup from Satellite Town (free)</label>
            <label><input type="radio" name="method" checked={method === "delivery"} onChange={() => onMethodChange("delivery")} /> Delivery</label>
          </fieldset>
          {method === "delivery" && (
            <div className="field">
              <label htmlFor="area">Delivery area</label>
              <select id="area" value={area} onChange={(event) => onAreaChange(event.target.value)}>
                <option value="">Choose an area</option>
                {areas.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          )}
          {hasConflict && method === "delivery" && (
            <p className="status status-bad">Ice-Cream Cake is restricted to Satellite Town or Saddar. Switch to pickup or remove it.</p>
          )}
          <p className="muted">Items: {cartItems.length} · Subtotal: {formatPrice(subtotal)}</p>
          <Link className="btn btn-primary" to="/checkout">Continue to checkout</Link>
        </div>
        <OrderSummary subtotal={subtotal} method={method} area={area} />
      </div>
    </section>
  );
}
