document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menuToggle');
    const mainMenu = document.querySelector('#mainMenu');
    const materiasButton = document.querySelector('.menuButton:nth-child(1)');
    const dinamicasButton = document.querySelector('.menuButton:nth-child(3)');
    const materiasMenu = document.querySelector('#materiasMenu');
    const dinamicasMenu = document.querySelector('#dinamicasMenu');

    // Toggle main menu
    menuToggle.addEventListener('click', () => {
        mainMenu.classList.toggle('active');
        // Close submenus when main menu is toggled
        materiasMenu.classList.remove('active');
        dinamicasMenu.classList.remove('active');
    });

    // Toggle Materias submenu
    materiasButton.addEventListener('click', () => {
        materiasMenu.classList.toggle('active');
        // Close Dinamicas submenu if open
        dinamicasMenu.classList.remove('active');
    });

    // Toggle Dinamicas submenu
    dinamicasButton.addEventListener('click', () => {
        dinamicasMenu.classList.toggle('active');
        // Close Materias submenu if open
        materiasMenu.classList.remove('active');
    });

    // Close submenus when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mainMenu.classList.remove('active');
            materiasMenu.classList.remove('active');
            dinamicasMenu.classList.remove('active');
        }
    });
});