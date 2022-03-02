const search = document.getElementById("input");
let movieSearch;
const searchList = document.getElementById("list");
let favouritesList = fetchFavourites();

//handling event listener
window.onload = () => {
  enableSearch();
};

//fetching favourite list
function fetchFavourites() {
  const favourites = fetchFavourites();
  console.log("favourites: ", favourites);
  return favourites;
}

//fetching favourites
function fetchFavourites() {
  let favourites = localStorage.getItem("favouritesList");
  if (favourites) {
    favourites = favourites.split(",");
  } else {
    favourites = [];
  }
  return favourites;
}

//adding favourites list to localStorage
function updateFavourites() {
  localStorage.setItem("favouritesList", favouritesList);
}

//getting data from api
function fetchData(name) {
  const url = `https://www.omdbapi.com/?apikey=6d404629&s=${name}`;

  fetch(url)//sending response
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let movies = [];
      if (data.Response === "True") {
        movies = data.Search.map((movie) => movie);
      }
      updateResult(movies);
    });
}

//adding data to DOM
function updateResult(movies) {
  searchList.innerHTML = "";
  movies.forEach((movie) => {
    const movieItem = document.createElement("li");
    const movieTitle = document.createElement("h2");
    const moviePoster = document.createElement("img");
    const movieYear = document.createElement("p");
    const buttonGroup = document.createElement("div");
    const movieLikeButton = document.createElement("button");
    const movieDetailsButton = document.createElement("button");

    //checking if the movie is already favourited
    const isFavourite = checkIfFavourite(movie.Title);

    //adding class favourite to button
    if (isFavourite) {
      movieLikeButton.classList.add("favourite");
      movieLikeButton.innerText = "Remove From Favourites List";
    } else {
      movieLikeButton.innerText = "Add To Favourites List";
    }

    movieDetailsButton.innerHTML = "View Details Of Movie";

    movieTitle.innerHTML = movie.Title;
    movieYear.innerHTML = movie.Year;
    moviePoster.src = movie.Poster;
    moviePoster.alt = "movie-poster";

    //adding event listener movieLikeButton
    movieLikeButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("toggling favourites");
      toggleFavourites(movieItem);
    });

    //adding event listener movieDetailsButton
    movieDetailsButton.addEventListener("click", function () {
      showMovieDetails(movie.Title);
    });

    movieItem.appendChild(movieTitle);
    movieItem.appendChild(movieYear);
    movieItem.appendChild(moviePoster);
    movieItem.appendChild(buttonGroup);

    buttonGroup.classList.add("button-group");
    buttonGroup.appendChild(movieLikeButton);
    buttonGroup.appendChild(movieDetailsButton);

    searchList.appendChild(movieItem);
  });
}

function showMovieDetails(title) {
  const url = `movieDetails.html?title=${title}`;
  window.open(url, "_blank");
}

//get name of movie searched
function enableSearch() {
  search.onkeyup = (e) => {
    clearTimeout(movieSearch);
    movieSearch = setTimeout(() => {
      fetchData(e.target.value);
    }, 250);
  };
}

//add/remove a movie from favourites
function toggleFavourites(movieItem) {
  const movieLikeButton = movieItem.querySelector("button");
  const movieTitle = movieItem.querySelector("h2").innerHTML;
  console.log("movie like button", movieItem);

  const favourite = movieItem.querySelector(".favourite");

  //removing from fav if present
  if (favourite) {
    movieLikeButton.classList.remove("favourite");
    movieLikeButton.innerText = "Add to Favourites";
    removeFromFavourites(movieTitle);
  } else {
    //if not add to the list
    movieLikeButton.classList.add("favourite");
    movieLikeButton.innerText = "Remove from Favourites";
    addToFavourites(movieTitle);
  }
}

//adding to favourites
function addToFavourites(movieTitle) {
  favouritesList.push(movieTitle);
  console.log("favourites", favouritesList);
  updateFavourites();
}

//removing from favourites
function removeFromFavourites(movieTitle) {
  favouritesList = favouritesList.filter((movie) => movie !== movieTitle);
  console.log("unfavourites", favouritesList);
  updateFavourites();
}

function checkIfFavourite(movie) {
  const index = favouritesList.indexOf(movie);
  if (index != -1) {
    return true;
  }
  return false;
}
