// Selecting elements from the DOM
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.lgn-btn');
const closeIcon = document.querySelector('.icon-close');

// The main container we want to blur
const mainContainer = document.querySelector('.container');

// Check if elements exist before adding event listeners
if (registerLink) {
    registerLink.addEventListener('click', () => {
        wrapper.classList.add('active');
    });
}

if (loginLink) {
    loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
    });
}

if (btnPopup) {
    btnPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        mainContainer.classList.add('blurred'); // Blur the container
    });
}

if (closeIcon) {
    closeIcon.addEventListener('click', () => {
        wrapper.classList.remove('active-popup');
        mainContainer.classList.remove('blurred'); // Remove blur
    });
}

// Handling username and email input (optional)
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const submitButton = document.querySelector('#submit-btn');

if (submitButton) {
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission for debugging
        console.log("Username:", usernameInput ? usernameInput.value : "Not Found");
        console.log("Email:", emailInput ? emailInput.value : "Not Found");
    });
}
