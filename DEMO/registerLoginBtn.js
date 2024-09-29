// DOM Elements
const registerLoginBtn = document.getElementById("registerLoginBtn");
const registerLoginBtnDiv = document.getElementById("registerLoginBtnDiv");
const monitorScreenDiv = document.getElementById("monitorScreenDiv");

// Helper function for creating delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Event listener for main button
registerLoginBtn.addEventListener("click", splitMainButton);

// Function to split the main button into Register and Login buttons
async function splitMainButton() {
    registerLoginBtn.style.transform = "scale(0)";
    registerLoginBtn.style.transition = "transform 0.5s";

    await delay(500);
    registerLoginBtn.remove();

    const buttonData = [
        { id: "registerBtn", text: "Regisztráció", initialTransform: "translateX(-200%)" },
        { id: "loginBtn", text: "Bejelentkezés", initialTransform: "translateX(200%)" }
    ];

    for (const data of buttonData) {
        const newBtn = createBasicButton(data);
        registerLoginBtnDiv.appendChild(newBtn);
        await delay(50);
        animateButton(newBtn);
        addButtonListeners(newBtn, data.id === "registerBtn");
    }
}

// Function to create a new button
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

// Function to animate button appearance
function animateButton(button) {
    button.style.transform = "translateX(0)";
    button.style.opacity = "1";
}

// Function to add event listeners to buttons
function addButtonListeners(button, isRegisterBtn) {
    button.addEventListener("mouseenter", () => button.style.transform = "scale(1.05)");
    button.addEventListener("mouseleave", () => button.style.transform = "scale(1)");
    button.addEventListener("click", async () => {
        await fadeOutMonitorScreen();
        if (isRegisterBtn) {
            monitorScreenDiv.innerHTML = '';
            renderRegistration(monitorScreenDiv);
        } else {
            renderLogin();
        }
        await fadeInMonitorScreen();
    });
}

// Functions to fade monitor screen in and out
async function fadeOutMonitorScreen() {
    monitorScreenDiv.style.opacity = "0";
    await delay(300);
}

async function fadeInMonitorScreen() {
    monitorScreenDiv.style.opacity = "1";
    await delay(300);
}

// Function to create loading animation
function createLoadingEffect(operation) {
    const registerBtnDiv = document.getElementById("registerBtnDiv");
    const lottiePlayerEl = document.getElementById("animatedButton");

    if (lottiePlayerEl) {
        handleExistingLottiePlayer(lottiePlayerEl, operation);
    } else {
        createNewLottiePlayer(registerBtnDiv);
    }
}

// Helper function to handle existing Lottie player
function handleExistingLottiePlayer(lottiePlayerEl, operation) {
    if (operation === "scale1" || operation === "scale0") {
        lottiePlayerEl.style.transform = `scale(${operation === "scale1" ? 1 : 0})`;
    } else if (operation === "rm") {
        lottiePlayerEl.remove();
    }
}

// Helper function to create a new Lottie player
function createNewLottiePlayer(registerBtnDiv) {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    registerBtnDiv.appendChild(script);

    const lottiePlayer = document.createElement("dotlottie-player");
    lottiePlayer.src = "https://lottie.host/2634e709-a42e-414a-a8b3-960be88951c0/1X6R8KP5qy.json";
    lottiePlayer.id = "animatedButton";
    lottiePlayer.setAttribute("speed", "1");
    lottiePlayer.setAttribute("autoplay", "");
    lottiePlayer.setAttribute("loop", "true");

    registerBtnDiv.appendChild(lottiePlayer);
}

// Function to create successful response effect
function createSuccessfulResponseEffect() {
    const registerBtnDiv = document.getElementById("registerBtnDiv");
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    registerBtnDiv.appendChild(script);

    const lottiePlayer = document.createElement("dotlottie-player");
    lottiePlayer.src = "https://lottie.host/3b76d474-8015-414d-91bb-4b329d0ec66a/t8k7eXc8GS.json";
    lottiePlayer.id = "responseHeadingEffect";
    lottiePlayer.setAttribute("speed", "1");
    lottiePlayer.setAttribute("autoplay", "");

    registerBtnDiv.appendChild(lottiePlayer);
}

// Function to create response heading
function createResponseHeading(operation, text) {
    const registerBtnDiv = document.getElementById("registerBtnDiv");
    let responseHeadingEl = document.getElementById("responseHeading");

    if (responseHeadingEl) {
        if (operation === "scale1") {
            responseHeadingEl.style.transform = "scale(1)";
        }
    } else {
        responseHeadingEl = document.createElement("h2");
        responseHeadingEl.id = "responseHeading";
        responseHeadingEl.innerHTML = text;
        responseHeadingEl.style.transform = "scale(0)";
        registerBtnDiv.appendChild(responseHeadingEl);
    }
}

// Function to create 404 effect
function create404Effect(operation) {
    const registerBtnDiv = document.getElementById("registerBtnDiv");
    const existing404El = document.getElementById("animated404");

    if (existing404El) {
        existing404El.style.transform = `scale(${operation === "scale1" ? 1 : 0})`;
    } else {
        createNew404Effect(registerBtnDiv);
    }
}

// Helper function to create a new 404 effect
function createNew404Effect(registerBtnDiv) {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    registerBtnDiv.appendChild(script);

    const lottiePlayer = document.createElement("dotlottie-player");
    lottiePlayer.src = "https://lottie.host/7ecd4f29-9d72-4ba1-83c7-8516c2b607dc/bwUOV026I3.json";
    lottiePlayer.id = "animated404";
    lottiePlayer.setAttribute("speed", "1");
    lottiePlayer.setAttribute("autoplay", "");
    lottiePlayer.setAttribute("loop", "true");

    lottiePlayer.style.transform = "scale(0)";
    lottiePlayer.style.transition = "transform 0.5s";

    registerBtnDiv.appendChild(lottiePlayer);

    setTimeout(() => {
        lottiePlayer.style.transform = "scale(1)";
    }, 10);
}

// Function for loading animation
async function loadingAnimation(action, duration = 0) {
    if (action !== "stop") {
        await createLoadingEffect("scale0");
        await delay(200);
        await createLoadingEffect("scale1");
        await delay(duration); // Use the duration for the loading effect
        await createLoadingEffect("scale0");
        await delay(100);
        await createLoadingEffect("rm");
    } else {
        // Stop the loading animation immediately
        await createLoadingEffect("scale0");
        await delay(100); // Optional: add a slight delay for visual effect
        await createLoadingEffect("rm");
    }
}

// Function for response animation
async function responseAnimation(status) {
    if (status === "200") {
        createResponseHeading("", "Sikeres regisztráció!");
        await delay(1000);
        createResponseHeading("scale1");
        createSuccessfulResponseEffect();
        registerBtnDiv.style.marginTop = "0%";
    } else if (status === "404") {
        await delay(1000);
        createResponseHeading("", "Hiba történt");
        createResponseHeading("scale1");
        create404Effect("scale1");
        registerBtnDiv.style.marginTop = "14%";
    }
}

// Function for creating the home button
function createHomeButton() {
    const homeBtn = document.createElement("button");
    homeBtn.id = "homeBtn";
    homeBtn.innerHTML = `<i class="fa fa-home"></i>`;
    homeBtn.addEventListener("click", async function () {
        window.location.reload();
    });
    return homeBtn;
}

// Main function to render registration form
function renderRegistration(monitorScreenDiv) {
    const requiredData = ["Email cím", "Születési Dátum", "Nem", "Felhasználónév", "Jelszó"];
    let currentIndex = 0;

    const formData = {
        email: "",
        birthDate: "",
        gender: "",
        username: "",
        passwd: "",
        imgPasswd: ""
    };

    createFormStep(currentIndex);

    // Function to create each step of the form
    async function createFormStep(index) {
        await fadeOutMonitorScreen();
        monitorScreenDiv.innerHTML = "";

        if (index < requiredData.length) {
            const dataHeading = createHeading(requiredData[index]);
            monitorScreenDiv.appendChild(dataHeading);

            const backBtn = createNavigationButton(true);
            const continueBtn = createNavigationButton(false);

            monitorScreenDiv.appendChild(createHomeButton());

            const inputDetailsDiv = document.createElement("div");
            inputDetailsDiv.id = "inputDetailsDiv";
            monitorScreenDiv.appendChild(inputDetailsDiv);

            let dataInp;

            if (index === 2) {
                const radioDiv = createGenderRadioButtons();
                monitorScreenDiv.appendChild(radioDiv);
            } else {
                dataInp = createInputField(index, formData);
                monitorScreenDiv.appendChild(dataInp);

                if (index === 4) {
                    const showBtn = createShowPasswordButton(dataInp);
                    monitorScreenDiv.appendChild(showBtn);
                }
            }

            if (index > 0) {
                monitorScreenDiv.insertBefore(backBtn, dataHeading);
                addBackButtonListener(backBtn, index, dataInp);
            }

            // Always add the continueBtn for all steps
            monitorScreenDiv.appendChild(continueBtn);
            addContinueButtonListener(continueBtn, index, dataInp);

            // Set grid layout
            monitorScreenDiv.style.gridTemplateColumns = index > 0 ? "repeat(3, 1fr)" : "500px 0px";
        } else if (index === requiredData.length) {
            createUNIverseCardStep(monitorScreenDiv);
        } else {
            createFinalRegistrationStep(monitorScreenDiv);
        }

        // Apply initial styles for fade-in effect
        const elements = monitorScreenDiv.children;
        for (let el of elements) {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        }

        // Trigger reflow to ensure the initial styles are applied
        monitorScreenDiv.offsetHeight;

        // Fade in the monitor screen and its children
        await fadeInMonitorScreen();

        // Animate the elements
        for (let el of elements) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    }

    async function createUNIverseCardStep(monitorScreenDiv) {
        await fadeOutMonitorScreen();
        monitorScreenDiv.innerHTML = "";
        monitorScreenDiv.style.gridTemplateColumns = "repeat(3, 1fr)";

        const userDataDiv = document.createElement("div");
        userDataDiv.id = "userDataDiv";
        userDataDiv.innerHTML = `
            <p>Email: ${formData.email}</p>
            <p>Username: ${formData.username}</p>
            <p>Gender: ${formData.gender}</p>
            <p>Birth Date: ${formData.birthDate.slice(0, 4)}/${formData.birthDate.slice(4, 6)}/${formData.birthDate.slice(6, 8)}</p>
            <p>Password: ************</p>
            <h1>UNIcard</h1>
        `;
        monitorScreenDiv.appendChild(userDataDiv);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save my UNIcard";
        saveButton.classList.add("button");
        saveButton.id = "saveCardBtn";
        saveButton.addEventListener("click", saveUNIcard);
        monitorScreenDiv.appendChild(saveButton);

        const backBtn = createNavigationButton(true);
        const continueBtn = createNavigationButton(false);

        monitorScreenDiv.appendChild(createHomeButton());
        monitorScreenDiv.insertBefore(backBtn, saveButton);
        monitorScreenDiv.appendChild(continueBtn);

        addBackButtonListener(backBtn, requiredData.length, null);
        addContinueButtonListener(continueBtn, requiredData.length, null);

        // Apply initial styles for fade-in effect
        const elements = monitorScreenDiv.children;
        for (let el of elements) {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        }

        // Trigger reflow to ensure the initial styles are applied
        monitorScreenDiv.offsetHeight;

        // Fade in the monitor screen
        await fadeInMonitorScreen();

        // Animate the elements
        for (let el of elements) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    }

    // Function to save the UNIcard as image named 'UNIcard.jpg'
    async function saveUNIcard() {
        const userDataDiv = document.getElementById("userDataDiv");

        // Ensure html2canvas is loaded
        if (typeof html2canvas === 'undefined') {
            console.error("html2canvas library is not loaded.");
            return;
        }

        html2canvas(userDataDiv, { backgroundColor: null })
            .then(async canvas => {
                canvas.toBlob(async function (blob) {
                    // Hash the image to HEX using the provided logic
                    const hashHexImg = await hashImage(blob);
                    formData.imgPasswd = hashHexImg;
                    const link = document.createElement("a");
                    link.download = "UNIcard.jpg"; // File name
                    link.href = URL.createObjectURL(blob);
                    document.body.appendChild(link); // Append the link element
                    link.click(); // Trigger the download
                    document.body.removeChild(link); // Remove the link element
                }, 'image/jpeg', 0.95);
            })
            .catch(err => {
                console.error("Error saving the UNIcard: ", err);
            });
    }

    // Helper functions for form creation
    function createHeading(text) {
        const heading = document.createElement("h1");
        heading.innerHTML = text;
        heading.classList.add("dataHeading");
        return heading;
    }

    function createNavigationButton(isBackButton) {
        const btn = document.createElement("div");
        btn.classList.add("center-con");
        let rotation = "0deg";
        if (isBackButton) {
            rotation = "180deg";
        };
        btn.innerHTML = `
            <div class="round" style="transform: rotate(${rotation})">
                <div id="cta">
                    <span class="arrow primera next"></span>
                    <span class="arrow segunda next"></span>
                </div>
            </div>`;
        return btn;
    }

    function createGenderRadioButtons() {
        const radioDiv = document.createElement("div");
        radioDiv.classList.add("radio-input");

        const genders = [
            { value: "Male", label: "Férfi" },
            { value: "Female", label: "Nő" },
            { value: "Other", label: "Egyéb" }
        ];

        genders.forEach((gender, i) => {
            const label = document.createElement("label");
            label.classList.add("label");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "gender-radio";
            radio.value = gender.value;
            radio.id = "value-" + (i + 1);

            if (formData.gender === gender.value) {
                radio.checked = true;
            } else if (!formData.gender && i === 0) {
                radio.checked = true;
            }

            const text = document.createElement("p");
            text.classList.add("text");
            text.innerHTML = gender.label;

            label.appendChild(radio);
            label.appendChild(text);
            radioDiv.appendChild(label);
        });

        return radioDiv;
    }

    function createInputField(index, formData) {
        const dataInp = document.createElement("input");
        dataInp.classList.add("input");

        dataInp.style.transition = "all 0.3s ease";
        dataInp.addEventListener("mouseover", () => {
            dataInp.style.transform = "scale(1.05)";
            dataInp.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
        });
        dataInp.addEventListener("mouseout", () => {
            dataInp.style.transform = "scale(1)";
            dataInp.style.boxShadow = "none";
        });

        switch (index) {
            case 0:
                dataInp.type = "email";
                dataInp.id = "emailInput";
                dataInp.placeholder = "Email...";
                dataInp.value = formData.email;
                dataInp.addEventListener("input", function (e) {
                    const email = e.target.value;
                    const conditions = validateEmail(email);
                    updateValidation(conditions);
                });
                break;
            case 1:
                dataInp.type = "text";
                dataInp.id = "dateInput";
                dataInp.placeholder = "Dátum: ÉÉÉÉHHNN";
                dataInp.value = formData.birthDate;
                dataInp.addEventListener("input", function (e) {
                    const birthDate = e.target.value;
                    const conditions = validateBirthDate(birthDate);
                    updateValidation(conditions);
                })
                break;
            case 3:
                dataInp.type = "text";
                dataInp.placeholder = "@";
                dataInp.id = "usernameInput";
                dataInp.value = formData.username;
                dataInp.addEventListener("input", function (e) {
                    const username = e.target.value;
                    const conditions = validateUsername(username);
                    updateValidation(conditions);
                });
                break;
            case 4:
                dataInp.type = "password";
                dataInp.placeholder = "******";
                dataInp.id = "passwordInput";
                dataInp.value = formData.passwd;
                inputDetailsDiv.style.top = "14%";
                inputDetailsDiv.style.right = "32%";
                dataInp.addEventListener("input", function (e) {
                    const password = e.target.value;
                    const conditions = validatePassword(password);
                    updateValidation(conditions);
                });
                break;
        }

        return dataInp;
    }

    function createShowPasswordButton(passwordInput) {
        const showBtn = document.createElement("button");
        showBtn.id = "showBtn";
        showBtn.classList.add("button");
        showBtn.innerHTML = "Show";

        showBtn.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                showBtn.innerText = "Hide";
            } else {
                passwordInput.type = "password";
                showBtn.innerText = "Show";
            }
        });

        return showBtn;
    }

    function addBackButtonListener(backBtn, index, dataInp) {
        backBtn.addEventListener("click", async function () {
            if (index === requiredData.length + 1) {
                // We're on the final registration step, go back to UNIcard
                await fadeOutMonitorScreen();
                createUNIverseCardStep(monitorScreenDiv);
            } else if (index === requiredData.length) {
                // We're on the UNIcard step, go back to password step
                await fadeOutMonitorScreen();
                createFormStep(index - 1);
            } else {
                // For all other steps
                updateFormData(index, dataInp);
                createFormStep(index - 1);
            }
        });
    }

    function addContinueButtonListener(continueBtn, index, dataInp) {
        continueBtn.addEventListener("click", async function () {
            if (index === requiredData.length) {
                // We're on the UNIcard step, move to final registration step
                await fadeOutMonitorScreen();
                createFinalRegistrationStep(monitorScreenDiv);
            } else if (index === 2) {
                // For the gender selection step
                const selectedGender = document.querySelector('input[name="gender-radio"]:checked');
                if (selectedGender) {
                    formData.gender = selectedGender.value;
                    createFormStep(index + 1);
                } else {
                    alert("Please select your gender.");
                }
            } else {
                // For all other steps
                if (validateField(dataInp, index)) {
                    updateFormData(index, dataInp);
                    createFormStep(index + 1);
                }
            }
        });
    }

    function addFinalRegisterButtonListener(registerBtn) {
        registerBtn.addEventListener("click", async function () {
            try {
                await fadeOutMonitorScreen();
                monitorScreenDiv.innerHTML = '';
                const registerBtnDiv = document.createElement("div");
                registerBtnDiv.id = "registerBtnDiv";
                registerBtnDiv.style.top = "-10%";
                monitorScreenDiv.appendChild(registerBtnDiv);
                registerBtn.style.transform = "scale(0)";
                await fadeInMonitorScreen();
                await delay(600);
                registerBtn.remove();
                registerBtnDiv.style.marginTop = "22%";

                // Start loading animation
                const loadingStart = performance.now();
                await loadingAnimation();

                // Make the fetch request
                const response = await fetch("createProfile.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                // Stop loading animation
                const loadingEnd = performance.now();
                const duration = Math.max(loadingEnd - loadingStart, 0);
                await loadingAnimation("stop", duration);

                if (response.ok) {
                    await responseAnimation("200");
                } else {
                    await responseAnimation("404");
                }

                const data = await response.text();
                console.log(data);
            } catch (err) {
                console.error("Error: ", err);
                await loadingAnimation("stop");
                await responseAnimation("404");
            }
        });
    }

    async function createFinalRegistrationStep(monitorScreenDiv) {
        await fadeOutMonitorScreen();
        monitorScreenDiv.innerHTML = ``;
        monitorScreenDiv.style.gridTemplateColumns = "";
        monitorScreenDiv.style.gap = "0px";

        const registerBtnDiv = document.createElement("div");
        registerBtnDiv.id = "registerBtnDiv";
        const registerBtn = document.createElement("button");
        registerBtn.id = "registerBtn";
        registerBtn.classList.add("button");
        registerBtn.innerHTML = "Regisztráció";
        registerBtnDiv.appendChild(registerBtn);
        monitorScreenDiv.appendChild(registerBtnDiv);

        const backBtn = createNavigationButton(true);
        monitorScreenDiv.appendChild(backBtn);

        addBackButtonListener(backBtn, requiredData.length + 1, null);
        addFinalRegisterButtonListener(registerBtn);

        await fadeInMonitorScreen();
    }

    // Helper function to update form data
    function updateFormData(index, dataInp) {
        switch (index) {
            case 0:
                formData.email = dataInp.value.trim();
                break;
            case 1:
                formData.birthDate = dataInp.value.trim();
                break;
            case 3:
                formData.username = dataInp.value.trim();
                break;
            case 4:
                formData.passwd = dataInp.value.trim();
                break;
        }
    }

    // Function to validate form fields
    function validateField(input, index) {
        if (!input) return true; // For gender selection, which doesn't have an input field

        const value = input.value.trim();

        switch (index) {
            // Email
            case 0:
                const emailConditions = validateEmail(value);
                if (Object.keys(emailConditions).length > 0) {
                    updateValidation(emailConditions);
                    return false;
                }
                break;
            // Birth date
            case 1:
                const birthDateConditions = validateBirthDate(value);
                if (Object.keys(birthDateConditions).length > 0) {
                    updateValidation(birthDateConditions);
                    return false;
                }
                break;
            // Username
            case 3:
                const usernameConditions = validateUsername(value);
                if (Object.keys(usernameConditions).length > 0) {
                    updateValidation(usernameConditions);
                    return false;
                }
                break;
            // Password
            case 4:
                const passwordConditions = validatePassword(value);
                if (Object.keys(passwordConditions).length > 0) {
                    updateValidation(passwordConditions);
                    return false;
                }
                break;
        }

        updateValidation({}); // Clear any existing validation messages
        return true;
    }

    // Validation functions
    function validateEmail(email) {
        let conditions = {};

        if (!email.includes('@')) {
            conditions.atSymbol = '-Tartalmaz @-ot';
        }

        if (email.split('@')[0].length === 0) {
            conditions.prefix = '-Tartalmaz szöveget @ előtt';
        }

        const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.split('@')[1] || !domainPattern.test(email.split('@')[1])) {
            conditions.domain = '-Tartalmaz domain-t';
        }

        return conditions;
    }

    function validateBirthDate(birthDate) {
        let conditions = {};

        // Ensure birthDate is 8 characters long
        if (birthDate.length !== 8) {
            conditions.length = '-8 karakter hosszú';
        }

        const year = parseInt(birthDate.slice(0, 4), 10);
        const month = parseInt(birthDate.slice(4, 6), 10);
        const day = parseInt(birthDate.slice(6, 8), 10);

        // Validate year, month, and day
        if (isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
            conditions.validDate = '-Nem megfelelő formátum (ÉÉÉÉHHNN)';
        }

        // Handle leap year and days in each month
        const daysInMonth = [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (day > daysInMonth[month - 1]) {
            conditions.validDay = '-Hibás nap az adott hónapban';
        }

        const today = new Date();
        const birthDateObj = new Date(year, month - 1, day);

        // Check birth date is not in the future
        if (birthDateObj > today) {
            conditions.futureDate = '-Nem jövőbeli dátum';
        }

        // Calculate age
        const age = today.getFullYear() - year - (today < new Date(today.getFullYear(), month - 1, day) ? 1 : 0);

        // Validate age is between 18 and 100
        if (age < 18 || age > 100) {
            conditions.age = '-Életkor 18 és 100 közötti';
        }

        return conditions;
    }

    function validateUsername(username) {
        let conditions = {};

        // Check length constraints (must be between 8 and 20 characters)
        if (username.length < 8) {
            conditions.length = '-Minimum 8 karakter hosszú';
        } else if (username.length > 20) {
            conditions.length = '-Maximum 20 karakter hosszú';
        }

        // Check allowed characters (letters, digits, hyphen, underscore)
        const usernamePattern = /^[A-Za-z0-9_-]+$/;
        if (!usernamePattern.test(username)) {
            conditions.invalidChars = '-Tartalmazhat (szám, betű, -, _)';
        }

        return conditions;
    }

    function validatePassword(password) {
        let conditions = {};

        if (password.length < 12) {
            conditions.length = '-Minimum 12 karakter hosszú';
        } else if (password.length > 36) {
            conditions.length = '-Maximum 36 karakter hosszú';
        }

        if (!/[0-9]/.test(password)) {
            conditions.hasNumber = '-Legalább egy számjegy';
        }

        if (!/[!@#$%^&*()\-_=+]/.test(password)) {
            conditions.hasSpecialChar = '-Legalább egy speciális karakter';
        }

        return conditions;
    }

    function createDetailP(text, condition) {
        const inputDetailsDiv = document.getElementById("inputDetailsDiv");
        let existingP = Array.from(inputDetailsDiv.querySelectorAll("p")).find(p => p.dataset.condition === condition);

        if (existingP) {
            if (text) {
                existingP.innerHTML = text;
                existingP.style.animation = "appear 0.5s forwards ease";
                existingP.style.display = "block";
            } else {
                existingP.style.animation = "disappear 0.5s forwards ease";
                setTimeout(() => {
                    existingP.remove();
                }, 500);
            }
        } else if (text) {
            let newDetailP = document.createElement("p");
            newDetailP.innerHTML = text;
            newDetailP.dataset.condition = condition;
            inputDetailsDiv.appendChild(newDetailP);
            newDetailP.style.animation = "appear 0.5s forwards ease";
        }
    }

    function updateValidation(conditions) {
        const inputDetailsDiv = document.getElementById("inputDetailsDiv");

        Array.from(inputDetailsDiv.querySelectorAll("p")).forEach(p => {
            if (!(p.dataset.condition in conditions)) {
                createDetailP('', p.dataset.condition);
            }
        });

        // Now update or create new conditions
        for (let condition in conditions) {
            createDetailP(conditions[condition], condition);
        }
    }
}

// Function to configure arrow buttons
function arrowBtnsConfig() {
    const roundElement = document.querySelector('.round');
    const arrows = document.querySelectorAll('.arrow');
    if (roundElement) {
        roundElement.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            arrows.forEach(arrow => {
                arrow.classList.toggle('bounceAlpha');
            });
        });
    }
}

// Hashing function for the image
async function hashImage(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Function to render login (placeholder for now)
function renderLogin() {
    console.log("Login rendering not implemented yet");
}

// Initialize the script
document.addEventListener('DOMContentLoaded', () => {
    arrowBtnsConfig();
});