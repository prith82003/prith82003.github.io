const projects = [
    "Solar System",
    "Procedural Planet",
    "2048",
    "Snake",
    "Tetris",
    "Grass Field"
];

const clickRootButton = (openOnly = false) => {
    let state = sessionStorage.getItem('project-hierarchy-state');
    if (!state) {
        sessionStorage.setItem('project-hierarchy-state', 'false');
        state = 'false';
    }

    const projectHierarchy = document.getElementById('project-hierarchy');

    const activePage = sessionStorage.getItem('activePage');

    if (state === 'true' && openOnly === false && !projects.includes(activePage)) {
        projectHierarchy.innerHTML = '';
        sessionStorage.setItem('project-hierarchy-state', 'false');
        return;
    }

    projectHierarchy.innerHTML = '<div class="nav-window-tab" onclick="openWindow(\'Solar System\', \'./pages/projects/solar-system.html\')"> > <img src="./img/file.png" width="13"> ' +
        'Solar System </div><div class="nav-window-tab" onclick="openWindow(\'Procedural Planet\', \'./pages/projects/procedural-planet.html\')"> > <img src="./img/file.png" width="13"> ' +
        'Procedural Planet</div>';
    sessionStorage.setItem('project-hierarchy-state', 'true');
}

const clickButton = (button) => {
    const state = button.getAttribute('state');
    button.setAttribute('state', state === 'true' ? 'false' : 'true');
}

const onLoad = (pageName) => {
    if (document.title != 'Portfolio')
        return;

    const state = sessionStorage.getItem('project-hierarchy-state');
    if ((!state || state === 'false') && !projects.includes(pageName))
        return;

    const projectHierarchy = document.getElementById('project-hierarchy');

    projectHierarchy.innerHTML = '<div class="nav-window-tab" onclick="openWindow(\'Solar System\', \'./pages/projects/solar-system.html\')"> > <img src="./img/file.png" width="13"> ' +
        'Solar System </div><div class="nav-window-tab" onclick="openWindow(\'Procedural Planet\', \'./pages/projects/procedural-planet.html\')"> > <img src="./img/file.png" width="13"> ' +
        'Procedural Planet</div>';
}