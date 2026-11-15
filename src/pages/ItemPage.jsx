import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { formatPrice, stockLabel } from "../utils/browse.js";
import { checkQuantity } from "../rules/quantityRules.js";

const AREA_NAMES = {
  "satellite-town": "Satellite Town",
  saddar: "Saddar",
  "bahria-town": "Bahria Town",
  dha: "DHA",
};

export default function ItemPage({ items, onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const item = items.find((i) => i.id === id);
  const [imageFailed, setImageFailed] = useState(false);

  // "default" means this page was the first one opened, so there is no menu to go back to.
  const canGoBack = location.key !== "default";

  if (!item) {
    return (
      <section>
        <h1>We couldn't find that item</h1>
        <p>The link may be old or mistyped. "{id}" is not on our menu.</p>
        <Link className="btn btn-primary" to="/">
          Browse the menu
        </Link>
      </section>
    );
  }

  const soldOut = item.stock === 0;

  return (
    <section>
      {canGoBack ? (
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back to menu
        </button>
      ) : (
        <Link className="btn btn-secondary" to="/">
          ← Back to menu
        </Link>
      )}

      <h1>{item.name}</h1>
      <p className="muted">{item.category}</p>
      <p className="price">{formatPrice(item.price)}</p>
      {item.image && !imageFailed ? (
        <img src={item.image} alt={item.name} onError={() => setImageFailed(true)} />
      ) : (
        <div className="placeholder" role="img" aria-label={`No photo for ${item.name}`}>
          {item.name.charAt(0)}
        </div>
      )}
      <p>{item.description}</p>
      <p className={soldOut ? "status status-bad" : "status status-ok"}>{stockLabel(item.stock)}</p>
      <p className="muted">Maximum {Math.min(6, item.stock)} per order.</p>
      <button type="button" className="btn btn-primary" onClick={() => onAddToCart(item)} disabled={soldOut}>
        {soldOut ? "Unavailable" : "Add 1 to cart"}
      </button>
      {item.stock > 0 && <p className="muted">You can add up to {checkQuantity(6, item.stock).max} of this item.</p>}

      <h2>Delivery</h2>
      {item.deliveryAreas ? (
        <p>
          Delivery only to {item.deliveryAreas.map((a) => AREA_NAMES[a]).join(" and ")}. Pickup is available from our
          Satellite Town shop.
        </p>
      ) : (
        <p>Available for pickup and delivery to all areas we serve.</p>
      )}
    </section>
  );
}
