const currentURL = window.location.href;

const segments = currentURL.split("/");
const productId = segments[segments.length - 1];

fetch(`/api/products/${productId}?_expand=brand&_expand=category`)
  .then((response) => response.json())
  .then((product) => {
    // Update the HTML elements with the product details
    document.querySelector(".product-title").textContent = product.name;
    document.querySelector(".product-price-basic").textContent = product.price
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace(/,/g, ".")
      .replace(/₫/, "VNĐ");
    if (product.discount !== 0) {
      document.querySelector(".product-price-discount").textContent = (
        (product.price * (100 - product.discount)) /
        100
      )
        .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        .replace(/,/g, ".")
        .replace(/₫/, "VNĐ");
    } else {
      document.querySelector(".product-price-discount").textContent = "";
      document.querySelector(".product-price-basic").style.textDecoration =
        "none";
    }

    document.querySelector(".product-description").textContent =
      product.description;
    document.querySelector(".product-category").textContent = product.category.cateName;
    document.querySelector(".product-brand").textContent = "Thương hiệu: " + product.brand.name;
    document.querySelector(".img").src = product.img;
  })
  .catch((error) => console.error("Error fetching product data: ", error));
