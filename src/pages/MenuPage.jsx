import { useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { filterAndSort, getCategories } from "../utils/browse.js";

export default function MenuPage({ items, onAddToCart }) {
  // Search, filter and sort live in the URL, so Back from an item page keeps them.
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "All";
  const sortBy = params.get("sort") ?? "default";

  const categories = getCategories(items);
  const results = filterAndSort(items, { query, category, sortBy });

  function update(key, value) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "" || value === "All" || value === "default") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  }

  function pickCategory(name) {
    setParams(name === "All" ? {} : { category: name }, { replace: true });
  }

  return (
    <section>
      <h1>Our menu</h1>
      <div className="intro-band">
        <p className="tagline">Small batches, big celebrations.</p>
        <p>Pick up from our Satellite Town shop or choose delivery across selected Rawalpindi and Islamabad areas.</p>
      </div>
      <p className="notice">Delivery is Rs. 200 in Satellite Town/Saddar or Rs. 350 in Bahria Town/DHA. Delivery needs a Rs. 1,500 subtotal and is free from Rs. 4,000. Pickup has no minimum.</p>

      <div className="controls">
        <div className="field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            value={query}
            placeholder="e.g. chocolate"
            onChange={(e) => update("q", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => update("category", e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sortBy} onChange={(e) => update("sort", e.target.value)}>
            <option value="default">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          datasetEmpty={items.length === 0}
          query={query}
          category={category}
          categories={categories}
          onClear={() => setParams({}, { replace: true })}
          onPickCategory={pickCategory}
        />
      ) : (
        <>
          <p className="muted" role="status">
            Showing {results.length} of {items.length} items
          </p>
          <ul className="grid">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
