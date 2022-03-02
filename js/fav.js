let favouritesList = fetchFavourites();
const myFavouritesList = document.getElementById("my-favourites-list");

window.onload = () => {
  addFavouritesToList();
};

//getting data from API
function fetchData(movie) {
  const url = `https://www.omdbapi.com/?apikey=6d404629&t=${movie}`;

//sending response in JSON format
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return updateResult(data);
    });
}

// Uploading Deatils Of Movie
function updateResult(data) {
  const favouriteItem = document.createElement("li");
  favouriteItem.innerHTML = `
    <img src="${data.Poster}" alt="movie-poster">
    <div class="details-container">
    <h2>${data.Title}</h2>
    <div class="details-parent">
      <div class="details-child">
        <div class="info-section">
          <div class="runtime">
            <span><i class="far fa-hourglass"></i></span>
            <span>${data.Runtime}</span>
          </div>
          <div class="parental-rating">
            <span><i class="far fa-eye"></i></span>
            <span>${data.Rated}</span>
          </div>
        </div>

        <div class="rating-section">
          <div class="imdb-rating">
            <span>imdb</span>
            <span>${data.imdbRating}</span>
          </div>
          <div class="metascore-rating">
            <span>Meta Score</span>
            <span>${data.Metascore}</span>
          </div>
        </div>
      </div>
      <div class="details-child button-group">
        <button class="movie-like-button favourite">Remove from Favourites</button>
        <button class="view-details-button">View More</button>
      </div>
    </div>
  </div>
  `;
  myFavouritesList.appendChild(favouriteItem);

  //event listener for movie-like button
  const movieLikeButton = favouriteItem.querySelector(".movie-like-button");
  movieLikeButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleFavourites(favouriteItem);
  });

  //event listener to view-details button
  const viewDetailsButton = favouriteItem.querySelector(".view-details-button");
  viewDetailsButton.addEventListener("click", function () {
    showMovieDetails(data.Title);
  });
}

//redirecting to movie-details page
function showMovieDetails(title) {
  const url = `movieDetails.html?title=${title}`;
  window.open(url, "_blank");
}

//add or remove a movie from favourites
function toggleFavourites(movieItem) {
  const movieLikeButton = movieItem.querySelector("button");
  const movieTitle = movieItem.querySelector("h2").innerHTML;

  const favourite = movieItem.querySelector(".favourite");

  //if present, remove from favourites
  if (favourite) {
    movieLikeButton.classList.remove("favourite");
    movieLikeButton.innerText = "Add to Favourites";
    removeFromFavourites(movieTitle);
  } else {
    //else, add
    movieLikeButton.classList.add("favourite");
    movieLikeButton.innerText = "Remove from Favourites";
    addToFavourites(movieTitle);
  }
}

//adding to favourites
function addToFavourites(movieTitle) {
  favouritesList.push(movieTitle);
  console.log("favourites-------->", favouritesList);
  updateFavourites();
}

//removing from favourites
function removeFromFavourites(movieTitle) {
  favouritesList = favouritesList.filter((movie) => movie !== movieTitle);
  console.log("unfavourites-------->", favouritesList);
  updateFavourites();
}

//adding favourites list 
function updateFavourites() {
  localStorage.setItem("favouritesList", favouritesList);
}

function addFavouritesToList() {
  favouritesList.map((movie) => {
    fetchData(movie);
  });
}

//fetching the favourites list
function fetchFavourites() {
  let favourites = localStorage.getItem("favouritesList");
  if (favourites) {
    favourites = favourites.split(",");
  } else {
    favourites = [];
  }
  return favourites;
}
