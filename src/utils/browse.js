export function getCategories(items) {
  return ["All", ...new Set(items.map((item) => item.category))];
}

export function filterAndSort(items, { query, category, sortBy }) {
  const q = query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const text = [item.name, item.description, item.category, ...item.tags];
    const matchesQuery = q === "" || text.some((field) => field.toLowerCase().includes(q));
    const matchesCategory = category === "All" || item.category === category;
    return matchesQuery && matchesCategory;
  });

  const sorted = [...filtered];
  if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

export function formatPrice(price) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

export function stockLabel(stock) {
  if (stock === 0) return "Sold out";
  if (stock <= 3) return `Only ${stock} left`;
  return "In stock";
}
