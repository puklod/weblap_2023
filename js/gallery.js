let currentImgNumber = 0;
let isMouseOver = false;
const gallery = {
    leftArrow: document.querySelector('#left-arrow'),
    rightArrow: document.querySelector('#right-arrow'),
    imgElement: document.querySelector('#container'),
    imgFilePath: "image/gallery/",
    imgExtension: ".webp",
    size: 5,
    delay: 5000,
};

addEventListeners(gallery.imgElement);
autoPlay();


function addEventListeners(imgElemnet) {
    gallery.imgElement.addEventListener('mouseover',() => {
        isMouseOver = true;
        gallery.leftArrow.style.opacity = "0.6";
        gallery.rightArrow.style.opacity = "0.6";
    });
    
    gallery.imgElement.addEventListener('mouseleave',() => {
        isMouseOver = false;
        gallery.leftArrow.style.opacity = "0";
        gallery.rightArrow.style.opacity = "0";
    });

    gallery.leftArrow.addEventListener('click', stepBackward);
    gallery.rightArrow.addEventListener('click', stepForward);

}

function autoPlay() {
    if(isMouseOver === false){
        stepForward();
    }

    setTimeout(() => {
        autoPlay();
    }, gallery.delay);

}

function stepForward() {
    setCurrentImgNumber(1);
    setBackgroundImage(currentImgNumber);
}

function stepBackward() {
    setCurrentImgNumber(-1);
    setBackgroundImage(currentImgNumber);
}

function setCurrentImgNumber(number) {
    if(currentImgNumber + number > gallery.size) {
        currentImgNumber = 1;
    } else if (currentImgNumber + number < 1) {
        currentImgNumber = gallery.size;
    } else {
        currentImgNumber += number;
    }
}

function setBackgroundImage(imgNumber) {
    gallery.imgElement.style.backgroundImage = "url(" + generateImgFilePath(imgNumber) + ")";
}

function generateImgFilePath(imgNumber) {
    return gallery.imgFilePath + "00" + imgNumber + gallery.imgExtension;
}