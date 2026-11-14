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
