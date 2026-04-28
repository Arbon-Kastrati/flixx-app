const global = {
    currentPage: window.location.pathname,
    searchQuery: window.location.search,
    api: {
        key: '17814947e35171f5f39bfd2456c4fedb',
        url: 'https://api.themoviedb.org/3/',
    },
    search: {
        query: '',
        page: 1,
        type: '',
        totalPages: 1,
        results: [],
        totalResults: 0,
    },
};

const popularMoviesContainer = document.getElementById('popular-movies');
const popularShowsContainer = document.getElementById('popular-shows');
const popularMovieDetailsContainer = document.getElementById('movie-details');
const popularShowDetailsContainer = document.getElementById('show-details');
const searchResultsContainer = document.getElementById('search-results');

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
            ${movie.vote_average.toFixed(1)} / 10
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
                        show.poster_path
                            ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" class="card-img-top" alt="${show.original_name}" />`
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

async function search() {
    const searchParams = new URLSearchParams(global.searchQuery);
    global.search.query = searchParams.get('search-term');
    global.search.type = searchParams.get('type');
    if (global.search.query !== '') {
        const { page, results, total_pages, total_results } = await fetchAPIDataWithQuery();
        global.search.page = page;
        global.search.results = results;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;
        if (global.search.results.length === 0) {
            showAlert('No results were found');
        } else {
            displaySearchResults();
        }
    } else {
        showAlert('Fill the search keyword');
    }
}

async function prevSearch() {
    global.search.page--;
    ({ results: global.search.results } = await fetchAPIDataWithQuery());
    displaySearchResults();
}

async function nextSearch() {
    global.search.page++;
    ({ results: global.search.results } = await fetchAPIDataWithQuery());
    displaySearchResults();
}

async function displaySearchResults() {
    displayHeadingForSearchResults();
    searchResultsContainer.innerHTML = '';
    global.search.results.forEach((result) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
                <a href="${global.search.type}-details.html?id=${result.id}">
                    ${
                        result.poster_path
                            ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" class="card-img-top" alt="${global.search.type === 'movie' ? result.title : result.original_name}" />`
                            : '<img src="images/no-image.jpg" class="card-img-top" alt="Show/Movie Name" />'
                    }
                </a>
                <div class="card-body">
                    <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.original_name}</h5>
                    <p class="card-text">
                        <small class="text-muted">Release: ${global.search.type === 'movie' ? (result.release_date ? result.release_date : 'N/A') : result.first_air_date ? result.first_air_date : 'N/A'}</small>
                    </p>
                </div>
        `;
        searchResultsContainer.appendChild(div);
    });
    displayPagination();
}

function displayHeadingForSearchResults() {
    const heading = document.getElementById('search-results-heading');
    heading.textContent = `${global.search.results.length + (global.search.page - 1) * 20} results out of ${global.search.totalResults}`;
}

function displayPagination() {
    const paginationContainer = document.querySelector('#pagination .pagination');
    paginationContainer.innerHTML = '';
    paginationContainer.innerHTML = `
                    <button class="btn btn-primary" id="prev" ${global.search.page === 1 ? 'disabled' : ''}>Prev</button>
                    <button class="btn btn-primary" id="next" ${global.search.page === global.search.totalPages ? 'disabled' : ''}>Next</button>
                    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
                    `;
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    prevBtn.addEventListener('click', prevSearch);
    nextBtn.addEventListener('click', nextSearch);
}

async function fetchAPIData(endpoint) {
    showSpinner();
    const response = await fetch(
        `${global.api.url}${endpoint}?api_key=${global.api.key}&language=en-US`,
    );
    const data = await response.json();
    hideSpinner();
    return data;
}

async function fetchAPIDataWithQuery() {
    showSpinner();
    const response = await fetch(
        `${global.api.url}search/${global.search.type}?query=${global.search.query}&page=${global.search.page}&api_key=${global.api.key}&language=en-US`,
    );
    const data = await response.json();
    hideSpinner();
    return data;
}

function showAlert(message, className = 'error') {
    const div = document.createElement('div');
    div.classList.add(className);
    const text = document.createTextNode(message);
    div.appendChild(text);
    document.getElementById('alert').appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function showSpinner() {
    document.querySelector('div.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('div.spinner').classList.remove('show');
}

async function displaySlider() {
    const { results } = await fetchAPIData('movie/now_playing');
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
            ${`<img src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}" class="card-img-top" alt="${movie.original_name}" />`}
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i>${movie.vote_average.toFixed(1)} / 10
            </h4>
        `;
        document.querySelector('div.swiper-wrapper').appendChild(div);
    });
    initSwiper();
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });
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
        popularMovieDetailsContainer.appendChild(overlyDiv);
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
            displaySlider();
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
