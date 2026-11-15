export default function EmptyState({ datasetEmpty, query, category, categories, onClear, onPickCategory }) {
  if (datasetEmpty) {
    return (
      <div className="empty" role="status">
        <h2>The menu is empty right now</h2>
        <p>We have nothing listed today. Please check back soon.</p>
      </div>
    );
  }

  const activeFilters = [query && `search "${query}"`, category !== "All" && `category "${category}"`]
    .filter(Boolean)
    .join(" and ");

  return (
    <div className="empty" role="status">
      <h2>No items match your {activeFilters}</h2>
      <p>Try a different search, or pick one of these categories:</p>
      <ul className="chips">
        {categories
          .filter((c) => c !== "All")
          .map((c) => (
            <li key={c}>
              <button type="button" className="btn btn-secondary" onClick={() => onPickCategory(c)}>
                {c}
              </button>
            </li>
          ))}
      </ul>
      <button type="button" className="btn btn-primary" onClick={onClear}>
        Clear search and filters
      </button>
    </div>
  );
}
