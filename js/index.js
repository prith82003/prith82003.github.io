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
    console.log('Active: ' + activePage);
    // focus on active page using activePage string
    focusOnWindow(activePage, openPagesJson[`open-window-${activePage}`]);
}

const loadPage = (pageName, loadContent = false) => {
    console.log('LP Req: ' + pageName);

    if (pageName === 'active') {
        const activePage = sessionStorage.getItem('activePage');

        console.log("LP Active: " + activePage);

        if (activePage == null) {
            loadPage('home', loadContent);
            return;
        }

        loadPage(activePage, loadContent);
        return;
    }

    console.log("LP Set Active to: " + pageName)
    sessionStorage.setItem('activePage', pageName);

    if (document.title === 'Portfolio')
        loadOpenWindows();

    const tab = document.getElementById(`open-window-${pageName}`);
    if (tab && !tab.classList.contains('active-window'))
        tab.classList.add('active-window');


    if (!loadContent)
        return;

    changeContent(`${pageName}.html`);
}

const createOpenWindow = (pageName, linkedPage, switchTab = true) => {
    // create a div element
    console.log("Hello World")

    const div = document.createElement('div');
    const parent = document.getElementById('open-windows');

    div.classList.add('open-window');
    parent.appendChild(div);

    div.id = `open-window-${pageName}`;

    let name = pageName;
    name = name[0].toUpperCase() + name.slice(1);
    name += ".html"

    div.textContent = name;
    div.addEventListener('click', () => { focusOnWindow(pageName, linkedPage) });

    if (switchTab)
        focusOnWindow(pageName, linkedPage);
}

const focusOnWindow = (pageName, linkedPage) => {
    console.log("Focusing: " + pageName);
    const activePage = sessionStorage.getItem('activePage');

    if (activePage === pageName)
        return;

    document.getElementById(`open-window-${activePage}`).classList.remove('active-window');

    const openWindow = document.getElementById(`open-window-${pageName}`);
    openWindow.classList.add('active-window');

    changeContent(linkedPage);
    sessionStorage.setItem('activePage', pageName);
    console.log('FW Set Active Page: ' + pageName);
}

const changeContent = (linkedPage) => {
    const content = document.getElementById('content');
    // content.innerHTML = `<object type="text/html" data="${linkedPage}" ></object>`;
    // the above method causes a problem where the new data is loaded into a small section on the page with a scroll bar, it should take the full page
    // the below method works


    content.innerHTML = "";
    const object = document.createElement('object');
    object.type = "text/html";
    object.data = linkedPage;
    object.style.width = "100vh";
    object.style.height = "100vh";
    content.appendChild(object);
}

const openWindow = (pageName, linkedPage) => {
    // send get request to /pages and store json object
    const activePage = sessionStorage.getItem('activePage');
    console.log("Opening: " + pageName + ", " + activePage);

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
        console.log("Opening New");
        createOpenWindow(pageName, linkedPage);
        openPagesJson[`open-window-${pageName}`] = linkedPage;
    }
    else {
        // focus on window
        console.log("Opening Old");
        focusOnWindow(pageName, linkedPage);
    }

    sessionStorage.setItem('openPages', JSON.stringify(openPagesJson));
}

