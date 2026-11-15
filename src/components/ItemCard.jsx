import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, stockLabel } from "../utils/browse.js";

export default function ItemCard({ item, onAddToCart }) {
  const soldOut = item.stock === 0;
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <li className="card">
      {item.image && !imageFailed ? (
        <img src={item.image} alt={item.name} loading="lazy" onError={() => setImageFailed(true)} />
      ) : (
        <div className="placeholder" role="img" aria-label={`No photo for ${item.name}`}>
          {item.name.charAt(0)}
        </div>
      )}
      <h3>
        <Link to={`/items/${item.id}`}>{item.name}</Link>
      </h3>
      <p className="muted">{item.category}</p>
      <p className="price">{formatPrice(item.price)}</p>
      <p className={soldOut ? "status status-bad" : "status status-ok"}>{stockLabel(item.stock)}</p>
      <button type="button" className="btn btn-primary" onClick={() => onAddToCart(item)} disabled={soldOut}>
        {soldOut ? "Unavailable" : "Add to cart"}
      </button>
    </li>
  );
}
