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

    // Initialize formData to store user inputs
    const formData = {
        email: "",
        birthDate: "",
        gender: "",
        username: "",
        password: ""
    };

    // Initial grid layout
    monitorScreenDiv.style.gridTemplateColumns = "500px 100px";

    function createFormStep(index) {
        monitorScreenDiv.innerHTML = "";

        // Create and append the heading for the current step
        const dataHeading = document.createElement("h1");
        dataHeading.innerHTML = requiredData[index];
        dataHeading.classList.add("dataHeading");
        monitorScreenDiv.appendChild(dataHeading);

        // Define the inner HTML for buttons
        const btnInnerHtml = `
            <div class="round">
                <div id="cta">
                    <span class="arrow primera next"></span>
                    <span class="arrow segunda next"></span>
                </div>
            </div>`;

        // Create Back Button
        const backBtn = document.createElement("div");
        backBtn.classList.add("center-con");
        backBtn.style.transform = "rotate(180deg)";
        backBtn.innerHTML = btnInnerHtml;

        // Create Continue Button
        const continueBtn = document.createElement("div");
        continueBtn.classList.add("center-con");
        continueBtn.innerHTML = btnInnerHtml;

        let dataInp; // To store the current input element

        if (index === 3) { // Felhasználónév (Username)
            dataInp = document.createElement("input");
            dataInp.type = "text";
            dataInp.placeholder = "@";
            dataInp.id = "usernameInput";
            dataInp.classList.add("input");
            dataInp.value = formData.username; // Populate with existing data
            monitorScreenDiv.appendChild(dataInp);
        }
        else if (index === 2) { // Nem (Gender)
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

                // Check if this gender was previously selected
                if (formData.gender === gender.value) {
                    radio.checked = true;
                } else if (!formData.gender && i === 0) {
                    // Default to first option if no selection yet
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
        else { // Email, Birth Date, Password
            dataInp = document.createElement("input");
            dataInp.classList.add("input");

            // Set input type and placeholder based on index
            switch (index) {
                case 0:
                    dataInp.type = "email";
                    dataInp.id = "emailInput";
                    dataInp.placeholder = "Email...";
                    dataInp.value = formData.email; // Populate with existing data
                    break;
                case 1:
                    dataInp.type = "text";
                    dataInp.classList.add("dateInput");
                    dataInp.placeholder = "Dátum: ÉÉÉÉHHNN";
                    dataInp.value = formData.birthDate; // Populate with existing data
                    break;
                case 4:
                    dataInp.type = "password";
                    dataInp.placeholder = "******"; // Updated placeholder
                    dataInp.id = "passwordInput"; // Added id for consistency
                    dataInp.value = formData.password; // Populate with existing data

                    const showBtn = document.createElement("button");
                    showBtn.id = "showBtn";
                    monitorScreenDiv.appendChild(showBtn);

                    // Toggle password visibility
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

        // Add Back Button if not the first step
        if (index > 0) {
            monitorScreenDiv.insertBefore(backBtn, dataHeading);
            monitorScreenDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
            backBtn.addEventListener("click", function () {
                // Save the current field value before navigating back
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
                        formData.password = dataInp.value.trim(); // Save password when navigating back
                        break;
                }

                createFormStep(index - 1);
            });
        }

        // Determine whether to show Continue or Register button
        if (index < requiredData.length - 1 && index !== 2) {
            monitorScreenDiv.appendChild(continueBtn);
        } else if (index !== 2) {
            const registerBtn = document.createElement("button");
            registerBtn.classList.add("button");
            registerBtn.innerHTML = "Regisztráció";
            registerBtn.style.position = "fixed";
            registerBtn.style.top = "45%";
            monitorScreenDiv.appendChild(registerBtn);

            registerBtn.addEventListener("click", function () {
                if (validateField(dataInp, index)) {
                    alert("Registration Complete!");
                    console.log("Form Data:", formData);
                    // Here you can handle form submission, e.g., send data to a server
                }
            });
        }

        // Handle Continue Button Click
        if (index !== 2) { // For all steps except Gender
            continueBtn.addEventListener("click", function () {
                // Save current input value to formData
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
                        formData.password = dataInp.value.trim(); // Save password before moving to the next step
                        break;
                }

                if (validateField(dataInp, index)) {
                    createFormStep(index + 1);
                }
            });
        } else { // For Gender step
            continueBtn.addEventListener("click", function () {
                const selectedGender = document.querySelector('input[name="gender-radio"]:checked');
                if (selectedGender) {
                    formData.gender = selectedGender.value; // Save selected gender
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
            case 0: // Email
                if (!validateEmail(value)) {
                    alert("Please enter a valid email address.");
                    return false;
                }
                break;
            case 1: // Birth Date
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
            case 3: // Username
                if (!value) {
                    alert("Please enter a username.");
                    return false;
                }
                break;
            case 4: // Password
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