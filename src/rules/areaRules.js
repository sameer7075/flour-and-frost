export function checkItemForArea(item, method, area) {
  if (method === "pickup" || !item.deliveryAreas || item.deliveryAreas.includes(area)) {
    return { ok: true, message: "" };
  }
  return {
    ok: false,
    message: `${item.name} can only be delivered to Satellite Town or Saddar.`,
  };
}
