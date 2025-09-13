let cartCount = 0;
let cartTotal = 0;
let cartItems = {};

const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const miniCartTotalEl = document.getElementById("mini-cart-total");
const cartBtn = document.getElementById("cart-btn");
const miniCart = document.getElementById("mini-cart");
const cartItemsList = document.getElementById("cart-items");
const clearCartBtn = document.getElementById("clear-cart");

window.addEventListener("load", () => {
  const savedCart = JSON.parse(localStorage.getItem("cartData"));
  if (savedCart) {
    cartItems = savedCart.items || {};
    cartCount = savedCart.count || 0;
    cartTotal = savedCart.total || 0;
    updateCartUI();
  }
});

function saveCart() {
  localStorage.setItem(
    "cartData",
    JSON.stringify({ items: cartItems, count: cartCount, total: cartTotal })
  );
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: parseFloat(card.dataset.price),
    };
    addOne(product.id, product);
  });
});

function addOne(id, product) {
  if (!cartItems[id]) {
    cartItems[id] = { ...product, quantity: 0 };
  }
  cartItems[id].quantity++;
  cartCount++;
  cartTotal += cartItems[id].price;
  updateCartUI();
}

function removeOne(id) {
  if (cartItems[id]) {
    cartItems[id].quantity--;
    cartCount--;
    cartTotal -= cartItems[id].price;
    if (cartItems[id].quantity <= 0) delete cartItems[id];
    updateCartUI();
  }
}

clearCartBtn.addEventListener("click", () => {
  cartItems = {};
  cartCount = 0;
  cartTotal = 0;
  updateCartUI();
});

cartBtn.addEventListener("click", () => {
  miniCart.style.display = miniCart.style.display === "flex" ? "none" : "flex";
});

function updateCartUI() {
  cartCountEl.textContent = cartCount;
  if (miniCartTotalEl) miniCartTotalEl.textContent = cartTotal.toFixed(2);

  cartItemsList.innerHTML = "";
  for (const id in cartItems) {
    const item = cartItems[id];
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} — $${(
      item.price * item.quantity
    ).toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "−";
    removeBtn.addEventListener("click", () => removeOne(id));
    li.appendChild(removeBtn);

    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.addEventListener("click", () => addOne(id, item));
    li.appendChild(addBtn);

    cartItemsList.appendChild(li);
  }
  saveCart();
}

document.addEventListener("click", (e) => {
  if (!cartBtn.contains(e.target) && !miniCart.contains(e.target)) {
    miniCart.style.display = "none";
  }
});
