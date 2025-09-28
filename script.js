let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, name, price, image) {
  let item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart();
}

function removeFromCart(id) {
  let item = cart.find(p => p.id === id);
  if (item) {
    item.qty--;
    if (item.qty <= 0) {
      cart = cart.filter(p => p.id !== id);
    }
  }
  saveCart();
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (cartCount) cartCount.textContent = cart.reduce((a, c) => a + c.qty, 0);

  if (cartItems) {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      let li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        ${item.name} x${item.qty}
        <div>
          <button onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.image}')">+</button>
          <button onclick="removeFromCart(${item.id})">-</button>
        </div>
      `;
      cartItems.appendChild(li);
    });
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
  }

  // Checkout page
  const checkoutItems = document.getElementById("checkout-cart-items");
  const checkoutTotal = document.getElementById("checkout-total");
  if (checkoutItems) {
    checkoutItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      let li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        ${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}
        <button onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.image}')">+</button>
        <button onclick="removeFromCart(${item.id})">-</button>
      `;
      checkoutItems.appendChild(li);
    });
    if (checkoutTotal) checkoutTotal.textContent = total.toFixed(2);

    if (cart.length === 0) {
      alert("⚠️ Your cart is empty. Redirecting to shop...");
      window.location.href = "index.html";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cart-btn");
  const miniCart = document.getElementById("mini-cart");

  if (cartBtn && miniCart) {
    cartBtn.addEventListener("click", () => {
      miniCart.classList.toggle("hidden");
    });
  }

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        alert("⚠️ Cannot checkout with empty cart!");
        return;
      }
      alert("✅ Order placed successfully!");
      cart = [];
      saveCart();
      window.location.href = "index.html";
    });
  }

  updateCartUI();
});
