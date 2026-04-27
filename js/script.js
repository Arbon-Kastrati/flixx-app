const global = {
    currentPage: window.location.pathname,
    searchQuery: window.location.search,
};
const popularMoviesContainer = document.getElementById('popular-movies');
const popularShowsContainer = document.getElementById('popular-shows');
const popularMovieDetailsContainer = document.getElementById('movie-details');
const popularShowDetailsContainer = document.getElementById('show-details');
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

async function displayMovieDetails() {
    const movieID = global.searchQuery.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieID}`);

    popularMovieDetailsContainer.innerHTML = `
        <div class="details-top">
          <div>${
              movie.poster_path
                  ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.original_name}"/>`
                  : '<img src="images/no-image.jpg" class="card-img-top" alt="Show Title" />'
          }
            
          </div>
          <div>
            <h2>${movie.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
            $${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${movie.genres
                    .map((genre) => {
                        return `<li>${genre.name}</li>`;
                    })
                    .join('')}
            </ul>
            <a href="/"  class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${movie.budget}</li>
            <li><span class="text-secondary">Revenue:</span> $${movie.revenue} </li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies
              .map((company) => {
                  return company.name;
              })
              .join(', ')}
              </div>
        </div>
    `;
    displayBackgroundImage('movie', movie.backdrop_path);
}

async function displayShowDetails() {
    const showID = window.location.search.split('=')[1];
    const show = await fetchAPIData(`tv/${showID}`);

    popularShowDetailsContainer.innerHTML = `
        <div class="details-top">
                    <div>
                    ${
                        show.backdrop_path
                            ? `<img src="https://image.tmdb.org/t/p/w500/${show.backdrop_path}" class="card-img-top" alt="Show Name" />`
                            : '<img src="images/no-image.jpg" class="card-img-top" alt="Show Name" />'
                    }
                    </div>
                    <div>
                        <h2>${show.original_name}</h2>
                        <p>
                            <i class="fas fa-star text-primary"></i>
                            ${show.vote_average.toFixed(1)} / 10
                        </p>
                        <p class="text-muted">Release Date: ${show.first_air_date}</p>
                        <p>
                        ${show.overview}
                        </p>
                        <h5>Genres</h5>
                        <ul class="list-group">
                            ${show.genres
                                .map((genre) => {
                                    return `<li>${genre.name}</li>`;
                                })
                                .join('')}
                        </ul>
                        <a href="shows.html" class="btn">Visit Show Homepage</a>
                    </div>
                </div>
                <div class="details-bottom">
                    <h2>Show Info</h2>
                    <ul>
                        <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
                        <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.episode_number}</li>
                        <li><span class="text-secondary">Status:</span> ${show.status}</li>
                    </ul>
                    <h4>Production Companies</h4>
                    <div class="list-group">${show.production_companies
                        .map((company) => {
                            return company.name;
                        })
                        .join(', ')}</div>
                </div>
    `;
    displayBackgroundImage('show', show.backdrop_path);
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

function displayBackgroundImage(backgroundFor, backgroundPath) {
    const overlyDiv = document.createElement('div');

    overlyDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlyDiv.style.backgroundPosition = 'center';
    overlyDiv.style.backgroundRepeat = 'no-repeat';
    overlyDiv.style.height = '100vh';
    overlyDiv.style.width = '100vw';
    overlyDiv.style.position = 'absolute';
    overlyDiv.style.top = '0';
    overlyDiv.style.left = '0';
    overlyDiv.style.position = 'absolute';
    overlyDiv.style.zIndex = '-1';
    overlyDiv.style.opacity = '0.1';
    console.log(overlyDiv);
    if (backgroundFor === 'movie') {
        console.log('backgroundFor is movie');
        popularMovieDetailsContainer.appendChild(overlyDiv);
        console.log(popularMovieDetailsContainer);
    } else if (backgroundFor === 'show') {
        popularShowDetailsContainer.appendChild(overlyDiv);
    }
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
            displayMovieDetails();
            break;
        case '/tv-details.html':
            console.log('tv details');
            displayShowDetails();
            break;
        case '/search.html':
            console.log('search');
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
