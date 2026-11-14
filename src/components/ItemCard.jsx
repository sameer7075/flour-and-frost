import { Link } from "react-router-dom";
import { formatPrice, stockLabel } from "../utils/browse.js";

export default function ItemCard({ item }) {
  const soldOut = item.stock === 0;

  return (
    <li className="card">
      {item.image ? (
        <img src={item.image} alt={item.name} />
      ) : (
        // Fallback when an image is missing.
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
    </li>
  );
}
