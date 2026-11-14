import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { loadItems } from "./services/mockLoader.js";
import MenuPage from "./pages/MenuPage.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import { checkQuantity } from "./rules/quantityRules.js";
import { DELIVERY_FEES } from "./rules/pricingRules.js";

const STORAGE_KEY = "flour-frost-cart";
const DEFAULT_METHOD = "pickup";
const DEFAULT_AREA = "satellite-town";

function readSavedOrder() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    const storedCart = Array.isArray(saved) ? saved : saved?.cart;
    const method = saved?.method === "delivery" || saved?.method === "pickup" ? saved.method : DEFAULT_METHOD;
    const area = Object.hasOwn(DELIVERY_FEES, saved?.area) ? saved.area : DEFAULT_AREA;
    return {
      cart: Array.isArray(storedCart) ? storedCart : [],
      method,
      area,
    };
  } catch (error) {
    console.warn("Could not restore the saved order.", error);
    return { cart: [], method: DEFAULT_METHOD, area: DEFAULT_AREA };
  }
}

export default function App() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [savedOrder] = useState(readSavedOrder);
  const [cart, setCart] = useState(savedOrder.cart);
  const [method, setMethod] = useState(savedOrder.method);
  const [area, setArea] = useState(savedOrder.area);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, method, area }));
  }, [cart, method, area]);

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
            <Route path="/cart" element={<CartPage items={items} cart={cart} method={method} area={area} onMethodChange={setMethod} onAreaChange={setArea} onChangeQuantity={changeQuantity} onRemove={removeItem} />} />
            <Route path="/checkout" element={<CheckoutPage items={items} cart={cart} method={method} area={area} onPlaceOrder={(order) => { setLastOrder(order); setCart([]); }} />} />
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
