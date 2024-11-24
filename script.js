function loadComponent(containerId, file, callback) {
  fetch(file)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
      if (callback) callback();
    });
}

loadComponent("search-container", "/components/search.html", initSearch);
loadComponent("cart-container", "/components/cart.html", initCart);
loadComponent("filters-container", "/components/filters.html", initFilters);
loadComponent(
  "products-container",
  "/components/products.html",
  renderProducts
);

let products = [];
let productsEls = [];
let cartItemCount = 0;

fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    renderProducts();
  });

function renderProducts() {
  const productsWrapperEl = document.getElementById("products-wrapper");
  if (!productsWrapperEl) return;

  productsWrapperEl.innerHTML = "";
  productsEls = products.map((product) => {
    const productEl = createProductElement(product);
    productsWrapperEl.appendChild(productEl);
    return productEl;
  });
}

function createProductElement(product) {
  const productEl = document.createElement("div");
  productEl.className = "item space-y-2";
  productEl.innerHTML = `
    <div class="bg-gray-100 flex justify-center relative overflow-hidden group cursor-pointer border">
      <img src="${product.url}" alt="${
    product.name
  }" class="w-full h-full object-cover" />
      <span class="status bg-black text-white absolute bottom-0 left-0 right-0 text-center py-2 translate-y-full transition group-hover:translate-y-0">
        Add To Cart
      </span>
    </div>
    <p class="text-xl">${product.name}</p>
    <strong>$${product.price.toLocaleString()}</strong>`;
  productEl.querySelector(".status").addEventListener("click", addToCart);
  return productEl;
}

function addToCart(e) {
  const statusEl = e.target;

  if (statusEl.classList.contains("added")) {
    statusEl.classList.remove("added", "bg-red-600");
    statusEl.classList.add("bg-gray-800");
    statusEl.innerText = "Add To Cart";
    cartItemCount--;
  } else {
    statusEl.classList.add("added", "bg-red-600");
    statusEl.classList.remove("bg-gray-800");
    statusEl.innerText = "Remove From Cart";
    cartItemCount++;
  }
  document.getElementById("cartCount").innerText = cartItemCount.toString();
}

function initFilters() {
  const filtersContainer = document.getElementById("filters-container");
  const checkEls = document.querySelectorAll(".check");
  if (filtersContainer) {
    filtersContainer.addEventListener("change", filterProducts);
  }

  function filterProducts() {
    const searchTerm = document
      .getElementById("search")
      .value.trim()
      .toLowerCase();
    const checkedCategories = Array.from(checkEls)
      .filter((check) => check.checked)
      .map((check) => check.id);

    productsEls.forEach((productEl, index) => {
      const product = products[index];
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm);
      const isInCheckedCategory =
        checkedCategories.length === 0 ||
        checkedCategories.includes(product.type);

      if (matchesSearchTerm && isInCheckedCategory) {
        productEl.classList.remove("hidden");
      } else {
        productEl.classList.add("hidden");
      }
    });
  }
}

function initSearch() {
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      document
        .querySelector("#filters-container")
        .dispatchEvent(new Event("change"));
    });
  }
}

function initCart() {
  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");
  cartCount.innerText = cartItemCount.toString(); // Initialize count
}
