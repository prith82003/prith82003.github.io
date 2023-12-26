let activePage = '';

const loadPage = (pageName, loadContent = false) => {
    console.log("Switching to: " + pageName)
    activePage = pageName;

    if (!loadContent)
        return;

    content.innerHTML = "";
    const object = document.createElement('object');
    object.type = "text/html";
    object.data = `./${pageName}.html`;
    object.style.width = "100vh";
    object.style.height = "100vh";
    content.appendChild(object);
}

const createOpenWindow = (pageName, linkedPage) => {
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
    focusOnWindow(pageName, linkedPage);
}

const focusOnWindow = (pageName, linkedPage) => {
    console.log("Focusing: " + pageName);

    if (activePage === pageName)
        return;

    document.getElementById(`open-window-${activePage}`).classList.remove('active-window');

    const openWindow = document.getElementById(`open-window-${pageName}`);
    openWindow.classList.add('active-window');

    changeContent(linkedPage);
    activePage = pageName;
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
    console.log("Opening: " + pageName + ", " + activePage);

    if (activePage === pageName)
        return;

    const openPages = sessionStorage.getItem('openPages');

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

    console.log("JSON")
    console.log(openPagesJson);

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

