document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  console.log(id, "id");
  if (id) {
    fetch(`https://tap-web-1.herokuapp.com/topics/details/${id}`)
      .then((response) => response.json())
      .then((item) => {
        if (item) {
          document.querySelector(".details__title").innerText = item.topic;
          document.querySelector(".details__subtitle").innerText =
            item.category;
          document.querySelector(".details__rating").innerHTML = generateStars(
            item.rating
          );
          document.querySelector(".details__description").innerText =
            item.description;
          document.querySelector(
            ".details__image"
          ).src = `/images/${item.image}`;
          document.querySelector(".details__image").alt = item.topic;
          document.querySelector(".details__author a").innerText = item.name;
          document.querySelector(".details__author strong").innerText =
            item.topic;
          document.querySelector(
            ".details__sub-title"
          ).innerText = `${item.topic} Sub Topics`;
          document.querySelector(".details__sub-list").innerHTML =
            generateSubTopics(item.subtopics);

          const addToFavoritesButton =
            document.getElementById("addToFavorites");
          const buttonText = document.querySelector("#addToFavorites span");
          const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          const isItemInFavorites = favorites.find(
            (favorite) => favorite.id === item.id
          );

          buttonText.innerText = isItemInFavorites
            ? "Remove from Favorites"
            : "Add to Favorites";

          addToFavoritesButton.addEventListener(
            "click",
            changeFavoriteButton.bind(null, item, buttonText)
          );
        } else {
          document.querySelector(".details").innerText = "Item not found.";
        }
      });
  } else {
    document.querySelector(".details").innerText = "No item ID specified.";
  }
});

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;
  return `${'<ion-icon name="star"  ></ion-icon>'.repeat(fullStars)}
          ${'<ion-icon name="star-half" ></ion-icon>'.repeat(halfStars)}
          ${'<ion-icon name="star-outline" ></ion-icon>'.repeat(emptyStars)}`;
}

function generateSubTopics(subTopics) {
  return subTopics
    .map(
      (subTopic) => `
    <li class="details__sub-item">
      <ion-icon name="checkmark-circle-outline" style="color: green" class="details__checkmark"></ion-icon>
      <span>${subTopic}</span>
    </li>
  `
    )
    .join("");
}

function changeFavoriteButton(item, buttonText) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const isItemInFavorites = favorites.find(
    (favorite) => favorite.id === item.id
  );
  if (!isItemInFavorites) {
    // If item does not exist in favorites, add it
    favorites.push(item);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Item added to favorites!");
    buttonText.innerText = "Remove from Favorites";
  } else {
    // If item exists in favorites, remove it
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.id !== item.id
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    alert("Item removed from favorites!");
    buttonText.innerText = "Add to Favorites";
  }
}
