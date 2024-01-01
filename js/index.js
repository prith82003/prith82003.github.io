const loadOpenWindows = () => {
    const openPages = sessionStorage.getItem('openPages');
    // create the div elements for each open window

    if (openPages == null)
        return;

    const openPagesJson = JSON.parse(openPages);

    for (const key in openPagesJson) {
        // check if tab already exists
        const tab = document.getElementById(key);
        if (tab)
            continue;

        const pageName = key.slice(12);
        createOpenWindow(pageName, openPagesJson[key], false);
    }

    const activePage = sessionStorage.getItem('activePage');
    focusOnWindow(activePage, openPagesJson[`open-window-${activePage}`]);
}

const loadPage = (pageName, linkedPage, loadContent = false) => {
    onLoad(pageName);

    if (pageName === 'active') {
        const activePage = sessionStorage.getItem('activePage');
        const linkedActive = sessionStorage.getItem('linkedActive');

        if (activePage == null) {
            loadPage('home', './pages/home.html', loadContent);
            return;
        }

        loadPage(activePage, linkedActive, loadContent);
        return;
    }

    sessionStorage.setItem('activePage', pageName);
    sessionStorage.setItem('linkedActive', linkedPage);

    if (document.title === 'Portfolio')
        loadOpenWindows();

    const tab = document.getElementById(`open-window-${pageName}`);
    if (tab && !tab.classList.contains('active-window'))
        tab.classList.add('active-window');

    if (!loadContent)
        return;

    changeContent(linkedPage);
}

const createOpenWindow = (pageName, linkedPage, switchTab = true) => {
    const div = document.createElement('div');
    const parent = document.getElementById('open-windows');

    div.classList.add('open-window');
    parent.appendChild(div);

    div.id = `open-window-${pageName}`;

    let name = pageName;
    name = name[0].toUpperCase() + name.slice(1);
    // name += ".html"

    div.textContent = name;
    div.addEventListener('click', () => { focusOnWindow(pageName, linkedPage) });

    if (switchTab)
        focusOnWindow(pageName, linkedPage);
}

const focusOnWindow = (pageName, linkedPage) => {
    const tabs = document.getElementsByClassName('open-window');

    const activePage = sessionStorage.getItem('activePage');

    if (activePage === pageName)
        return;

    document.getElementById(`open-window-${activePage}`).classList.remove('active-window');

    const openWindow = document.getElementById(`open-window-${pageName}`);
    openWindow.classList.add('active-window');

    changeContent(linkedPage);
    onLoad(pageName);
    sessionStorage.setItem('activePage', pageName);
    sessionStorage.setItem('linkedActive', linkedPage);
}

const changeContent = (linkedPage) => {
    const content = document.getElementById('content');

    content.innerHTML = "";
    const object = document.createElement('object');
    object.type = "text/html";
    object.data = linkedPage;
    object.style.width = "100%";
    object.style.height = "100%";
    content.appendChild(object);
}

const openWindow = (pageName, linkedPage) => {
    // send get request to /pages and store json object
    const activePage = sessionStorage.getItem('activePage');

    if (activePage === pageName)
        return;

    const openPages = sessionStorage.getItem('openPages');
    loadOpenWindows();

    let openPagesJson = null;
    if (openPages == null) {
        // create new openPages object
        openPagesJson = {
            [`open-window-${activePage}`]: linkedPage
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
        focusOnWindow(pageName, linkedPage);
    }

    sessionStorage.setItem('openPages', JSON.stringify(openPagesJson));
}

