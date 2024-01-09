
let timeSinceMove = 0;

const update = () => {
    timeSinceMove++;

    if (timeSinceMove >= 8) {
        const body = document.getElementById('content');
        body.classList.remove('fadeIn');
        body.classList.add('fadeOut');
    }
}

window.onmousemove = () => {
    const body = document.getElementById('content');
    body.classList.remove('fadeOut');
    body.classList.add('fadeIn');
    timeSinceMove = 0;
}

setInterval(update, 1000);