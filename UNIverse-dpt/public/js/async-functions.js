// Function to split the main button into register + login
// Use cases: 1 --> index.html
async function splitMainButton() {
    registerLoginBtn.style.transform = "scale(0)";
    registerLoginBtn.style.transition = "transform 0.5s";
    monitorScreenDiv.style.gap = "0.3em";

    await delay(500);
    registerLoginBtn.remove();

    const buttonData = [
        {
            id: "registerBtn",
            text: "Regisztráció",
            initialTransform: "translateX(-200%)"
        },
        {
            id: "loginBtn",
            text: "Bejelentkezés",
            initialTransform: "translateX(200%)"
        }
    ];

    for (const data of buttonData) {
        const newBtn = createBasicButton(data);
        newBtn.style.marginBottom = "1%"
        registerLoginBtnDiv.appendChild(newBtn);
        await delay(50);
        newBtn.style.transform = "translateX(0)";
        newBtn.style.opacity = "1";
        newBtn.addEventListener(
            "mouseenter",
            () => (newBtn.style.transform = "scale(1.05)")
        );
        newBtn.addEventListener(
            "mouseleave",
            () => (newBtn.style.transform = "scale(1)")
        );
        newBtn.addEventListener("click", async () => {
            await fadeOutMonitorScreen();
            monitorScreenDiv.innerHTML = ``;
            monitorScreenDiv.style.gap = "1.5em";
            if (data.id === "registerBtn") {
                renderRegistration();
            } else {
                renderLogin();
            }
            await fadeInMonitorScreen();
        });
    }
}

// Function to represent data disappearing from monitorScreenDiv
// Use cases: 8 --> 4-4 (async-functions.js - main.js)
async function fadeOutMonitorScreen() {
    monitorScreenDiv.style.opacity = "0";
    await delay(200);
}

// Function to represent data appearing on monitorScreenDiv
// Use cases: 5-3 (async-functions.js - main.js)
async function fadeInMonitorScreen() {
    monitorScreenDiv.style.opacity = "1";
    await delay(100);
}

// Function used to save the user's signature as an image
// Use cases: 1 --> main.js
async function captureSignature() {
    const canvas = document.getElementById("signatureCanvas");
    if (!canvas) return null;

    const context = canvas.getContext("2d");
    const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    ).data;

    const hasSignature = Array.from(imageData).some((pixel, index) => {
        if (index % 4 === 0) {
            return pixel !== 20;
        }
        return false;
    });

    if (!hasSignature) {
        return null;
    }

    return canvas.toDataURL("image/png");
}

// Function to hash the inputted image file
// Use cases: 2 --> 1-1 (async-functions.js - main.js)
async function hashImage(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

// Function used to create pop-up error messages
// Use cases: 6 --> 4-2 (async-functions.js - main.js)
async function createResponseWindow(text) {
    let existingErrorWindow = document.querySelector("#errorWindow");
    if (!existingErrorWindow) {
        let errorWindow = document.createElement("div");
        errorWindow.id = "errorWindow";
        errorWindow.innerHTML = `<p>${text}</p>`;
        document.body.appendChild(errorWindow);
        errorWindow.style.animation = "showWindow 0.5s 1 forwards ease";
        await delay(3000);
        errorWindow.style.animation = "hideWindow 0.5s 1 forwards ease";
        await delay(600);
        errorWindow.remove();
    }
}

// Function used to render the login page's elements
// Use cases: 1 --> asnyc-functions.js
async function renderLogin() {
    monitorScreenDiv.innerHTML = `
      <form id="loginForm" onsubmit="return false;">
          <input id="usernameInput" type="text" placeholder="Felhasználónév..." class="input" name="username">
          <input id="passwordInput" max="18" type="password" placeholder="Jelszó..." class="input" name="passwd">
          <button class="button" id="loginBtn">Bejelentkezés</button>
      </form>
      <button class="button" id="cardLoginBtn">UNIcard használata</button>`;
    monitorScreenDiv.appendChild(createHomeButton());
    monitorScreenDiv.appendChild(createShowBtn(document.getElementById("passwordInput")));
    const showBtn = document.getElementById("showBtn");
    showBtn.id = "showBtnLogin";

    const handleError = async (errorMessage) => {
        createResponseWindow(errorMessage);
        await fadeInMonitorScreen();
    };

    document.getElementById("usernameInput").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("passwordInput").focus();
        }
    });

    // Simple login
    document.getElementById("loginBtn").addEventListener("click", async () => {
        document.body.style.cursor = "progress";
        const formData = new FormData(document.getElementById("loginForm"));

        try {
            const username = "admin";
            const password = "oneOfMyBestPasswords";

            let headers = new Headers();
            headers.set("Authorization", "Basic " + btoa(username + ":" + password));
            headers.set("Content-Type", "application/json");

            const response = await fetch("http://localhost:8080/user/login", {
                headers: headers,
                method: "POST",
                body: JSON.stringify({
                    usernameIn: formData.get("username"),
                    passwordIn: formData.get("passwd")
                })
            });

            await fadeOutMonitorScreen();

            switch (response.status) {
                case 200:
                    monitorScreenDiv.innerHTML = `<h1>${await response.text()}<br>Redirecting...</h1>`;
                    break;
                case 400:
                    createResponseWindow("Hibás felhasználónév vagy jelszó!");
                    break;
                default:
                    createResponseWindow("Szerveroldali hiba");
            }

            await fadeInMonitorScreen();

        } catch (error) {
            await createResponseWindow(error.message);
        } finally {
            document.body.style.cursor = "default";
        }
    });

    // Card login
    document.getElementById("cardLoginBtn").addEventListener("click", async function () {
        await fadeOutMonitorScreen();
        monitorScreenDiv.innerHTML = `
          <form id="cardForm" onsubmit="return false">
              <div id="cardContainer">
                  <div class="folder">
                      <div class="front-side">
                          <div class="tip"></div>
                          <div class="cover"></div>
                      </div>
                      <div class="back-side cover"></div>
                  </div>
                  <label class="custom-file-upload">
                  <input id="cardInput" type="file" accept=".jpg, .jpeg">Saját UNIcard-od</label>
              </div>
              <button class="button" id="loginBtn">Bejelentkezés kártyával</button>
          </form>`;
        monitorScreenDiv.appendChild(createHomeButton());
        await fadeInMonitorScreen();

        const loginBtn = document.getElementById("loginBtn");
        loginBtn.addEventListener("click", async function () {
            await fadeOutMonitorScreen();
            document.body.style.cursor = "progress";
            const cardInput = document.getElementById("cardInput");
            const image = cardInput.files[0];

            if (!(image.type === "image/jpeg" || image.type === "image/jpg")) {
                await handleError("Only UNIcard accepted!");
                return;
            }

            const encodedImage = await hashImage(image);
            const reader = new FileReader();

            reader.onload = async function (event) {
                const dataURL = event.target.result;
                try {
                    const {
                        data: { text }
                    } = await Tesseract.recognize(dataURL, "eng");
                    const extractedEmail = extractEmail(text);

                    if (extractedEmail) {
                        const response = await fetch(
                            `fetchCardUser.php?email=${encodeURIComponent(extractedEmail)}`
                        );
                        const userData = await response.json();

                        if (userData && userData.imgPasswd) {
                            if (encodedImage === userData.imgPasswd) {
                                monitorScreenDiv.innerHTML = `<h1>Successful login!<br>Redirecting...</h1>`;
                                await fadeInMonitorScreen();
                                await delay(3000);
                                window.location.href = "mainPage.html";
                            } else {
                                await handleError("Invalid login credentials!");
                            }
                        } else {
                            await handleError("User not found!");
                        }
                    } else {
                        await handleError("No email found!");
                    }
                } catch (err) {
                    await handleError(`Error during recognition: ${err.message}`);
                }
            };
            reader.readAsDataURL(image);
        });
    });
}