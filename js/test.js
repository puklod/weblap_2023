const navdiv = document.querySelector('#navbar');
const navicon = document.querySelector('#navicon');
const menuItems = ["Egy", "Kettő", "Három"];

displayNavicon();

function displayNavicon() {
    let windowWidth = window.innerWidth;

    if(windowWidth < 550) navicon.style.display = 'none';
};