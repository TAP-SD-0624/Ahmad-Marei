document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleMode");
  const searchInput = document.getElementById("search");
  const cardContainer = document.getElementById("card-container");
  const sortBySelect = document.getElementById("sort-by");
  const filterBySelect = document.getElementById("filter-by");
  const favoriteContainer = document.getElementById("favorite_items");
  const toggleFavorites = document.getElementById("toggle-favorites");
  const favoriteItems = document.getElementById("favorite_items-container");
  const isDarkMode = JSON.parse(localStorage.getItem("dark-mode"));
  const numberOfCards = document.getElementById("number-of-cards");
  const loadingIndicator = document.getElementById("loading");

  showLoading();
  fetch("https://tap-web-1.herokuapp.com/topics/list")
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      populateFilterOptions(data);
      updateCards();
      numberOfCards.innerHTML = `"${data.length}" Web Topics Found`;
    })
    .catch((error) => {
      hideLoading();
      console.error("Error fetching data:", error);
    });

  document.body.classList.toggle("dark-mode", isDarkMode);
  toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "dark-mode",
      document.body.classList.contains("dark-mode")
    );
  });
  toggleFavorites.addEventListener("click", function () {
    favoriteItems.classList.toggle("hidden");
    updateFavoriteCards();
  });
  searchInput.addEventListener("input", function () {
    updateCards();
  });

  sortBySelect.addEventListener("change", function () {
    updateCards();
  });

  filterBySelect.addEventListener("change", function () {
    updateCards();
  });

  function populateFilterOptions(topicsData) {
    const categories = [...new Set(topicsData.map((item) => item.category))];
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      filterBySelect.appendChild(option);
    });
  }

  function updateCards() {
    const query = searchInput.value.trim().toLowerCase();
    let filteredData = [];
    fetch("https://tap-web-1.herokuapp.com/topics/list?phrase=" + query)
      .then((response) => response.json())
      .then((data) => {
        filteredData = data;
        const sortBy = sortBySelect.value;
        const filterBy = filterBySelect.value;

        if (filterBy !== "default") {
          filteredData = filteredData.filter(
            (item) => item.category === filterBy
          );
        }

        filteredData.sort((a, b) => {
          if (sortBy === "title") {
            return a.topic.localeCompare(b.topic);
          } else if (sortBy === "author") {
            return a.name.localeCompare(b.name);
          }
          return 0;
        });

        cardContainer.innerHTML = "";
        filteredData.forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = generateCard(item);
          cardContainer.appendChild(card);
        });
        numberOfCards.innerHTML = `"${filteredData.length}" Web Topics Found`;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function updateFavoriteCards() {
    favoriteContainer.innerHTML = ""; // Clear the container before adding new filtered cards
    const favoriteData = JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteData.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card card__favorite";
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
    <div class="card no-border shadow-sm">
    <img src="/images/${item.image}" alt="${item.topic}" class="card-img-top">
    <div class="card-body">
      <h3 class="card-subtitle truncate">${item.category}</h3>
      <p class="card-title truncate">${item.topic}</p>
      <div class="card-rating mt-4 d-flex align-item-center ">
        ${generateStars(item.rating)}
      </div>
      <p class="card-author mb-0 mt-2 ">Author: ${item.name}</p>
    </div>
    </div>
    </a>
    `;
  }

  function generateFavoriteCard(item) {
    const currentPath = window.location.pathname;
    const isDetailsPage = currentPath.includes("details");

    return `
    <a href="/details/ItemDetails.html?id=${encodeURIComponent(
      item.id
    )}" class="card-link">
    <div class="card no-border shadow-sm">
    <img src="/images/${item.image}" alt="${item.topic}" class="card-img-top">
    <div class="card-body">
      <p class="card-title truncate">${item.topic}</p>
      <div class="card-rating  d-flex align-item-center ">
        ${generateStars(item.rating)}
      </div>
    </div>
    </div>
    </a>
    `;
  }

  function showLoading() {
    loadingIndicator.classList.remove("hidden");
  }

  function hideLoading() {
    loadingIndicator.classList.add("hidden");
  }
});
