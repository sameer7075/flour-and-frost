import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { loadItems } from "./services/mockLoader.js";
import MenuPage from "./pages/MenuPage.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import { checkQuantity } from "./rules/quantityRules.js";

export default function App() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("flour-frost-cart") ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("Could not restore the saved cart.", error);
      return [];
    }
  });
  const [fulfillment, setFulfillment] = useState({ method: "pickup", area: "" });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem("flour-frost-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item, requestedQuantity = 1) {
    const quantity = checkQuantity(requestedQuantity, item.stock);
    if (!quantity.ok) return;
    setCart((previous) => {
      const existing = previous.find((entry) => entry.id === item.id);
      if (existing) {
        const nextQuantity = Math.min(quantity.max, existing.quantity + requestedQuantity);
        return previous.map((entry) => entry.id === item.id ? { ...entry, quantity: nextQuantity } : entry);
      }
      return [...previous, { id: item.id, quantity: requestedQuantity }];
    });
  }

  function changeQuantity(id, requestedQuantity) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    const quantity = checkQuantity(requestedQuantity, item.stock);
    if (!quantity.ok) return;
    setCart((previous) => previous.map((entry) => entry.id === id ? { ...entry, quantity: requestedQuantity } : entry));
  }

  function removeItem(id) {
    setCart((previous) => previous.filter((entry) => entry.id !== id));
  }

  function updateFulfillment(next) {
    setFulfillment((previous) => ({ ...previous, ...next }));
  }

  // Load the data from the mock server. Re-runs on retry or when the demo switch changes.
  useEffect(() => {
    let ignore = false; // cleanup flag: ignore a response that arrives after we left
    loadItems({ fail: simulateFailure })
      .then((data) => {
        if (!ignore) {
          setItems(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [attempt, simulateFailure]);

  function retry() {
    setStatus("loading");
    setAttempt((n) => n + 1); // functional update: next value depends on the previous one
  }

  function toggleFailure(checked) {
    setStatus("loading");
    setSimulateFailure(checked);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="brand">
          Flour &amp; Frost
        </Link>
        <nav aria-label="Main">
          <NavLink to="/" end>
            Menu
          </NavLink>
          <NavLink to="/cart">Cart ({cart.reduce((sum, entry) => sum + entry.quantity, 0)})</NavLink>
        </nav>
      </header>

      <main id="main">
        {status === "loading" && <p role="status">Loading the menu…</p>}

        {status === "error" && (
          <div role="alert" className="empty">
            <h2>We couldn't load the menu</h2>
            <p>Something went wrong while fetching our items.</p>
            <button type="button" className="btn btn-primary" onClick={retry}>
              Try again
            </button>
          </div>
        )}

        {status === "ready" && (
          <Routes>
            <Route path="/" element={<MenuPage items={items} onAddToCart={addToCart} />} />
            <Route path="/items/:id" element={<ItemPage items={items} onAddToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage items={items} cart={cart} fulfillment={fulfillment} onChangeQuantity={changeQuantity} onRemove={removeItem} onSetFulfillment={updateFulfillment} />} />
            <Route path="/checkout" element={<CheckoutPage items={items} cart={cart} fulfillment={fulfillment} onPlaceOrder={(order) => { setLastOrder(order); setCart([]); }} />} />
            <Route path="/confirmation" element={<ConfirmationPage order={lastOrder} />} />
            <Route
              path="*"
              element={
                <section>
                  <h1>Page not found</h1>
                  <p>That address doesn't exist on our site.</p>
                  <Link className="btn btn-primary" to="/">
                    Go to the menu
                  </Link>
                </section>
              }
            />
          </Routes>
        )}
      </main>

      <footer className="site-footer">
        <p>Flour &amp; Frost is a fictional bakery. Orders on this site are simulated.</p>
        <label className="demo">
          <input type="checkbox" checked={simulateFailure} onChange={(e) => toggleFailure(e.target.checked)} />
          Demo control: simulate a loading failure
        </label>
      </footer>
    </>
  );
}
