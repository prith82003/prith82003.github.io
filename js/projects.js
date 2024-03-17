const projectText = ['Project A...', 'Project B...', 'Project C...', 'Project D...'];

const loadProject = (project, text) => {
    let id = text.id;
    id = id + '-info';

    // get all elements that have class 'show'
    const show = document.getElementsByClassName('visible');
    const testDivs = Array.prototype.forEach.call(
        show,
        (elem) => {
            if (elem.id !== id) {
                elem.classList.remove('visible');
                elem.classList.add('hidden');
            }
        }
    );

    const projectInfo = document.getElementById(id);

    if (!projectInfo.classList.contains('hidden')) {
        projectInfo.classList.add('hidden');
        projectInfo.classList.remove('visible');
        return;
    }

    projectInfo.classList.remove('hidden');
    projectInfo.classList.add('visible');
}