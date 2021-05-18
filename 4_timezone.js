const tzOutput = document.querySelector('.timezone');
const tOutput = document.querySelector('.time');
const btnGet = document.querySelector('.btnRequest');

function getPosition() {
   let geo = navigator.geolocation;
   geo.getCurrentPosition(getTimezone, 
    e => {console.log(`Error ${e.code}: ${e.message}`);})
    
    function getTimezone (place) {
        // `https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=latitude&long=longitude`
        const apiURL = 'https://api.ipgeolocation.io/timezone';
        const apiKey = '32bcd4a6e4b548968e7afcdb682ac679';
        let lat = place.coords.latitude;
        let lon = place.coords.longitude;
        let lang = 'ru';
    
        let url = new URL (apiURL);
        url.searchParams.set('apiKey', apiKey);
        if (lang) url.searchParams.set('lang', lang);
        if (lat && lon) {
        url.searchParams.set('lat', lat);
        url.searchParams.set('lon', lon);
        }
        fetch(url)
        .then(response => {return response.json();})
        .then(data => {
            tzOutput.textContent = '';
            tOutput.textContent = '';
            tzOutput.innerHTML = '<p>Timezone</p>';
            tOutput.innerHTML = '<p>Time</p>';  
            
            let timezone = data.timezone_offset;
            if (timezone > 0) timezone = '+' + timezone;
            tzOutput.append(timezone);
            tOutput.append(data.date_time_txt);
    });
    }
    
}



btnGet.addEventListener('click', async () => {
    getPosition();
    
});