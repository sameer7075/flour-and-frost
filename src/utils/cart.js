import { checkQuantity } from "../rules/quantityRules.js";

export function reconcileCart(cart, items) {
  const messages = [];
  const newCart = cart.reduce((result, entry) => {
    if (!entry || typeof entry.id !== "string") return result;

    const item = items.find((currentItem) => currentItem.id === entry.id);
    if (!item) {
      messages.push(`${entry.id} is no longer on the menu.`);
      return result;
    }

    if (!Number.isInteger(entry.quantity) || entry.quantity < 1) return result;
    if (item.stock === 0) {
      messages.push(`${item.name} is sold out and was removed.`);
      return result;
    }

    const { max } = checkQuantity(6, item.stock);
    if (entry.quantity > max) {
      messages.push(`${item.name} was reduced from ${entry.quantity} to ${max} because stock changed.`);
      result.push({ ...entry, quantity: max });
      return result;
    }

    result.push({ ...entry });
    return result;
  }, []);

  return { cart: newCart, messages };
}
