let timeSinceMove = 0;

const update = () => {
    timeSinceMove++;


    if (timeSinceMove >= 8) {
        const bodies = document.getElementsByClassName('fadeable');

        for (const body of bodies) {
            body.classList.remove('fadeIn');
            body.classList.add('fadeOut');
        }
    }
}

const mouseMove = () => {
    const bodies = document.getElementsByClassName('fadeable');

    for (const body of bodies) {
        body.classList.remove('fadeOut');
        body.classList.add('fadeIn');
    }
    timeSinceMove = 0;
}

let obj = document.getElementById('content')

const init = () => {
    // console.log('Init')
    // obj = document.getElementById('contentObj');
    // console.log('obj:');

    // how do i access the content on the linked page through the data object, it is a HTMLElement type object
}

if (document.title === 'Portfolio') {
    const canv = document.getElementById('canvas');
    canv.addEventListener('mousemove', mouseMove);
}

document.addEventListener('mousemove', mouseMove);
setInterval(update, 1000);