// Local data for Flour & Frost. Each record has a stable string id.
// stock: units available today (0 = sold out, used to demo unavailable states).
// deliveryAreas: null means deliverable everywhere; an array limits delivery (Rule 2).
// image: leave "" to test the missing-image fallback.

export const items = [
  { id: "choc-truffle-cake", name: "Chocolate Truffle Cake", category: "Cakes", price: 2400, stock: 5, tags: ["chocolate"], deliveryAreas: null, image: "", description: "1 kg cake, dark chocolate ganache, serves 8." },
  { id: "red-velvet-cake", name: "Red Velvet Cake", category: "Cakes", price: 2600, stock: 4, tags: ["cream-cheese"], deliveryAreas: null, image: "", description: "1 kg cake with cream cheese frosting, serves 8." },
  { id: "vanilla-berry-cake", name: "Vanilla Berry Cake", category: "Cakes", price: 2300, stock: 0, tags: ["fruit"], deliveryAreas: null, image: "", description: "1 kg vanilla sponge with berry compote. Sold out today." },
  { id: "ice-cream-cake", name: "Ice-Cream Cake", category: "Cakes", price: 3200, stock: 3, tags: ["frozen"], deliveryAreas: ["satellite-town", "saddar"], image: "", description: "1 kg frozen cake. Delivery only to Satellite Town and Saddar; pickup anywhere." },
  { id: "cupcake-box-6", name: "Cupcake Box (6)", category: "Boxes", price: 1200, stock: 12, tags: ["assorted"], deliveryAreas: null, image: "", description: "Six cupcakes, assorted flavours." },
  { id: "brownie-box-9", name: "Brownie Box (9)", category: "Boxes", price: 1500, stock: 10, tags: ["chocolate", "nuts"], deliveryAreas: null, image: "", description: "Nine fudge brownies with walnuts." },
  { id: "dessert-box", name: "Dessert Box", category: "Boxes", price: 1800, stock: 2, tags: ["assorted"], deliveryAreas: null, image: "", description: "Mixed dessert selection for 4 people." },
  { id: "choc-chip-cookies", name: "Choc-Chip Cookies (6)", category: "Cookies", price: 700, stock: 20, tags: ["chocolate"], deliveryAreas: null, image: "", description: "Six large cookies, baked fresh." },
  { id: "oat-raisin-cookies", name: "Oat & Raisin Cookies (6)", category: "Cookies", price: 650, stock: 15, tags: ["oats"], deliveryAreas: null, image: "", description: "Six chewy oat cookies." },
  { id: "banana-bread", name: "Banana Bread Loaf", category: "Loaves", price: 900, stock: 8, tags: ["fruit"], deliveryAreas: null, image: "", description: "Moist loaf, serves 6." },
  { id: "iced-coffee", name: "Iced Coffee", category: "Drinks", price: 450, stock: 25, tags: ["cold"], deliveryAreas: null, image: "", description: "300 ml cold coffee." },
  { id: "hot-chocolate", name: "Hot Chocolate", category: "Drinks", price: 400, stock: 25, tags: ["hot"], deliveryAreas: null, image: "", description: "250 ml thick hot chocolate." },
];
