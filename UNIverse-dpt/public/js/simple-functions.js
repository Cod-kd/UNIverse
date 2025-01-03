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
function createHomeButton() {
    const homeBtn = document.createElement("button");
    homeBtn.id = "homeBtn";
    homeBtn.innerHTML = `<i class="fa fa-home"></i>`;
    homeBtn.addEventListener("click", async function () {
        window.location.reload();
    });
    return homeBtn;
}

// Function to create the show-toggle button for password fields
// Use cases: 2 --> 1-1 (async-functions.js - main.js)
// As component: toggle-visibility-button
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

// Function to initialize the signature's canvas with it's properties
// Use cases: 1 --> main.js
function setupSignatureCanvas() {
    const canvas = document.getElementById("signatureCanvas");
    const resetCanvasBtn = document.getElementById("resetCanvasBtn");
    resetCanvasBtn.classList.add("button");
    let drawColor = "#FF5A1F";
    let drawWidth = 2;
    let isDrawing = false;
    let hasDrawn = false;
    let lastX = 0;
    let lastY = 0;

    canvas.width = 200;
    canvas.height = 200;
    const context = canvas.getContext("2d");
    context.fillStyle = "#141414";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", drawSignature, { passive: false });
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawSignature);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    resetCanvasBtn.addEventListener("click", clearCanvas);

    // Function to get the cursor's position on the canvas
    function getEventPosition(event) {
        const rect = canvas.getBoundingClientRect();
        if (event.touches && event.touches.length > 0) {
            return {
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top
            };
        } else {
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
    }

    // Function to start drawing on the canvas
    function startDrawing(event) {
        isDrawing = true;
        const pos = getEventPosition(event);
        lastX = pos.x;
        lastY = pos.y;
        context.beginPath();
        context.moveTo(lastX, lastY);
        event.preventDefault();
    }

    // Function to draw the signature
    function drawSignature(event) {
        if (!isDrawing) return;
        const pos = getEventPosition(event);

        if (Math.abs(pos.x - lastX) > 0 || Math.abs(pos.y - lastY) > 0) {
            hasDrawn = true;
            updateContinueButton();
        }

        context.lineTo(pos.x, pos.y);
        context.strokeStyle = drawColor;
        context.lineWidth = drawWidth;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();

        lastX = pos.x;
        lastY = pos.y;
        event.preventDefault();
    }

    // Function to stop drawing sequence
    function stopDrawing(event) {
        if (isDrawing) {
            isDrawing = false;
            event.preventDefault();
        }
    }

    // Function to clear canvas's content
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#141414";
        context.fillRect(0, 0, canvas.width, canvas.height);
        hasDrawn = false;
        updateContinueButton();
    }

    // Function to enable continue button after drawing signature
    function updateContinueButton() {
        const continueBtn = document.querySelector("#continueBtn");
        if (continueBtn) {
            if (hasDrawn) {
                continueBtn.style.opacity = "1";
                continueBtn.style.pointerEvents = "auto";
            } else {
                continueBtn.style.opacity = "0.5";
                continueBtn.style.pointerEvents = "none";
            }
        }
    }
}

// Function to extract email from uploaded UNIcard
// Use cases: 1 --> async-functions.js
function extractEmail(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
}