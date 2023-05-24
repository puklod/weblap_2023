let currentImgNumber = 0;
let isMouseOver = false;
const galery = {
    leftArrow: document.querySelector('#left-arrow'),
    rightArrow: document.querySelector('#right-arrow'),
    imgElement: document.querySelector('#container'),
    imgFilePath: "image/galery/",
    imgExtension: ".jpg",
    size: 4,
    delay: 5000,
};

addEventListeners(galery.imgElement);
autoPlay();


function addEventListeners(imgElemnet) {
    galery.imgElement.addEventListener('mouseover',() => {
        isMouseOver = true;
        galery.leftArrow.style.opacity = "0.6";
        galery.rightArrow.style.opacity = "0.6";
    });
    
    galery.imgElement.addEventListener('mouseleave',() => {
        isMouseOver = false;
        galery.leftArrow.style.opacity = "0";
        galery.rightArrow.style.opacity = "0";
    });

    galery.leftArrow.addEventListener('click', stepBackward);
    galery.rightArrow.addEventListener('click', stepForward);

}

function autoPlay() {
    if(isMouseOver === false){
        stepForward();
    }

    setTimeout(() => {
        autoPlay();
    }, galery.delay);

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
    if(currentImgNumber + number > galery.size) {
        currentImgNumber = 1;
    } else if (currentImgNumber + number < 1) {
        currentImgNumber = galery.size;
    } else {
        currentImgNumber += number;
    }
}

function setBackgroundImage(imgNumber) {
    galery.imgElement.style.backgroundImage = "url(" + generateImgFilePath(imgNumber) + ")";
}

function generateImgFilePath(imgNumber) {
    return galery.imgFilePath + "00" + imgNumber + galery.imgExtension;
}