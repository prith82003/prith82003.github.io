// import necessary resources to send requests to backend server
const fetch = require('node-fetch');

function createOpenWindow() {
    // create a div element
    console.log("Hello World")

    const div = document.createElement('div');
    const parent = document.getElementById('open-windows');

    div.classList.add('open-window');
    parent.appendChild(div);

    div.textContent = 'Hello World';
}

const openWindow = (pageName, linkedPage) => {
    // send get request to /pages and store json object
    const json = null;

}

const pageButtons = document.querySelectorAll('.page-button');
pageButtons.forEach(button => {
    button.addEventListener('click', openWindow);
});