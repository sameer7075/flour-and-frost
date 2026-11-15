# Flour & Frost

Flour & Frost is a fictional bakery for university students and families in
Rawalpindi and Islamabad. Customers can browse 12 products, search and filter
the menu, build a mixed cart, choose pickup or delivery, review the complete
price, and place a simulated order.

## Run locally

```bash
npm install
npm run dev
```

Checks used before submission:

```bash
npm run lint
npm test
npm run build
```

## Business rules

- Each item allows 1 to 6 units, capped by today's stock. Sold-out items
  cannot be added.
- Ice-Cream Cake delivery is limited to Satellite Town and Saddar. Pickup is
  always available.
- Delivery requires a Rs. 1,500 subtotal, costs Rs. 200 in Satellite Town or
  Saddar and Rs. 350 in Bahria Town or DHA, and is free at Rs. 4,000 or more.

Orders are simulated. No real payment or personal data processing occurs.
The cart is saved in browser local storage so a refresh keeps the selection.

## Main routes

- `/` menu search, filtering, sorting, and product cards
- `/items/:id` product details
- `/cart` selection and fulfilment choices
- `/checkout` validated order form and final price
- `/confirmation` simulated order result

## Reproducing edge cases

The footer has two labelled demo controls:

- **Demo control: simulate a loading failure**: tick it and the menu load
  shows an error state with a working Try again button. Untick it and retry to
  restore the menu.
- **Demo control: change stock**: first untick it, add 4 Red Velvet Cakes and
  1 Ice-Cream Cake, then tick it. The next menu load changes Red Velvet Cake
  stock to 1 and makes Ice-Cream Cake sold out. The cart removes the
  unavailable cake, reduces Red Velvet Cake to 1, and shows a dismissible
  update notice on the cart and checkout pages. Refresh to confirm the
  corrected cart remains saved. Untick the control to return to normal stock.

The saved cart is also checked against current menu data on every successful
load. Invalid saved lines are removed without crashing the app.

## Concept map

- `src/App.jsx` owns loading, cart state, stock demo state, and persistence.
- `src/services/mockLoader.js` provides asynchronous menu data and demo
  failures or stock changes.
- `src/utils/cart.js` exports `reconcileCart` for changed availability.
- `src/components/CartNotice.jsx` displays reconciliation messages.
- `src/rules/quantityRules.js` enforces the shared quantity maximum.

## Photo credits

| Item | Photographer | Source link |
|---|---|---|
| Chocolate Truffle Cake | TODO | TODO |
| Red Velvet Cake | TODO | TODO |
| Vanilla Berry Cake | TODO | TODO |
| Ice-Cream Cake | TODO | TODO |
| Cupcake Box (6) | TODO | TODO |
| Brownie Box (9) | TODO | TODO |
| Dessert Box | TODO | TODO |
| Choc-Chip Cookies (6) | TODO | TODO |
| Oat & Raisin Cookies (6) | TODO | TODO |
| Banana Bread Loaf | TODO | TODO |
| Iced Coffee | TODO | TODO |
| Hot Chocolate | TODO | TODO |
