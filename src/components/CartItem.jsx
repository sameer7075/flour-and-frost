import { checkQuantity } from "../rules/quantityRules.js";
import { formatPrice, stockLabel } from "../utils/browse.js";
import { useState } from "react";

export default function CartItem({ item, quantity, incompatible, onChange, onRemove }) {
  const rule = checkQuantity(quantity, item.stock);
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <li className="card cart-item">
      {item.image && !imageFailed ? (
        <img className="cart-thumbnail" src={item.image} alt={item.name} onError={() => setImageFailed(true)} />
      ) : (
        <div className="placeholder cart-thumbnail" role="img" aria-label={`No photo for ${item.name}`}>
          {item.name.charAt(0)}
        </div>
      )}
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
