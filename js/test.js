const navdiv = document.querySelector('#navbar');
const navicon = document.querySelector('#navicon');
const menuItems = ["Egy", "Kettő", "Három", "Négy"];

navicon.appendChild(createNavigation());

function createNavigation() {
    const ul = document.createElement('ul');
    for (const itemName of menuItems) {
        let li = document.createElement('li');
        li.setAttribute('id',itemName);
        ul.appendChild(li);
    }

    return ul;
}