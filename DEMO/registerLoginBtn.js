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
        } else if (index !== 2) {
            const registerBtn = document.createElement("button");
            registerBtn.classList.add("button");
            registerBtn.innerHTML = "Regisztráció";
            registerBtn.style.position = "fixed";
            registerBtn.style.top = "45%";
            monitorScreenDiv.appendChild(registerBtn);

            registerBtn.addEventListener("click", async function () {
                if (validateField(dataInp, index)) {
                    // Completed registration
                    await delay(200);
                    monitorScreenDiv.style.opacity = "0";
                    await delay(200);
                    monitorScreenDiv.innerHTML = "Successful registration!";
                    await delay(200);
                    monitorScreenDiv.style.opacity = "1";
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