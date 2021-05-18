const tzOutput = document.querySelector('.timezone');
const tOutput = document.querySelector('.time');
const btnGet = document.querySelector('.btnRequest');

function getPosition() {
    return new Promise(function(resolve, reject) {
        let geo = navigator.geolocation;
        geo.getCurrentPosition(position => resolve(position), error => reject(
        console.log(`Error ${error.code}: ${error.message}`) ))
    });
} 

function getUrl (geoResponse) {
    // `https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=latitude&long=longitude`
    const apiURL = 'https://api.ipgeolocation.io/timezone';
    const apiKey = '32bcd4a6e4b548968e7afcdb682ac679';
    let lat = geoResponse.coords.latitude;
    let lon = geoResponse.coords.longitude;
    let lang = 'ru';

    let url = new URL (apiURL);
    url.searchParams.set('apiKey', apiKey);
    if (lang) url.searchParams.set('lang', lang);
    if (lat && lon) {
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
    }
    return url.href;
}
    
function getTimezoneData(url) {
    return fetch(url)
    .then( response => response.json() )
}

function displayData(data) {
    tzOutput.textContent = '';
    tOutput.textContent = '';
    tzOutput.innerHTML = '<p>Timezone</p>';
    tOutput.innerHTML = '<p>Time</p>';  
    
    let timezone = data.timezone_offset;
    if (timezone > 0) timezone = '+' + timezone;
    tzOutput.append(timezone);
    tOutput.append(data.date_time_txt);
}


btnGet.addEventListener('click', async () => {
    let pos = await getPosition();
    let urlRequest = getUrl(pos);
    let tzdata = await getTimezoneData(urlRequest);
    displayData(tzdata);
});