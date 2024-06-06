import { data } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleMode");

  toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });

  const numberOfCards = document.getElementById("number-of-cards");

  numberOfCards.innerHTML = `"${data.length}" Web Topics Found`;

  const cardContainer = document.getElementById("card-container");

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = generateCard(item);
    cardContainer.appendChild(card);
  });

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
    <img src="${item.image}" alt="${item.topic}" class="card-image">
    <div class="card-content">
      <h3 class="card-subtitle truncate">${item.category}</h3>
      <p class="card-title">${item.topic}</p>
      <div class="card-rating">
        ${generateStars(item.rating)}
      </div>
      <p class="card-author  ">Author: ${item.name}</p>
    </div>
    `;
  }
});
