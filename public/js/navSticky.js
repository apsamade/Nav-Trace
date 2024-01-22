window.addEventListener('scroll', function () {
    let navbar = document.querySelector('nav');
    let viewportHeight = window.innerHeight * 0.8;;

    if (window.scrollY > viewportHeight) {
        navbar.classList.add('navbar-appear');
    } else {
        navbar.classList.remove('navbar-appear');
    }
});