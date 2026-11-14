import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderSummary from "../components/OrderSummary.jsx";
import { checkItemForArea } from "../rules/areaRules.js";
import { checkQuantity } from "../rules/quantityRules.js";
import { evaluateOrder } from "../rules/pricingRules.js";

export default function CheckoutPage({ items, cart, fulfillment, onPlaceOrder }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "cash", notes: "" });
  const [errors, setErrors] = useState({});
  const cartItems = cart.map((entry) => ({ ...entry, item: items.find((item) => item.id === entry.id) })).filter((entry) => entry.item);
  const subtotal = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const pricing = evaluateOrder({ subtotal, ...fulfillment });

  if (cartItems.length === 0) {
    return <section className="empty"><h1>Nothing to check out</h1><p>Add items before continuing.</p><Link className="btn btn-primary" to="/">Browse the menu</Link></section>;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^03\d{9}$/.test(form.phone.trim())) nextErrors.phone = "Enter an 11-digit Pakistani mobile number starting with 03.";
    if (fulfillment.method === "delivery" && form.address.trim().length < 8) nextErrors.address = "Enter a complete delivery address.";
    if (!pricing.ok) nextErrors.order = pricing.message;
    for (const entry of cartItems) {
      const quantity = checkQuantity(entry.quantity, entry.item.stock);
      const area = checkItemForArea(entry.item, fulfillment.method, fulfillment.area);
      if (!quantity.ok) nextErrors.order = `${entry.item.name}: ${quantity.message}`;
      if (!area.ok) nextErrors.order = area.message;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const order = { id: `FF-${Date.now().toString().slice(-6)}`, form, fulfillment, cart: cartItems, subtotal, pricing };
    onPlaceOrder(order);
    navigate("/confirmation", { replace: true });
  }

  return (
    <section>
      <h1>Checkout</h1>
      <p className="notice">This is a simulated order. No real payment is taken.</p>
      <div className="checkout-layout">
        <form className="card form-stack" onSubmit={submit} noValidate>
          <h2>Your details</h2>
          {errors.order && <p className="status status-bad" role="alert">{errors.order}</p>}
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" value={form.name} onChange={updateField} aria-invalid={Boolean(errors.name)} />{errors.name && <span className="field-error">{errors.name}</span>}</div>
          <div className="field"><label htmlFor="phone">Mobile number</label><input id="phone" name="phone" inputMode="tel" value={form.phone} onChange={updateField} placeholder="03001234567" aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className="field-error">{errors.phone}</span>}</div>
          {fulfillment.method === "delivery" && <div className="field"><label htmlFor="address">Delivery address</label><textarea id="address" name="address" value={form.address} onChange={updateField} aria-invalid={Boolean(errors.address)} />{errors.address && <span className="field-error">{errors.address}</span>}</div>}
          <div className="field"><label htmlFor="payment">Payment choice</label><select id="payment" name="payment" value={form.payment} onChange={updateField}><option value="cash">Cash on delivery/pickup</option><option value="wallet">Fictional Frost Wallet</option></select></div>
          <div className="field"><label htmlFor="notes">Order notes (optional)</label><textarea id="notes" name="notes" value={form.notes} onChange={updateField} /></div>
          <div className="actions"><Link className="btn btn-secondary" to="/cart">Back to cart</Link><button className="btn btn-primary" type="submit">Place simulated order</button></div>
        </form>
        <OrderSummary subtotal={subtotal} method={fulfillment.method} area={fulfillment.area} />
      </div>
    </section>
  );
}
