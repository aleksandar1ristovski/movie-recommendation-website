const GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

function renderList(listName, containerId) {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const container = document.getElementById(containerId);

    if (list.length === 0) {
        container.innerHTML = `<p>Nothing here yet.</p>`;
        return;
    }

    const cardsArray = list.map(movie => {
        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Poster";

        return `
          <div class="card" data-id="${movie.id}">
            <img src="${posterUrl}" alt="${movie.title} poster">
            <h3>${movie.title}</h3>
            <button class="remove-btn" data-id="${movie.id}">Remove</button>
          </div>
        `;
    });

    container.innerHTML = cardsArray.join("");

    container.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            window.location.href = `details.html?id=${card.dataset.id}`;
        });
    });

    container.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            removeFromList(listName, btn.dataset.id, containerId);
        });
    });
}

function removeFromList(listName, movieId, containerId) {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const updatedList = list.filter(movie => movie.id !== Number(movieId));
    localStorage.setItem(listName, JSON.stringify(updatedList));
    renderList(listName, containerId);
    renderStats();
}

function renderStats() {
    const watched = JSON.parse(localStorage.getItem("watched")) || [];
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    document.getElementById("stat-total").textContent = watched.length;
    document.getElementById("stat-watchlist").textContent = watchlist.length;

    document.getElementById("stat-genre").textContent = getFavoriteGenre(watched);

    updateLevelBar(watched.length);
}

function getFavoriteGenre(watched) {
    if (watched.length === 0) return "—";

    const genreCounts = {};

    watched.forEach(movie => {
        (movie.genre_ids || []).forEach(id => {
            genreCounts[id] = (genreCounts[id] || 0) + 1;
        });
    });

    const genreIds = Object.keys(genreCounts);
    if (genreIds.length === 0) return "—";

    let topGenreId = genreIds[0];
    genreIds.forEach(id => {
        if (genreCounts[id] > genreCounts[topGenreId]) {
            topGenreId = id;
        }
    });

    return GENRE_MAP[topGenreId] || "Unknown";
}

function updateLevelBar(watchedCount) {
    const moviesPerLevel = 5;
    const level = Math.floor(watchedCount / moviesPerLevel) + 1;
    const progressInLevel = watchedCount % moviesPerLevel;
    const percent = (progressInLevel / moviesPerLevel) * 100;

    document.getElementById("level-bar-fill").style.width = `${percent}%`;
    document.getElementById("level-label").textContent = `Level ${level}`;
}

renderList("watchlist", "watchlist-container");
renderList("watched", "watched-container");
renderStats();