const projectText = ['Project A...', 'Project B...', 'Project C...', 'Project D...'];
const projectElems = document.getElementsByClassName('project');
const overview = document.getElementById('overview-text');

const loadProject = (project, text) => {
    let id = text.id;
    id = id + '-info';

    // get all elements that have class 'show'
    const show = document.getElementsByClassName('visible');
    Array.prototype.forEach.call(
        show,
        (elem) => {
            if (elem.id !== id) {
                elem.classList.remove('visible');
                elem.classList.add('hidden');
            }
        }
    );

    // remove the bullet point from the previous project
    if (overview.innerText.endsWith('•'))
        overview.innerText = overview.innerText.substring(0, overview.innerText.length - 2);

    Array.prototype.forEach.call(
        projectElems,
        (elem) => {
            if (elem.innerText.endsWith('•')) {
                elem.innerText = elem.innerText.substring(0, elem.innerText.length - 2);
                elem.classList.remove('selected');
            }
        }
    );

    const projectInfo = document.getElementById(id);

    if (!projectInfo.classList.contains('hidden')) {
        projectInfo.classList.add('hidden');
        projectInfo.classList.remove('visible');
        const overview = document.getElementById('overview-text');
        overview.innerText = overview.innerText + ' •';
        return;
    }

    projectInfo.classList.remove('hidden');
    projectInfo.classList.add('visible');
    text.innerText = text.innerText + ' •';
    text.classList.add('selected');
}