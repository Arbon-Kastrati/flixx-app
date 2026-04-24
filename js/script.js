const global = {
    currentPage: window.location.pathname,
};

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
            highlightActiveLink('movies');
            break;
        case '/shows.html':
            highlightActiveLink('shows');

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
// document.querySelector('nav ul').addEventListener('click', highlightActiveLink);
