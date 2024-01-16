const loadPage = (pageName, linkedPage, loadContent = false) => {
    if (pageName === 'active') {
        const activePage = sessionStorage.getItem('activePage');
        const linkedActive = sessionStorage.getItem('linkedActive');

        if (activePage == null) {
            loadPage('home', './pages/home.html', loadContent);
            sessionStorage.setItem('activePage', 'home');
            sessionStorage.setItem('linkedActive', './pages/home.html');
            return;
        }

        loadPage(activePage, linkedActive, loadContent);
        return;
    }

    console.log('Load: ' + pageName + ', LP: ' + linkedPage);

    if (loadContent)
        PageManager.setActivePage(pageName, linkedPage);
}

const changeContent = (linkedPage) => {
    console.log('Change Cont!')
    const content = document.getElementById('content');

    content.innerHTML = "";
    const object = document.createElement('object');
    object.type = "text/html";

    // q: how do i access the content on the linked page through the data object
    // a: object.contentDocument.body.innerHTML
    object.data = linkedPage;
    object.id = 'contentObj';
    object.style.width = "100%";
    object.style.height = "100%";
    content.appendChild(object);
}

const addListener = (func) => {
    document.onmousemove = func;
}

if (document.title === 'Portfolio') {
    PageManager.object = document.getElementById('contentObj');
    PageManager.content = document.getElementById('content');
}

// make a singleton class called PageManager with a set and get activePage method
class PageManager {
    static object;
    static content;

    static getActivePage() {
        return sessionStorage.getItem('activePage');
    }

    static getLinkedActive() {
        return sessionStorage.getItem('linkedActive');
    }

    static setActivePage(pageName, linkedPage) {
        const content = document.getElementById('content');

        console.log('Document title: ' + document.title);

        content.innerHTML = "";
        const object = document.createElement('object');
        object.type = "text/html";

        console.log('LP: ' + linkedPage)

        // q: how do i access the content on the linked page through the data object
        // a: object.contentDocument.body.innerHTML
        object.data = linkedPage;
        object.id = 'contentObj';
        object.style.width = "100%";
        object.style.height = "100%";
        content.appendChild(object);

        const navButtons = object.contentDocument.getElementsByClassName('nav-buttons');

        console.log('content Doc: ');
        console.log(object.contentDocument);

        console.log('Obj');
        console.log(object);

        for (const button of navButtons) {
            button.onclick = () => {
                console.log('Button Clicked!')
                loadPage(button.name, button.linkedPage);
            }
        }

        sessionStorage.setItem('activePage', pageName);
        sessionStorage.setItem('linkedPage', linkedPage);
    }

    static setLinkedActive(linkedPage) {
        sessionStorage.setItem('linkedActive', linkedPage);
    }
}