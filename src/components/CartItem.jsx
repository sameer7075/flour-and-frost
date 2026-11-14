import { checkQuantity } from "../rules/quantityRules.js";
import { formatPrice, stockLabel } from "../utils/browse.js";

export default function CartItem({ item, quantity, incompatible, onChange, onRemove }) {
  const rule = checkQuantity(quantity, item.stock);
  return (
    <li className="card cart-item">
      <div>
        <h3>{item.name}</h3>
        <p className="muted">{formatPrice(item.price)} each · {stockLabel(item.stock)}</p>
        {incompatible && <p className="status status-bad">{incompatible}</p>}
        {!rule.ok && <p className="status status-bad">{rule.message}</p>}
      </div>
      <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
        <button type="button" className="btn btn-secondary" aria-label={`Decrease ${item.name}`} onClick={() => onChange(quantity - 1)} disabled={quantity <= 1}>−</button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" className="btn btn-secondary" aria-label={`Increase ${item.name}`} onClick={() => onChange(quantity + 1)} disabled={quantity >= rule.max}>+</button>
      </div>
      <strong>{formatPrice(item.price * quantity)}</strong>
      <button type="button" className="btn btn-secondary" onClick={onRemove}>Remove</button>
    </li>
  );
}
