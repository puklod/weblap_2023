const dataBase = {
    addressArray: [],
    locationLongitudeArray: [],
    locationLatitudeArray: [],
}

const inputFields = {
    inputOne: document.querySelector('#inputone'),
    suggestionAreaInputOne: document.querySelector('#suggestionareainputone'),
    inputTwo: document.querySelector('#inputtwo'),
    suggestionAreaInputTwo: document.querySelector('#suggestionareainputtwo'),
    calcuationButton: document.querySelector('#calculationbutton'),
    euroPriceField: document.querySelector('#europricefield'),
    hufPriceField: document.querySelector("#hufpricefield")
}

const inputFieldsData = {
    inputOneName: "inputOne",
    inputOneSuggestionAreaName: "suggestionAreaInputOne",
    inputOneAddress: null,
    inputOneLongitude: null,
    inputOneLatitude: null,
    inputTwoName: "inputTwo",
    inputTwoSuggestionAreaName: "suggestionAreaInputTwo",
    inputTwoAddress: null,
    inputTwoLongitude: null,
    inputTwoLatitude: null,
}

inputFields.inputOne.addEventListener('input', () => inputEventListener(inputFieldsData.inputOneName, inputFieldsData.inputOneSuggestionAreaName));
inputFields.inputTwo.addEventListener('input', () => inputEventListener(inputFieldsData.inputTwoName, inputFieldsData.inputTwoSuggestionAreaName));
inputFields.inputOne.addEventListener('click', () => inputEventListener(inputFieldsData.inputOneName, inputFieldsData.inputOneSuggestionAreaName));
inputFields.inputTwo.addEventListener('click', () => inputEventListener(inputFieldsData.inputTwoName, inputFieldsData.inputTwoSuggestionAreaName));
this.addEventListener('click', () => removeSuggestionField(inputFieldsData.inputOneSuggestionAreaName));
inputFields.calcuationButton.addEventListener('click',manipulatePriceFields);


async function inputEventListener(inputName, suggestionAreaName) {
    await buildDatabase(inputName);
    await setInputFieldsData(inputName);
    await setSuggestionField(inputName, suggestionAreaName);
}

async function buildDatabase(inputName) {
    clearDatabase();
    const userInput = inputFields[inputName].value;
    const json = await fetchGeocode(userInput);
    const rawData = json.candidates;
    let currentArrayId = 0;

    for(let data of rawData){
        dataBase.addressArray[currentArrayId] = data.address;
        dataBase.locationLongitudeArray[currentArrayId] = data.location.x;
        dataBase.locationLatitudeArray[currentArrayId] = data.location.y;
        currentArrayId++;
    }
}

async function clearDatabase() {
    dataBase.addressArray = [];
    dataBase.locationLongitudeArray = [];
    dataBase.locationLatitudeArray = [];
}

async function fetchGeocode(userInput) {
    const firstPart = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?token=&SingleLine="
    const secondPart = "&outFields=Addr_Type&forStorage=false&maxLocations=10&f=json"
    const response = await fetch(firstPart + userInput + secondPart);
    const json = await response.json();
    return json;
}

async function setInputFieldsData(inputName) {
    await clearInputFieldsData(inputName);

    for(let i = 0; i < dataBase.addressArray.length; i++) {
        if(inputFields[inputName].value === dataBase.addressArray[i] ){
            inputFieldsData[inputName + "Address"] = dataBase.addressArray[i];
            inputFieldsData[inputName + "Longitude"] = dataBase.locationLongitudeArray[i];
            inputFieldsData[inputName + "Latitude"] = dataBase.locationLatitudeArray[i];
            break;
        }
    }
}

async function clearInputFieldsData(inputName) {
    inputFieldsData[inputName + "Address"] = null;
    inputFieldsData[inputName + "Longitude"] = null;
    inputFieldsData[inputName + "Latitude"] = null;
}

async function setSuggestionField(inputName, suggestionAreaName) {
    await removeSuggestionField(suggestionAreaName);
    await createSuggestionField(inputName, suggestionAreaName);
}

async function createSuggestionField(inputName, suggestionAreaName) {
    const suggestions = document.createElement('div');
    for(let address of dataBase.addressArray){
        if(inputFields[inputName].value === address) {
            removeSuggestionField(suggestionAreaName);
            break;
        }
        let p = document.createElement('p');
            p.innerHTML = address;
            p.addEventListener('click', () => {
                clickEvent(address,inputName,suggestionAreaName)
            })
            suggestions.appendChild(p);
    }

    inputFields[suggestionAreaName].appendChild(suggestions);
}

async function clickEvent(inputFieldsValue,inputName,suggestionAreaName) {
    inputFields[inputName].value = inputFieldsValue;
    await setInputFieldsData(inputName);
    removeSuggestionField(suggestionAreaName);
}

async function removeSuggestionField(suggestionAreaName) {
    if(inputFields[suggestionAreaName].firstChild !== null){
        inputFields[suggestionAreaName].removeChild(inputFields[suggestionAreaName].firstChild);
    }
}

async function getDistanceInKilometers() {
    if(inputFieldsData.inputOneAddress !== null && inputFieldsData.inputTwoAddress !== null){
        const json = await fetchDistance();
        const distance = json.routes[0].summary.lengthInMeters / 1000;

        return distance;
    }
}

async function fetchDistance() {
    const url = "https://api.tomtom.com/routing/1/calculateRoute/"
    const coordinates = inputFieldsData.inputOneLatitude + "," +
                        inputFieldsData.inputOneLongitude + ":" +
                        inputFieldsData.inputTwoLatitude + "," +
                        inputFieldsData.inputTwoLongitude
    const parameters = "/json?maxAlternatives=1&" +
                       "computeBestOrder=false&" +
                       "computeTravelTimeFor=none&" +
                       "routeType=eco&" +
                       "traffic=false&" +
                       "travelMode=car&";
    const key = "key=ApSLUa4m4Ck8MkKRqdNk2obTniRtHxne"  
    const response = await fetch(url + coordinates + parameters + key);
    const json = await response.json();
    return json;
}

async function getEuroToHufExchangeRatio() {
    const json = await fetchEuroExchangeRatio();
    const exchangeRatio = await json.huf.rate;

    return exchangeRatio;
}

async function fetchEuroExchangeRatio() {
    const response = await fetch("http://www.floatrates.com/daily/eur.json");
    const json = await response.json();
    const exchangeRatio = await json.huf.rate;
    return exchangeRatio;
}

async function manipulatePriceFields() {
    const euro = 5000;
    inputFields.euroPriceField.innerHTML = (euro * await fetchEuroExchangeRatio()).toFixed() + " €";
}