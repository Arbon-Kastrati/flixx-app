const global = {
    currentPage: window.location.pathname,
};
const popularMoviesContainer = document.getElementById('popular-movies');
const popularShowsContainer = document.getElementById('popular-shows');
const API_URL = 'https://api.themoviedb.org/3';

async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${
                    movie.poster_path
                        ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}"/>`
                        : '<img src="images/no-image.jpg" class="card-img-top" alt="Movie Title"/>'
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>`;
        popularMoviesContainer.appendChild(div);
    });
}

async function displayPopularShows() {
    const { results } = await fetchAPIData('tv/popular');
    results.forEach((show) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
            ${
                show.poster_path
                    ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" class="card-img-top" alt="${show.original_name}"/>`
                    : '<img src="images/no-image.jpg" class="card-img-top" alt="Show Title" />'
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.original_name}</h5>
            <p class="card-text">
              <small class="text-muted">Air date: ${show.first_air_date}</small>
            </p>
          </div>
        `;
        popularShowsContainer.appendChild(div);
    });
}

async function fetchAPIData(endpoint) {
    const API_KEY = '17814947e35171f5f39bfd2456c4fedb';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}

function showSpinner() {
    document.querySelector('div.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('div.spinner').classList.remove('show');
}

//highlight the active link
const highlightActiveLink = () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    });
};

function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            console.log('movie details');
            break;
        case '/tv-details.html':
            console.log('tv details');
            break;
        case '/search.html':
            console.log('search');
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
