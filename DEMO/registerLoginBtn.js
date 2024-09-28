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
async function loadingAnimation(duration) {
    await createLoadingEffect("scale0");
    await delay(200);
    await createLoadingEffect("scale1");
    await delay(duration);
    await createLoadingEffect("scale0");
    await delay(100);
    await createLoadingEffect("rm");
}

// Function for response animation
async function responseAnimation(status) {
    if (status === "200") {
        createResponseHeading("", "Sikeres regisztráció!");
        await delay(1000);
        createResponseHeading("scale1");
        createSuccessfulResponseEffect();
        registerBtnDiv.style.marginTop = "20%";
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
        password: ""
    };

    createFormStep(currentIndex);

    // Function to create each step of the form
    async function createFormStep(index) {
        await fadeOutMonitorScreen();
        monitorScreenDiv.innerHTML = "";

        const dataHeading = createHeading(requiredData[index]);
        monitorScreenDiv.appendChild(dataHeading);

        const backBtn = createNavigationButton(true);
        const continueBtn = createNavigationButton(false);

        monitorScreenDiv.appendChild(createHomeButton());

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

        // Always add the continueBtn for all steps except the last one
        if (index < requiredData.length - 1) {
            monitorScreenDiv.appendChild(continueBtn);
        }

        // Set grid layout
        monitorScreenDiv.style.gridTemplateColumns = index > 0 ? "repeat(3, 1fr)" : "500px 0px";

        if (index === requiredData.length - 1 && !document.getElementById("registerBtnDiv")) {
            createFinalRegisterButton(monitorScreenDiv, dataInp, index);
        }

        if (index !== 2) {
            addContinueButtonListener(continueBtn, index, dataInp);
        } else {
            addGenderContinueButtonListener(continueBtn, index);
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
                break;
            case 1:
                dataInp.type = "text";
                dataInp.classList.add("dateInput");
                dataInp.placeholder = "Dátum: ÉÉÉÉHHNN";
                dataInp.value = formData.birthDate;
                break;
            case 3:
                dataInp.type = "text";
                dataInp.placeholder = "@";
                dataInp.id = "usernameInput";
                dataInp.value = formData.username;
                break;
            case 4:
                dataInp.type = "password";
                dataInp.placeholder = "******";
                dataInp.id = "passwordInput";
                dataInp.value = formData.password;
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
        backBtn.addEventListener("click", function () {
            updateFormData(index, dataInp);
            createFormStep(index - 1);
        });
    }

    function addContinueButtonListener(continueBtn, index, dataInp) {
        continueBtn.addEventListener("click", function () {
            if (validateField(dataInp, index)) {
                updateFormData(index, dataInp);
                createFormStep(index + 1);
            }
        });
    }

    function addGenderContinueButtonListener(continueBtn, index) {
        continueBtn.addEventListener("click", function () {
            const selectedGender = document.querySelector('input[name="gender-radio"]:checked');
            if (selectedGender) {
                formData.gender = selectedGender.value;
                createFormStep(index + 1);
            } else {
                alert("Please select your gender.");
            }
        });
    }

    function createFinalRegisterButton(monitorScreenDiv, dataInp, index) {
        const registerBtnDiv = document.createElement("div");
        const registerBtn = document.createElement("button");

        registerBtnDiv.id = "registerBtnDiv";
        registerBtn.id = "registerBtn";
        registerBtn.classList.add("button");
        registerBtn.innerHTML = "Regisztráció";
        registerBtnDiv.style.position = "fixed";
        registerBtnDiv.style.top = "5%";
        registerBtnDiv.appendChild(registerBtn);
        monitorScreenDiv.appendChild(registerBtnDiv);

        registerBtn.addEventListener("click", async function () {
            if (validateField(dataInp, index)) {
                let success = true; // This should be replaced with actual API call result
                await fadeOutMonitorScreen();
                monitorScreenDiv.innerHTML = '';
                registerBtnDiv.style.top = "-10%";
                monitorScreenDiv.appendChild(registerBtnDiv);
                registerBtn.style.transform = "scale(0)";
                await fadeInMonitorScreen();
                await delay(600);
                registerBtn.remove();
                registerBtnDiv.style.marginTop = "22%";
                await loadingAnimation(3000);
                await responseAnimation(success ? "200" : "404");
            }
        });
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
                formData.password = dataInp.value.trim();
                break;
        }
    }

    // Function to validate form fields
    function validateField(input, index) {
        if (!input) return true; // For gender selection, which doesn't have an input field

        const value = input.value.trim();

        switch (index) {
            case 0:
                if (!validateEmail(value)) {
                    alert("Please enter a valid email address.");
                    return false;
                }
                break;
            case 1:
                if (!validateBirthDate(value)) {
                    return false;
                }
                break;
            case 3:
                if (!value) {
                    alert("Please enter a username.");
                    return false;
                }
                break;
            case 4:
                if (!value || value.length < 6) {
                    alert("Password must be at least 6 characters long.");
                    return false;
                }
                break;
        }

        return true;
    }

    // Helper function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Helper function to validate birth date
    function validateBirthDate(value) {
        if (!value) {
            alert("Please enter your birth date.");
            return false;
        }
        if (!/^\d{8}$/.test(value)) {
            alert("Please enter the date in the format ÉÉÉÉHHNN.");
            return false;
        }

        const year = parseInt(value.slice(0, 4), 10);
        const month = parseInt(value.slice(4, 6), 10);
        const day = parseInt(value.slice(6, 8), 10);

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            alert("Please enter a valid date.");
            return false;
        }
        return true;
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

// Function to render login (placeholder for now)
function renderLogin() {
    console.log("Login rendering not implemented yet");
}

// Initialize the script
document.addEventListener('DOMContentLoaded', () => {
    arrowBtnsConfig();
});