const navdiv = document.querySelector('#navbar');
const navicon = document.querySelector('#navicon');
const menuItems = ["Egy", "Kettő", "Három", "Négy"];

navicon.addEventListener('click',() => navigationEvent(navicon));

function createNavigation() {
    const ul = document.createElement('ul');
        ul.setAttribute('id',"navUl");
    
    for (const itemName of menuItems) {
        let li = document.createElement('li');
        li.setAttribute('id',itemName);
        ul.appendChild(li);
    }

    return ul;
}

function navigationEvent(obj) {
    if(obj.hasChildNodes('ul')){
        obj.removeChild(obj.childNodes[0]);
    } else {
        obj.appendChild(createNavigation());
    }
}