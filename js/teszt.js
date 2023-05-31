const dataBase = {
    addressArray: [],
    locationXArray: [],
    locationYArray: [],
}

const inputFields = {
    inputOne: document.querySelector('#inputone'),
    suggestionAreaInputOne: document.querySelector('#suggestionareainputone'),
    inputTwo: document.querySelector('#inputtwo'),
    suggestionAreaInputTwo: document.querySelector('#suggestionareainputtwo'),
}

const inputFieldsData = {
    inputOneName: "inputOne",
    inputOneSuggestionAreaName: "suggestionAreaInputOne",
    inputOneAddress: null,
    inputOneX: null,
    inputOneY: null,
    inputTwoName: "inputTwo",
    inputTwoSuggestionAreaName: "suggestionAreaInputTwo",
    inputTwoAddress: null,
    inputTwoX: null,
    inputTwoY: null,
}

inputFields.inputOne.addEventListener('input', () => inputEventListener(inputFieldsData.inputOneName, inputFieldsData.inputOneSuggestionAreaName));
inputFields.inputTwo.addEventListener('input', () => inputEventListener(inputFieldsData.inputTwoName, inputFieldsData.inputTwoSuggestionAreaName));
inputFields.inputOne.addEventListener('click', () => inputEventListener(inputFieldsData.inputOneName, inputFieldsData.inputOneSuggestionAreaName));
inputFields.inputTwo.addEventListener('click', () => inputEventListener(inputFieldsData.inputTwoName, inputFieldsData.inputTwoSuggestionAreaName));
this.addEventListener('click', () => removeSuggestionField(inputFieldsData.inputOneSuggestionAreaName));


async function inputEventListener(inputName, suggestionAreaName) {
    await buildDatabase(inputName);
    await setInputFieldsData(inputName);
    await setSuggestionField(inputName, suggestionAreaName);
    if(inputFieldsData.inputOneAddress !== null && inputFieldsData.inputTwoAddress !== null){
        await calculateDistance();
    }
}

async function buildDatabase(inputName) {
    clearDatabase();
    const userInput = inputFields[inputName].value;
    const json = await fetchJson(userInput);
    const rawData = json.candidates;
    let currentArrayId = 0;

    for(let data of rawData){
        dataBase.addressArray[currentArrayId] = data.address;
        dataBase.locationXArray[currentArrayId] = data.location.x;
        dataBase.locationYArray[currentArrayId] = data.location.y;
        currentArrayId++;
    }
}

async function clearDatabase() {
    dataBase.addressArray = [];
    dataBase.locationXArray = [];
    dataBase.locationYArray = [];
}

async function fetchJson(userInput) {
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
            inputFieldsData[inputName + "X"] = dataBase.locationXArray[i];
            inputFieldsData[inputName + "Y"] = dataBase.locationYArray[i];
            break;
        }
    }
}

async function clearInputFieldsData(inputName) {
    inputFieldsData[inputName + "Address"] = null;
    inputFieldsData[inputName + "X"] = null;
    inputFieldsData[inputName + "Y"] = null;
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
    if(inputFieldsData.inputOneAddress !== null && inputFieldsData.inputTwoAddress !== null){
        await calculateDistance();
    }
}

async function removeSuggestionField(suggestionAreaName) {
    if(inputFields[suggestionAreaName].firstChild !== null){
        inputFields[suggestionAreaName].removeChild(inputFields[suggestionAreaName].firstChild);
    }
}

async function calculateDistance() {
    console.log("hello")
    if(inputFieldsData.inputOneAddress !== null && inputFieldsData.inputTwoAddress !== null){
        const lat1 = inputFieldsData.inputOneY;
        const lon1 = inputFieldsData.inputOneX;
        const lat2 = inputFieldsData.inputTwoY;
        const lon2 = inputFieldsData.inputTwoX;

        const R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2-lat1);  // deg2rad below
        let dLon = deg2rad(lon2-lon1); 
        let a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        let d = R * c; // Distance in km

        console.log("távolság: " + d)
    }
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
  }