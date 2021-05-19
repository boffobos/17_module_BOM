const chatWindow = document.querySelector('.container')
const messageOut = document.querySelector('.messages');
const btnSend = document.querySelector('.btnSend');
const btnGeo = document.querySelector('.btnGeo');
const messageInput = document.querySelector('.message');
let websocket = new WebSocket('wss://echo.websocket.org/');

chatWindow.ondragstart = () => false;

chatWindow.addEventListener('mousedown', function(e) {
    //console.log(e);
    chatWindow.style.position = 'absolute';
    let offX = e.offsetX;
    let offY = e.offsetY;
    //console.log(`1 ${offX} ${offY}`);
    function moveWindow(event) {
        chatWindow.style.left = event.pageX - offX + 'px';
        chatWindow.style.top = event.pageY - offY + 'px';
    }
    function endMovement() {
        document.body.removeEventListener('mousemove', moveWindow);
        document.body.removeEventListener('mouseup', endMovement);
    }
    document.body.addEventListener('mouseup', endMovement);
    let isContainer = e.target.classList.value.includes('container');
    if(isContainer) {
        document.body.addEventListener('mousemove', moveWindow);
        
    }
});


class Message {
    constructor(type) {
        this.type = type,
        this.content = {},
        this.timestamp = new Date().getTime();
    }
}

//print out messages into message area
function printMessage(msg, direction) {
    const p = document.createElement('P');
    p.classList.add(direction);
    const span = document.createElement('SPAN');

    span.textContent = msg;
    p.appendChild(span);
    messageOut.appendChild(p);
}

function getLocation() {
    return new Promise(function(resolve, reject){
        const geo = navigator.geolocation;
        geo.getCurrentPosition( position => resolve(position), err => reject(console.log(new Error(err))) );
    });
}

//send location aquired from browser API
function sendLocation(location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    let position = new Message('geolocation');
    position.content = {
        latitude: lat,
        longitude: long,
        accuracy: location.coords.accuracy,
    }
    
    let json = JSON.stringify(position);

    let a = document.createElement('A');
    a.href = `https://www.openstreetmap.org/#map=16/${lat}/${long}`;
    a.textContent = 'Я здесь!';
    a.target = '_blank';
    a.style.textDecoration = 'none';
    a.style.color = '#1684df';

    let span = document.createElement('SPAN');
    span.appendChild(a)

    let p = document.createElement('P');
    p.classList.add('myMessage');
    p.appendChild(span);
    messageOut.appendChild(p);
    //how to check if websocket open?
    websocket.send(json);
}

//send text messages to remote server
function sendMessage(msgText) {
    let message = new Message('text');
    if(typeof msgText === 'string') {
        message.content.text = msgText;
        printMessage(msgText, 'myMessage');
        websocket.send(JSON.stringify(message));
    } else console.log('This type of content is not supported yet');
}

function receiveMessage(msgJSON) {
    let message = JSON.parse(msgJSON);
    if (message.type === 'text') {
        let text = message.content.text;
        printMessage(text, 'oppMessage');
    }
}

websocket.onopen = function () {
    console.log('websocket open');
    btnSend.addEventListener('click', () => {
        let message = messageInput.value;
        messageInput.value = '';
        if (message) sendMessage(message);
    });

    btnGeo.addEventListener('click', async () => {
        let location = await getLocation();
        sendLocation(location);
    });
    websocket.onmessage = function(msg) {
        receiveMessage(msg.data);
    }
    websocket.onerror = function(event) {
        console.log('Error: ' + event.data);
    }
}


