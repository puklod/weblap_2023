const navBar = document.querySelector('#navbar');
const navIcon = document.querySelector('#navicon');
const menuItems = ["Egy", "Kettő", "Három", "Négy"];

navIcon.addEventListener('click',() => navigationEvent(navBar));

function createNavigation() {
    const nav = document.createElement('nav');
        nav.setAttribute('id', 'nav');
    const ul = document.createElement('ul');
        ul.setAttribute('id',"navul");
        ul.setAttribute('class', 'container');
    
    for (const itemName of menuItems) {
        let li = document.createElement('li');
            li.innerHTML = itemName;
            li.setAttribute('id',itemName);
            li.setAttribute('class',"menuitem");
        ul.appendChild(li);
    }

    nav.appendChild(ul);

    return nav;
}

function navigationEvent(obj) {
    const nav = document.querySelector('#nav');
    
    if(nav == null){
        obj.appendChild(createNavigation());
    } else {
        obj.removeChild(nav);
    }
}