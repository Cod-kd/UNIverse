// Function to create a button with id, text, and css transform property specified
// Use cases: 1 --> async-functions.js
// As component: basic-button
function createBasicButton({ id, text, initialTransform }) {
    const newBtn = document.createElement("button");
    newBtn.id = id;
    newBtn.innerHTML = text;
    newBtn.classList.add("button");
    newBtn.style.position = "relative";
    newBtn.style.opacity = "0";
    newBtn.style.transform = initialTransform;
    return newBtn;
}

// Function to create home button, when clicked => refreshes the page
// Use cases: 4 --> 2-2 (async-functions.js - main.js)
// As component: home-button
function createHomeButton(atLogin) {
    const homeBtn = document.createElement("button");
    homeBtn.id = "homeBtn";
    homeBtn.innerHTML = `<span class="material-symbols-outlined">${atLogin?"badge":"login"}</span>`;
    homeBtn.addEventListener("click", async function () {
        if (atLogin) {
            renderRegistration();
        } else {
            renderLogin();
        }
    });
    return homeBtn;
}


// Function to create the show-toggle button for password fields
// Use cases: 2 --> 1-1 (async-functions.js - main.js)
// As component: toggle-visibility-button
/*
function createShowBtn(elementToShow) {
    const showBtn = document.createElement("button");
    showBtn.id = "showBtn";
    showBtn.classList.add("button");
    showBtn.innerHTML = "Show";
    showBtn.addEventListener("click", function () {
        if (elementToShow.type === "password") {
            passwordInput.type = "text";
            showBtn.innerHTML = "Hide";
        } else {
            elementToShow.type = "password";
            showBtn.innerHTML = "Show";
        }
    });
    return showBtn;
}
*/

// Function to extract email from uploaded UNIcard
// Use cases: 1 --> async-functions.js
function extractEmail(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
}