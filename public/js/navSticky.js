window.addEventListener('scroll', function () {
    let navbar = document.querySelector('nav');
    let viewportHeight = window.innerHeight * 0.8;;

    if (window.scrollY > viewportHeight) {
        navbar.style.position = 'fixed';
        navbar.style.backgroundColor = '#001a77';
        navbar.style.boxShadow = '2px 0 4px 0 rgba(0, 0, 0, 0.4)'
        navbar.classList.add('navbar-appear');
    } else {
        navbar.style.position = 'absolute';
        navbar.style.boxShadow = '2px 0 4px 0 rgba(0, 0, 0, 0)'
        navbar.classList.remove('navbar-appear');
    }
});