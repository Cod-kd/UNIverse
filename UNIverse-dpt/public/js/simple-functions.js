// Function to create a button with id, text, and css transform property specified
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

// Function to create animation when response was successful
function createSuccessfulResponseEffect() {
    const registerBtnDiv = document.getElementById("registerBtnDiv");
    const script = document.createElement("script");
    script.src =
        "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    registerBtnDiv.appendChild(script);

    const lottiePlayer = document.createElement("dotlottie-player");
    lottiePlayer.src =
        "https://lottie.host/3b76d474-8015-414d-91bb-4b329d0ec66a/t8k7eXc8GS.json";
    lottiePlayer.id = "responseHeadingEffect";
    lottiePlayer.setAttribute("speed", "1");
    lottiePlayer.setAttribute("autoplay", "");

    registerBtnDiv.appendChild(lottiePlayer);
}

// Function to create heading with custom text
function createResponseHeading(scaleUp, text) {
    const registerBtnDiv = document.getElementById("registerBtnDiv");
    let responseHeadingEl = document.getElementById("responseHeading");

    if (!responseHeadingEl) {
        responseHeadingEl = document.createElement("h2");
        responseHeadingEl.id = "responseHeading";
        responseHeadingEl.innerHTML = text;
        responseHeadingEl.style.transform = "scale(0)";
        registerBtnDiv.appendChild(responseHeadingEl);
    }

    if (scaleUp) {
        responseHeadingEl.style.transform = "scale(1)";
    }
}

// Function to create home button, when clicked => refreshes the page
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

// Unnecessary function?
function arrowBtnsConfig() {
    const roundElement = document.querySelector(".round");
    const arrows = document.querySelectorAll(".arrow");
    if (roundElement) {
        roundElement.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            arrows.forEach((arrow) => {
                arrow.classList.toggle("bounceAlpha");
            });
        });
    }
}

// Function to initialize the signature's canvas with it's properties
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
function extractEmail(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
}