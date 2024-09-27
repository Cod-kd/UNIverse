let registerLoginBtn = document.getElementById("registerLoginBtn");
let registerLoginBtnDiv = document.getElementById("registerLoginBtnDiv");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

registerLoginBtn.addEventListener("click", function () {
    splitMainButton();
});

async function splitMainButton() {
    registerLoginBtn.style.transform = "scale(0)";
    registerLoginBtn.style.transition = "transform 0.5s";

    await delay(500);

    registerLoginBtn.remove();

    for (let i = 0; i < 2; i++) {
        let newBtn = document.createElement("button");
        newBtn.classList.add("button");
        newBtn.style.position = "relative";
        newBtn.style.opacity = "0";

        if (i === 0) {
            newBtn.id = "registerBtn";
            newBtn.innerHTML = "Regisztráció";
            newBtn.style.transform = "translateX(-200%)";
        } else {
            newBtn.id = "loginBtn";
            newBtn.innerHTML = "Bejelentkezés";
            newBtn.style.transform = "translateX(200%)";
        }

        registerLoginBtnDiv.appendChild(newBtn);
        await delay(50);

        newBtn.style.transform = "translateX(0)";
        newBtn.style.opacity = "1";

        newBtn.addEventListener("mouseenter", function () {
            newBtn.style.transform = "scale(1.05)";
        });

        newBtn.addEventListener("mouseleave", function () {
            newBtn.style.transform = "scale(1)";
        });

        newBtn.addEventListener("click", async function () {
            let monitorScreenDiv = document.getElementById("monitorScreenDiv");
            await delay(200);
            monitorScreenDiv.style.opacity = "0";
            await delay(300)
            if (i === 0) {
                monitorScreenDiv.innerHTML = ``;
                renderRegistration(monitorScreenDiv);
            }
            else {
                renderLogin();
            }
            await delay(300);
            monitorScreenDiv.style.opacity = "1";
        });
    }
}

function createLoadingEffect(operation) {
    let registerBtnDiv = document.getElementById("registerBtnDiv");
    const lottiePlayerEl = document.getElementById("animatedButton");
    if (lottiePlayerEl) {
        if (operation === "scale1") {
            lottiePlayerEl.style.transform = "scale(1)";
        } else if (operation === "scale0") {
            lottiePlayerEl.style.transform = "scale(0)";
        } else if (operation === "rm") {
            lottiePlayerEl.remove();
        }
    } else {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
        script.type = "module";
        registerBtnDiv.appendChild(script);

        const lottiePlayer = document.createElement("dotlottie-player");
        lottiePlayer.src = "https://lottie.host/5a23c118-b29a-403d-9196-57df56d6dc91/k24i6KKQbo.json";
        lottiePlayer.id = "animatedButton";
        lottiePlayer.setAttribute("speed", "1");
        lottiePlayer.setAttribute("autoplay", "");
        lottiePlayer.setAttribute("loop", "true")

        registerBtnDiv.appendChild(lottiePlayer);
    }
}

function createSuccessfulResponseEffect() {
    let registerBtnDiv = document.getElementById("registerBtnDiv");
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

function createResponseHeading(operation, text) {
    let registerBtnDiv = document.getElementById("registerBtnDiv");
    let responseHeadingEl = document.getElementById("responseHeading");
    if (responseHeadingEl) {
        if (operation === "scale1") {
            responseHeadingEl.style.transform = "scale(1)";
        }
    } else {
        let responseHeading = document.createElement("h2");
        responseHeading.id = "responseHeading";
        responseHeading.innerHTML = text;
        responseHeading.style.transform = "scale(0)";
        registerBtnDiv.appendChild(responseHeading);
    }
}

function create404Effect(operation) {
    let registerBtnDiv = document.getElementById("registerBtnDiv");
    const existing404El = document.getElementById("animated404");

    if (existing404El) {
        if (operation === "scale1") {
            existing404El.style.transform = "scale(1)";
        } else if (operation === "scale0") {
            existing404El.style.transform = "scale(0)";
        }
    } else {
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
}

async function loadingAnimation(duration) {
    await createLoadingEffect("scale0");
    await delay(200);
    await createLoadingEffect("scale1");
    await delay(duration);
    await createLoadingEffect("scale0");
    await delay(100);
    await createLoadingEffect("rm");
}

async function responseAnimation(status) {
    if (status === "200") {
        createResponseHeading("", "Sikeres regisztráció!");
        await delay(1000);
        createResponseHeading("scale1");
        createSuccessfulResponseEffect();
    } else if (status === "404") {
        await create404Effect("scale1");
    }
}

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

    monitorScreenDiv.style.gridTemplateColumns = "500px 100px";

    async function createFormStep(index) {
        monitorScreenDiv.style.opacity = "0";
        await delay(200);
        monitorScreenDiv.innerHTML = "";
        await delay(200);
        monitorScreenDiv.style.opacity = "1";

        const dataHeading = document.createElement("h1");
        dataHeading.innerHTML = requiredData[index];
        dataHeading.classList.add("dataHeading");
        monitorScreenDiv.appendChild(dataHeading);

        const btnInnerHtml = `
            <div class="round">
                <div id="cta">
                    <span class="arrow primera next"></span>
                    <span class="arrow segunda next"></span>
                </div>
            </div>`;

        const backBtn = document.createElement("div");
        backBtn.classList.add("center-con");
        backBtn.style.transform = "rotate(180deg)";
        backBtn.innerHTML = btnInnerHtml;

        const continueBtn = document.createElement("div");
        continueBtn.classList.add("center-con");
        continueBtn.innerHTML = btnInnerHtml;

        let dataInp;

        if (index === 3) {
            dataInp = document.createElement("input");
            dataInp.type = "text";
            dataInp.placeholder = "@";
            dataInp.id = "usernameInput";
            dataInp.classList.add("input");
            dataInp.value = formData.username;
            monitorScreenDiv.appendChild(dataInp);
        }
        else if (index === 2) {
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

            monitorScreenDiv.appendChild(radioDiv);
            monitorScreenDiv.appendChild(continueBtn);
        }
        else {
            dataInp = document.createElement("input");
            dataInp.classList.add("input");

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
                case 4:
                    dataInp.type = "password";
                    dataInp.placeholder = "******";
                    dataInp.id = "passwordInput";
                    dataInp.value = formData.password;

                    const showBtn = document.createElement("button");
                    showBtn.id = "showBtn";
                    showBtn.classList.add("button");
                    showBtn.innerHTML = "Show";
                    monitorScreenDiv.appendChild(showBtn);

                    showBtn.addEventListener("click", function () {
                        if (dataInp.type === "password") {
                            dataInp.type = "text";
                            showBtn.innerText = "Hide";
                        } else {
                            dataInp.type = "password";
                            showBtn.innerText = "Show";
                        }
                    });

                    break;
            }

            monitorScreenDiv.appendChild(dataInp);
        }

        if (index > 0) {
            monitorScreenDiv.insertBefore(backBtn, dataHeading);
            monitorScreenDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
            backBtn.addEventListener("click", function () {
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

                createFormStep(index - 1);
            });
        }

        if (index < requiredData.length - 1 && index !== 2) {
            monitorScreenDiv.appendChild(continueBtn);
        } else if (index !== 2 && !document.getElementById("registerBtnDiv")) { // Ensure it only exists once
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
                    // Completed registration
                    let success = true;
                    monitorScreenDiv.style.opacity = "0";
                    await delay(200);
                    monitorScreenDiv.innerHTML = ``;
                    registerBtnDiv.style.top = "-10%"
                    monitorScreenDiv.appendChild(registerBtnDiv); // Reattach the original button div
                    registerBtn.style.transform = "scale(0)";
                    monitorScreenDiv.style.opacity = "1";
                    await delay(600);
                    registerBtn.remove();
                    await loadingAnimation(3000);
                    if (success) {
                        await responseAnimation("200");
                    }
                    else {
                        await responseAnimation("404");
                    }
                }
            });
        }

        if (index !== 2) {
            continueBtn.addEventListener("click", function () {
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

                if (validateField(dataInp, index)) {
                    createFormStep(index + 1);
                }
            });
        } else {
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
    }

    createFormStep(currentIndex);

    function validateField(input, index) {
        const value = input.value.trim();

        switch (index) {
            case 0:
                if (!validateEmail(value)) {
                    alert("Please enter a valid email address.");
                    return false;
                }
                break;
            case 1:
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
            default:
                break;
        }

        return true;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}

function arrowBtnsConfig() {
    const roundElement = document.querySelector('.round');
    const arrows = document.querySelectorAll('.arrow');
    roundElement.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        arrows.forEach(arrow => {
            arrow.classList.toggle('bounceAlpha');
        });
    });
}

function renderLogin() {
    let loginBtn = document.getElementById("loginBtn");
}