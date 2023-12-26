let activePage = 'home';

const createOpenWindow = (pageName, linkedPage) => {
    // create a div element
    console.log("Hello World")

    const div = document.createElement('div');
    const parent = document.getElementById('open-windows');

    div.classList.add('open-window');
    parent.appendChild(div);

    div.id = 'open-window-' + pageName;

    let name = pageName;
    name = name[0].toUpperCase() + name.slice(1);
    name += ".html"

    div.textContent = name;
    focusOnWindow(pageName, linkedPage);
}

const focusOnWindow = (pageName, linkedPage) => {
    document.getElementById(`open-window-${activePage}`).classList.remove('active-window');

    const openWindow = document.getElementById(`open-window-${pageName}`);
    openWindow.classList.add('active-window');
}

const openWindow = (pageName, linkedPage) => {
    // send get request to /pages and store json object
    console.log("Opening");
    const openPages = sessionStorage.getItem('openPages');

    let openPagesJson = null;
    if (openPages == null) {
        // create new openPages object
        openPagesJson = {
            [`open-window-${pageName}`]: linkedPage
        }

        // store openPages object in session storage
        sessionStorage.setItem('openPages', JSON.stringify(openPagesJson));
    } else
        openPagesJson = JSON.parse(openPages);

    // check if page is already open
    if (openPagesJson[`open-window-${pageName}`] == null) {
        createOpenWindow(pageName, linkedPage);
        openPagesJson[`open-window-${pageName}`] = linkedPage;
    }
    else {
        // focus on window
        const openWindow = document.getElementById(pageName);
        focusOnWindow(openWindow);
    }

    sessionStorage.setItem('openPages', JSON.stringify(openPagesJson));
    activePage = pageName;
}

