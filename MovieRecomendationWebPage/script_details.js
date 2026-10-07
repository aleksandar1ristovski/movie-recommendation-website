const API_KEY = "";
const detailsContainer = document.getElementById("movie-details");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function loadMovieDetails() {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    const movie = await response.json();

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
        : "https://via.placeholder.com/400x600?text=No+Poster";

    detailsContainer.innerHTML = `
        <div class="details-card">
            <img src="${posterUrl}" alt="${movie.title} poster">
            <div class="details-info">
                <h1>${movie.title}</h1>
                <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
                <p class="overview">${movie.overview}</p>
                <div class="actions">
                    <button id="watchlist-btn">+ Add to Watchlist</button>
                    <button id="watched-btn">✓ Mark as Watched</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("watchlist-btn").addEventListener("click", () => {
        addToList("watchlist", movie);
    });

    document.getElementById("watched-btn").addEventListener("click", () => {
        addToList("watched", movie);
    });
}

function addToList(listName, movie) {
    const list = JSON.parse(localStorage.getItem(listName)) || [];

    const alreadyAdded = list.some(m => m.id === movie.id);
    if (alreadyAdded) {
        alert(`${movie.title} is already in your ${listName}.`);
        return;
    }

    list.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        genre_ids: movie.genres ? movie.genres.map(g => g.id) : []
    });

    localStorage.setItem(listName, JSON.stringify(list));
    alert(`${movie.title} added to ${listName}!`);
}

loadMovieDetails();