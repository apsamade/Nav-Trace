let monBurger = document.querySelector('.burger')
let maAside = document.querySelector('aside')
const mod = document.querySelector('.mod')
const modA = document.querySelector('.modA')



monBurger.addEventListener('click', () => {
    console.log('ok')
    if (monBurger.classList.contains('croix')) {
        monBurger.classList.remove('croix')
        monBurger.classList.add('visible')

        maAside.style.left = '-301px';

    } else {
        monBurger.classList.add('croix')
        monBurger.classList.remove('visible')

        maAside.style.left = '0';

    }
})

if (modA) {
    modA.addEventListener('click', () => {

        if (mod.classList.contains('modVisible')) {
            mod.classList.remove('modVisible')
        } else {
            mod.classList.add('modVisible')
            if (mod.classList.contains('modVisible')) {
                mod.classList.remove('modVisible')
            }
        }
    })
}


