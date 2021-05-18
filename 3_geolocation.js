const output = document.querySelector('#output');
const getBtn = document.querySelector('#getdata');
const map = document.querySelector('.map');

function wrapData(data) {
    let p = document.createElement('P');
    p.textContent = data;
    return p;
}

function makeLabel (label, htmldata) {
    let div = document.createElement('DIV');
    let p = document.createElement('P');
    p.classList.add('data-expl');
    p.textContent = `${label}: `;
    div.appendChild(p);
    div.appendChild(htmldata);
    return div;
}

function display(whereInsert, whatInsert) {
    whereInsert.appendChild(whatInsert);
}

getBtn.addEventListener('click', function() {
    let screenWidth = wrapData(window.screen.width);
    let screenHeight = wrapData(window.screen.height);
    let geo = navigator.geolocation;
    output.textContent = '';
    geo.getCurrentPosition((geoObj)=>{
        let lat = wrapData(geoObj.coords.latitude);
        let lon = wrapData(geoObj.coords.longitude);
        let time = wrapData(new Date(geoObj.timestamp).toLocaleString('ru'));
        display(output, makeLabel('Широта', lat));
        display(output, makeLabel('Долгота', lon));
        display(output, makeLabel('Время получения координат', time));
    }, (e) => {console.log('Не удалось получить геопозицию:' + e.code + ': ' + e.message);});

    //screenWidth = wrapData(screenWidth);
   // screenHeight = wrapData(screenHeight);
    display(output, makeLabel('Ширина экрана', screenWidth))
    display(output, makeLabel('Высота экрана', screenHeight))
});