const slides = document.getElementById('slides');
const totalSlides = slides.children.length;
let currentPage = 0;
function checkScreenWidth() {
    const width = window.innerWidth;

    if (width <= 600) {
        return 1;
    }
    else {
        return 3;
    }
}
const slidesToShow = checkScreenWidth();
const totalPages = Math.ceil(totalSlides / slidesToShow);
function updatePager() {
    document.getElementById('pager').innerText = `Страница ${currentPage + 1} из ${totalPages}`;
}

function moveSlide(direction) {
    currentPage += direction;
    if (currentPage < 0) {
        currentPage = totalPages - 1;
    } else if (currentPage >= totalPages) {
        currentPage = 0;
    }
    const offset = -currentPage * (100);
    slides.style.transform = `translateX(${offset}%)`;

    updatePager();
}
