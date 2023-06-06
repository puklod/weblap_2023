const navigation = {
    navBar: document.querySelector('#navbar'),
    navIcon: document.querySelector('#navicon'),
    navigationDiv: document.querySelector('#navigation'),
    menuNav: document.querySelector('#menu'),
    menuItems: ["About us", "Prices", "Vehicle", "For offers"],
}

window.addEventListener('resize',createNavigation);
createNavigation(navigation.menuNav);

function createNavigation(menuNav) {
        
    if(window.innerWidth >= 750 && !navigation.navigationDiv.classList.contains("big-navigation")){
        cleanBeforeCreation();
        createBigNavigation();
    } else if (window.innerWidth <= 749 && !navigation.navigationDiv.classList.contains("small-navigation")){
        cleanBeforeCreation();
        createSmallNavigation();
    }   
    
}

function cleanBeforeCreation() {
    if(navigation.navBar.hasAttribute('class')){
        navigation.navBar.removeAttribute('class');
    }

    if(navigation.navigationDiv.hasAttribute('class')){
        navigation.navigationDiv.removeAttribute('class');
    }

    if(navigation.menuNav.hasAttribute('class')){
        navigation.menuNav.removeAttribute('class');
    }

    if(navigation.navIcon.hasAttribute('class')){
        navigation.navIcon.removeAttribute('class');
    }

    if(navigation.menuNav.childNodes.length > 0){
        navigation.menuNav.removeChild(navigation.menuNav.firstChild);
    }

    navigation.navIcon.style.display = "none";
}

function createBigNavigation() {

    
    navigation.navBar.classList.add("big");
    navigation.navigationDiv.classList.add("big-navigation");

    navigation.menuNav.append(createMenu());


}

function createSmallNavigation() {
   navigation.navBar.classList.add("small");
    navigation.navigationDiv.classList.add("small-navigation");
    navigation.menuNav.append(createMenu());
    navigation.navIcon.style.removeProperty('display');
    navigation.navIcon.addEventListener('click',menuAndliClassManipulation);
    menuAndliClassManipulation();
}

function createMenu() {
    const ul = document.createElement('ul');
    
    for (const itemName of navigation.menuItems) {
        let href = "#" + itemName.toLocaleLowerCase().replace(" ","-");

        let bookMarkHref = document.createElement('a');
            bookMarkHref.setAttribute('href',href);
            bookMarkHref.innerHTML = itemName;
            bookMarkHref.addEventListener('click',menuAndliClassManipulation);
        let li = document.createElement('li');
            li.append(bookMarkHref);
        ul.append(li);
    }

    return ul;
}

function menuAndliClassManipulation() {
    const liList = document.querySelectorAll('li');

    for (const li of liList) {
       openedClosedClassSwitch(li);
    }

    openedClosedClassSwitch(navigation.menuNav);
    openedClosedClassSwitch(navigation.navIcon)
}

function openedClosedClassSwitch(object) {
    if (object.classList.contains("opened")) {
        object.classList.remove("opened");
        object.classList.add("closed");
    } else if(object.classList.contains("closed")){
        object.classList.remove("closed");
        object.classList.add("opened");
    } else {
        object.classList.add("closed");
    }
}