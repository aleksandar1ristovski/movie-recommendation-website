const API_KEY = "";
const suggestCard = document.getElementById("suggest-card");

let movieQueue = [];
let currentIndex = 0;

async function loadSuggestions() {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    const data = await response.json();

    const watched = JSON.parse(localStorage.getItem("watched")) || [];
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const seenIds = [...watched, ...watchlist].map(m => m.id);

    movieQueue = data.results.filter(movie => !seenIds.includes(movie.id));
    currentIndex = 0;

    showCurrentMovie();
}

function showCurrentMovie() {
    if (currentIndex >= movieQueue.length) {
        suggestCard.innerHTML = `<p class="empty-msg">No more suggestions right now.</p>`;
        return;
    }

    const movie = movieQueue[currentIndex];

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
        : "https://via.placeholder.com/400x600?text=No+Poster";

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    suggestCard.innerHTML = `
        <img src="${posterUrl}" alt="${movie.title} poster">
        <div class="suggest-info">
            <h2>${movie.title}</h2>
            <p class="rating">⭐ ${rating}</p>
            <p class="overview">${movie.overview}</p>
        </div>
    `;
}

function nextMovie() {
    currentIndex++;
    showCurrentMovie();
}

function saveCurrentMovie(listName) {
    const movie = movieQueue[currentIndex];
    if (!movie) return;

    const list = JSON.parse(localStorage.getItem(listName)) || [];

    const alreadyAdded = list.some(m => m.id === movie.id);
    if (!alreadyAdded) {
        list.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            genre_ids: movie.genre_ids || []
        });
        localStorage.setItem(listName, JSON.stringify(list));
    }

    nextMovie();
}

document.getElementById("skip-btn").addEventListener("click", nextMovie);

document.getElementById("watchlist-btn").addEventListener("click", () => {
    saveCurrentMovie("watchlist");
});

document.getElementById("watched-btn").addEventListener("click", () => {
    saveCurrentMovie("watched");
});

loadSuggestions();