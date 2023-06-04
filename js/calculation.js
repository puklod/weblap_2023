const dataBase = {
    countryArray: [],
    cityArray: [],
    addressArray: [],
    locationLongitudeArray: [],
    locationLatitudeArray: [],
    euroToHufExchangeRate: null,
}

const inputFields = {
    inputOne: document.querySelector('#input-one'),
    suggestionAreaInputOne: document.querySelector('#suggestion-area-input-one'),
    inputTwo: document.querySelector('#input-two'),
    suggestionAreaInputTwo: document.querySelector('#suggestion-area-input-two'),
    calcuationButton: document.querySelector('#calculation-button'),
    euroPriceField: document.querySelector('#euro-price'),
    hufPriceField: document.querySelector('#huf-price')
}

const inputFieldsData = {
    inputOne: {
        name: "inputOne",
        suggestionAreaName: "suggestionAreaInputOne",
        country: null,
        city: null,
        address: null,
        longitude: null,
        latitude: null
    },
    inputTwo: {
        name: "inputTwo",
        suggestionAreaName: "suggestionAreaInputTwo",
        country: null,
        city: null,
        address: null,
        longitude: null,
        latitude: null
    }
}

inputFields.inputOne.addEventListener('input', () => inputEventListener(inputFieldsData.inputOne.name, inputFieldsData.inputOne.suggestionAreaName));
inputFields.inputTwo.addEventListener('input', () => inputEventListener(inputFieldsData.inputTwo.name, inputFieldsData.inputTwo.suggestionAreaName));
inputFields.inputOne.addEventListener('click', () => continueGivingSuggestions(inputFieldsData.inputOne.name, inputFieldsData.inputOne.suggestionAreaName));
inputFields.inputTwo.addEventListener('click', () => continueGivingSuggestions(inputFieldsData.inputTwo.name, inputFieldsData.inputTwo.suggestionAreaName));
this.addEventListener('click', () => removeSuggestionField(inputFieldsData.inputOne.suggestionAreaName));
inputFields.calcuationButton.addEventListener('click',() => console.log(dataBase.euroToHufExchangeRate));

(async function setEuroToHufExchangeRate() {
    const json = await fetchEuroExchangeRate();
    const exchangeRate = await json.huf.rate;

    dataBase.euroToHufExchangeRate = exchangeRate;
})()


async function fetchEuroExchangeRate() {
    const response = await fetch("http://www.floatrates.com/daily/eur.json");
    const json = await response.json();
    return json;
}

async function continueGivingSuggestions(inputName, suggestionAreaName) {
    if(inputFields[inputName].value !== ""){
        await inputEventListener(inputName, suggestionAreaName);
    }
}

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
        dataBase.countryArray[currentArrayId] = data.attributes.country;
        dataBase.cityArray[currentArrayId] = data.attributes.city;
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
    const secondPart = "&outFields=Addr_Type,city,country&forStorage=false&maxLocations=10&f=json"
    const response = await fetch(firstPart + userInput + secondPart);
    const json = await response.json();
    return json;
}

async function setInputFieldsData(inputName) {
    await clearInputFieldsData(inputName);

    for(let i = 0; i < dataBase.addressArray.length; i++) {
        if(inputFields[inputName].value === dataBase.addressArray[i] ){
            inputFieldsData[inputName].country = dataBase.countryArray[i];
            inputFieldsData[inputName].city = dataBase.cityArray[i];
            inputFieldsData[inputName].address = dataBase.addressArray[i];
            inputFieldsData[inputName].longitude = dataBase.locationLongitudeArray[i];
            inputFieldsData[inputName].latitude = dataBase.locationLatitudeArray[i];
            break;
        }
    }
}

async function clearInputFieldsData(inputName) {
    inputFieldsData[inputName].country = null;
    inputFieldsData[inputName].city = null;
    inputFieldsData[inputName].address = null;
    inputFieldsData[inputName].longitude = null;
    inputFieldsData[inputName].latitude = null;
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
        let suggestionP = document.createElement('p');
            suggestionP.innerHTML = address;
            suggestionP.addEventListener('click', () => {
                clickEventForSuggestionP(address,inputName,suggestionAreaName)
            })
            suggestions.appendChild(suggestionP);
    }

    inputFields[suggestionAreaName].appendChild(suggestions);
}

async function clickEventForSuggestionP(inputFieldsValue,inputName,suggestionAreaName) {
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
    const inputOneaddressNotNull = inputFieldsData.inputOne.address !== null;
    const inputTwoAddressNotNull = inputFieldsData.inputTwoAddress !== null;
    const euroToHufExchangeRateNotNull = dataBase.euroToHufExchangeRate !== null;
    
    if(inputOneaddressNotNull && inputTwoAddressNotNull && euroToHufExchangeRateNotNull){
        const json = await fetchDistance();
        const distance = json.routes[0].summary.lengthInMeters / 1000;

        return distance;
    }
}

async function fetchDistance() {
    const url = "https://api.tomtom.com/routing/1/calculateRoute/"
    const coordinates = inputFieldsData.inputOne.latitude + "," +
                        inputFieldsData.inputOne.longitude + ":" +
                        inputFieldsData.inputTwo.latitude + "," +
                        inputFieldsData.inputTwo.longitude
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


async function manipulatePriceFields() {
    euroToHufExchangeRation = await fetchEuroExchangeRate();
    const euro = 5000;
    inputFields.euroPriceField.innerHTML = (euro * euroToHufExchangeRation).toFixed() + " €";
}