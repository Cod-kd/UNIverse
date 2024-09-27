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
    let requiredData = ["Email cím", "Születési Dátum", "Nem", "Felhasználónév", "Jelszó"];
    let currentIndex = 0;

    monitorScreenDiv.style.gridTemplateColumns = "repeat(2, 1fr)";

    function createFormStep(index) {
        monitorScreenDiv.innerHTML = "";

        let dataHeading = document.createElement("h1");
        dataHeading.innerHTML = requiredData[index];
        dataHeading.classList.add("dataHeading");

        let btnInnerHtml = `
        <div class="round">
            <div id="cta">
                <span class="arrow primera next"></span>
                <span class="arrow segunda next"></span>
            </div>
        </div>`;

        let backBtn = document.createElement("div");
        backBtn.classList.add("center-con");
        backBtn.style.transform = "rotate(180deg)";
        backBtn.innerHTML = btnInnerHtml;

        let continueBtn = document.createElement("div");
        continueBtn.classList.add("center-con");
        continueBtn.innerHTML = btnInnerHtml;

        monitorScreenDiv.appendChild(dataHeading);

        let dataInp;
        if (index !== 2) {
            dataInp = document.createElement("input");
            dataInp.classList.add("input");
            monitorScreenDiv.appendChild(dataInp);
        }

        if (index > 0) {
            monitorScreenDiv.insertBefore(backBtn, dataHeading);
            monitorScreenDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
            backBtn.addEventListener("click", function () {
                createFormStep(index - 1);
            });
        }

        if (index < requiredData.length - 1 && index !== 2) {
            monitorScreenDiv.appendChild(continueBtn);
        } else {
            let registerBtn = document.createElement("button");
            registerBtn.classList.add("button");
            registerBtn.innerHTML = "Regisztráció";
            registerBtn.style.position = "fixed";
            registerBtn.style.top = "45%";
            if(index !== 2){
                monitorScreenDiv.appendChild(registerBtn);
            }

            registerBtn.addEventListener("click", function () {
                if (validateField(dataInp, index)) {
                    alert("Registration Complete!");
                }
            });
        }

        switch (index) {
            case 0:
                dataInp.type = "email";
                dataInp.placeholder = "Email...";
                break;
            case 1:
                dataInp.type = "text";
                dataInp.classList.add("dateInput");
                dataInp.placeholder = "Dátum: ÉÉÉÉHHNN";
                break;
            case 2:
                let radioDiv = document.createElement("div");
                radioDiv.classList.add("radio-input");

                let genders = [
                    { value: "Male", label: "Férfi" },
                    { value: "Female", label: "Nő" },
                    { value: "Other", label: "Egyéb" }
                ];

                genders.forEach((gender, i) => {
                    let label = document.createElement("label");
                    label.classList.add("label");

                    let radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = "gender-radio";
                    radio.value = gender.value;
                    radio.id = "value-" + (i + 1);
                    if (i === 0) radio.checked = true;

                    let text = document.createElement("p");
                    text.classList.add("text");
                    text.innerHTML = gender.label;

                    label.appendChild(radio);
                    label.appendChild(text);
                    radioDiv.appendChild(label);
                });

                monitorScreenDiv.appendChild(radioDiv);
                monitorScreenDiv.appendChild(continueBtn);
                break;
            case 3:
                dataInp.type = "text";
                break;
            case 4:
                dataInp.type = "password";
                break;
        }

        continueBtn.addEventListener("click", function () {
            if (index !== 2 && validateField(dataInp, index)) {
                createFormStep(index + 1);
            } else if (index === 2) {
                let selectedGender = document.querySelector('input[name="gender-radio"]:checked');
                if (selectedGender) {
                    createFormStep(index + 1);
                } else {
                    alert("Please select your gender.");
                }
            }
        });
    }

    createFormStep(currentIndex);

    function validateField(input, index) {
        let value = input.value.trim();

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

                let year = parseInt(value.slice(0, 4), 10);
                let month = parseInt(value.slice(4, 6), 10);
                let day = parseInt(value.slice(6, 8), 10);

                if (month < 1 || month > 12) {
                    alert("Invalid month. Please enter a valid date.");
                    return false;
                }
                let daysInMonth = new Date(year, month, 0).getDate();
                if (day < 1 || day > daysInMonth) {
                    alert("Invalid day. Please enter a valid date.");
                    return false;
                }

                let birthdate = new Date(year, month - 1, day);
                if (isNaN(birthdate.getTime())) {
                    alert("Please enter a valid date.");
                    return false;
                }
                break;
            case 3:
                if (value.length < 3) {
                    alert("Username must be at least 3 characters long.");
                    return false;
                }
                break;
            case 4:
                if (value.length < 6) {
                    alert("Password must be at least 6 characters long.");
                    return false;
                }
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