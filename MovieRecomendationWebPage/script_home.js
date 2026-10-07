const API_KEY = "";
const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

function renderMovies(movies) {
    const cardsArray = movies.map(movie => {
        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Poster";

        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

        return `
          <div class="card" data-id="${movie.id}">
            <img src="${posterUrl}" alt="${movie.title} poster">
            <div class="card-info">
              <h3>${movie.title}</h3>
              <span class="rating">⭐ ${rating}</span>
            </div>
          </div>
        `;
    });

    movieList.innerHTML = cardsArray.join("");

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            window.location.href = `details.html?id=${card.dataset.id}`;
        });
    });

}

async function loadPopularMovies() {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    const data = await response.json();
    renderMovies(data.results);
}

searchBtn.addEventListener("click", async () => {
    const query = searchInput.value;

    const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
    );
    const data = await response.json();

    renderMovies(data.results);
});

loadPopularMovies();