import { data } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleMode");
  const searchInput = document.getElementById("search");
  const cardContainer = document.getElementById("card-container");
  const sortBySelect = document.getElementById("sort-by");
  const filterBySelect = document.getElementById("filter-by");
  const favoriteContainer = document.getElementById("favorite_items");
  const toggleFavorites = document.getElementById("toggle-favorites");
  const favoriteItems = document.getElementById("favorite_items-container");
  toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });
  toggleFavorites.addEventListener("click", function () {
    favoriteItems.classList.toggle("hidden");
  });
  searchInput.addEventListener("input", function () {
    updateCards(searchInput.value.trim().toLowerCase());
  });

  sortBySelect.addEventListener("change", function () {
    // updateDisplay();
  });

  filterBySelect.addEventListener("change", function () {
    // updateDisplay();
  });
  const numberOfCards = document.getElementById("number-of-cards");

  numberOfCards.innerHTML = `"${data.length}" Web Topics Found`;

  function updateCards(query) {
    cardContainer.innerHTML = "";
    const filteredData = data.filter(
      (item) =>
        item.topic.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    filteredData.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = generateCard(item);
      cardContainer.appendChild(card);
    });

    const numberOfCards = document.getElementById("number-of-cards");
    numberOfCards.innerHTML = `"${filteredData.length}" Web Topics Found`;
  }

  function updateFavoriteCards() {
    favoriteContainer.innerHTML = ""; // Clear the container before adding new filtered cards
    const favoriteData = data.slice(0, 3);

    favoriteData.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card card-favorite";
      card.innerHTML = generateFavoriteCard(item);
      favoriteContainer.appendChild(card);
    });
  }

  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return `${'<ion-icon name="star"></ion-icon>'.repeat(fullStars)}
            ${'<ion-icon name="star-half"></ion-icon>'.repeat(halfStars)}
            ${'<ion-icon name="star-outline"></ion-icon>'.repeat(emptyStars)}`;
  }

  function generateCard(item) {
    return `
    <a href="/details/ItemDetails.html?id=${encodeURIComponent(
      item.id
    )}" class="card-link">
    <div class="card">
    <img src="${item.image}" alt="${item.topic}" class="card-image ">
    <div class="card-content">
      <h3 class="card-subtitle truncate">${item.category}</h3>
      <p class="card-title truncate">${item.topic}</p>
      <div class="card-rating">
        ${generateStars(item.rating)}
      </div>
      <p class="card-author  ">Author: ${item.name}</p>
    </div>
    </div>
    </a>
    `;
  }

  function generateFavoriteCard(item) {
    return `
    <img src="${item.image}" alt="${item.topic}" class="card-image">
    <div class="card-content">
      <p class="card-title truncate">${item.topic}</p>
      <div class="card-rating">
        ${generateStars(item.rating)}
      </div>
    </div>
    `;
  }
  updateCards("");
  updateFavoriteCards("");
});
