function renderRegistration() {
    const requiredData = [
        "Email cím",
        "Születési Dátum",
        "Nem",
        "Felhasználónév",
        "Jelszó",
        "Aláírás",
        "Egyetem",
        "Egyetemi kar"
    ];
    let currentIndex = 0;

    const formData = {
        email: "",
        birthDate: "",
        gender: "",
        username: "",
        passwd: "",
        imgPasswd: "",
        signature: null,
        universityName: "",
        facultyName: ""
    };

    createFormStep(currentIndex);

    async function createFormStep(index) {
        await fadeOutMonitorScreen();
        monitorScreenDiv.innerHTML = ``;

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
            } else if (index === 5) {
                const signatureDiv = document.createElement("div");
                signatureDiv.id = "signatureDiv";
                signatureDiv.innerHTML = `
                    <canvas id="signatureCanvas"></canvas>
                    <button id="resetCanvasBtn">Reset</button>`;
                monitorScreenDiv.appendChild(signatureDiv);
                continueBtn.querySelector("#continueBtn").style.opacity = "0.5";
                continueBtn.querySelector("#continueBtn").style.pointerEvents = "none";
                setupSignatureCanvas();
            } else if (index === 6) {
                const uniSelect = createUniversitySelect();
                monitorScreenDiv.appendChild(uniSelect);
            } else if (index === 7) {
                // Create faculty select based on selected university
                const facultySelect = createFacultySelect();
                monitorScreenDiv.appendChild(facultySelect);
            } else {
                dataInp = createInputField(index);
                monitorScreenDiv.appendChild(dataInp);

                if (index === 4) {
                    monitorScreenDiv.appendChild(createShowBtn(passwordInput));
                }
            }

            if (index > 0) {
                monitorScreenDiv.insertBefore(backBtn, dataHeading);
                addBackButtonListener(index, dataInp);
            }

            monitorScreenDiv.appendChild(continueBtn);
            addContinueButtonListener(index, dataInp);

            monitorScreenDiv.style.gridTemplateColumns =
                index > 0 ? "repeat(3, 1fr)" : "500px 0px";
        } else if (index === requiredData.length) {
            createUNIverseCardStep(monitorScreenDiv);
        } else {
            createFinalRegistrationStep();
        }

        const elements = monitorScreenDiv.children;
        for (let el of elements) {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        }

        monitorScreenDiv.offsetHeight;

        await fadeInMonitorScreen();

        for (let el of elements) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    }

    function validateEmail(email) {
        let conditions = {};

        if (!email.includes("@")) {
            conditions.atSymbol = "-Tartalmaz @-ot";
        }

        if (email.split("@")[0].length === 0) {
            conditions.prefix = "-Tartalmaz szöveget @ előtt";
        }

        const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.split("@")[1] || !domainPattern.test(email.split("@")[1])) {
            conditions.domain = "-Tartalmaz domain-t";
        }

        return conditions;
    }

    function validateUsername(username) {
        let conditions = {};

        if (username.length < 8) {
            conditions.length = "-Minimum 8 karakter hosszú";
        } else if (username.length > 20) {
            conditions.length = "-Maximum 20 karakter hosszú";
        }

        const usernamePattern = /^[A-Za-z0-9_-]+$/;
        if (!usernamePattern.test(username)) {
            conditions.invalidChars = "-Tartalmazhat (szám, betű, -, _)";
        }

        return conditions;
    }

    function updateValidation(conditions) {
        const inputDetailsDiv = document.getElementById("inputDetailsDiv");

        Array.from(inputDetailsDiv.querySelectorAll("p")).forEach((p) => {
            if (!(p.dataset.condition in conditions)) {
                createDetailP("", p.dataset.condition);
            }
        });

        for (let condition in conditions) {
            createDetailP(conditions[condition], condition);
        }
    }

    async function handleGenericValidation(value, type, dataInp) {
        const validationFunctions = {
            email: validateEmail,
            username: validateUsername
        };

        const checkExistingUrl = "checkExistence.php";

        const conditions = validationFunctions[type](value);

        if (Object.keys(conditions).length > 0) {
            updateValidation(conditions);
            return false;
        }

        const isChecked = type === "email" ? isEmailChecked : isUsernameChecked;
        const lastChecked =
            type === "email" ? lastCheckedEmail : lastCheckedUsername;

        if (isChecked && value === lastChecked) {
            createResponseWindow(
                `${type.charAt(0).toUpperCase() + type.slice(1)} already exists`
            );
            return false;
        }

        try {
            const response = await fetch(checkExistingUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, value })
            });

            if (!response.ok) {
                createResponseWindow(`Server error: ${response.status}`);
                return false;
            }

            const data = await response.json();

            if (type === "email") {
                isEmailChecked = data.exists;
                lastCheckedEmail = value;
            } else {
                isUsernameChecked = data.exists;
                lastCheckedUsername = value;
            }

            if (data.exists) {
                createResponseWindow(
                    `${type.charAt(0).toUpperCase() + type.slice(1)} already exists`
                );
                return false;
            } else {
                updateFormData(type === "email" ? 0 : 3, dataInp);
                return true;
            }
        } catch (error) {
            createResponseWindow(`${type} check error: ${error.message}`);
            await responseAnimation("error");
            return false;
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
              <p>Birth Date: ${formData.birthDate.slice(
            0,
            4
        )}/${formData.birthDate.slice(4, 6)}/${formData.birthDate.slice(
            6,
            8
        )}</p>
              <p>Password: ************</p>
              <hr>
              <div>
                  <h1>UNIcard</h1>
                  <img id="signatureImg" src="${formData.signature
            }" alt="signature" style="max-width: 150px; max-height: 45px;">
              </div>`;
        monitorScreenDiv.appendChild(userDataDiv);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Get my UNIcard";
        saveButton.classList.add("button");
        saveButton.id = "saveCardBtn";
        saveButton.addEventListener("click", saveUNIcard);
        monitorScreenDiv.appendChild(saveButton);

        const backBtn = createNavigationButton(true);
        const continueBtn = createNavigationButton(false);

        monitorScreenDiv.appendChild(createHomeButton());
        monitorScreenDiv.insertBefore(backBtn, saveButton);
        monitorScreenDiv.appendChild(continueBtn);

        addBackButtonListener(requiredData.length, null);
        addContinueButtonListener(requiredData.length, null);

        continueBtn.style.opacity = "0.5";
        continueBtn.style.pointerEvents = "none";

        const elements = monitorScreenDiv.children;
        for (let el of elements) {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        }

        monitorScreenDiv.offsetHeight;

        await fadeInMonitorScreen();

        for (let el of elements) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    }

    async function saveUNIcard() {
        const userDataDiv = document.getElementById("userDataDiv");

        if (typeof html2canvas === "undefined") {
            createResponseWindow("html2canvas library is not loaded.");
            return;
        }

        try {
            const canvas = await html2canvas(userDataDiv, { backgroundColor: null });
            const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/jpeg", 0.95)
            );

            const hashHexImg = await hashImage(blob);
            formData.imgPasswd = hashHexImg;

            const link = document.createElement("a");
            link.download = `${formData.username}-UNIcard.jpg`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            const continueBtn = document.querySelector("#continueBtn");
            if (continueBtn) {
                continueBtn.style.opacity = "1";
                continueBtn.style.pointerEvents = "auto";
            }
        } catch (err) {
            createResponseWindow("Error saving the UNIcard: ", err);
        }
    }

    function createHeading(text) {
        const heading = document.createElement("h1");
        heading.innerHTML = text;
        heading.classList.add("dataHeading");
        return heading;
    }

    function createNavigationButton(isBackButton) {
        const btnHelperDiv = document.createElement("div");
        btnHelperDiv.classList.add("btnHelperDiv");
        let rotation = isBackButton ? "180deg" : "0deg";
        let id = isBackButton ? "backBtn" : "continueBtn";
        btnHelperDiv.innerHTML = `
              <div id="${id}" style="transform: rotate(${rotation})">
                  <div id="cta">
                      <span class="arrow primary next"></span>
                      <span class="arrow secondary next"></span>
                  </div>
              </div>`;
        return btnHelperDiv;
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

    function createUniversitySelect() {
        const uniNameDiv = document.createElement("div");
        const uniNameSelect = document.createElement("select");
        uniNameSelect.id = "uniNameSelect";

        const universityNames = [
            { label: "Állatorvostudományi Egyetem", value: "ÁTE" },
            { label: "Andrássy Gyula Budapesti Német Nyelvű Egyetem", value: "AUB" },
            { label: "Budapesti Corvinus Egyetem", value: "BCE" },
            { label: "Budapesti Gazdasági Egyetem", value: "BGE" },
            { label: "Budapesti Metropolitan Egyetem", value: "METU" }
        ];

        for (let i = 0; i < universityNames.length; i++) {
            const uniOption = document.createElement("option");
            uniOption.value = universityNames[i].value;
            uniOption.textContent = universityNames[i].label;
            uniNameSelect.appendChild(uniOption);
        }

        uniNameSelect.addEventListener("input", () => {
            formData.universityName = uniNameSelect.value;
        });

        uniNameDiv.appendChild(uniNameSelect);
        return uniNameDiv;
    }

    // Add this new function for faculty selection
    function createFacultySelect() {
        const facultyDiv = document.createElement("div");
        const facultySelect = document.createElement("select");
        facultySelect.id = "facultySelect";

        // Example faculties - you should populate this based on the selected university
        const faculties = {
            'ÁTE': [
                'Állatorvostudományi Kar'
            ],
            'AUB': [
                'Interdiszciplináris Kar'
            ],
            'BCE': [
                'Gazdálkodástudományi Kar',
                'Társadalomtudományi Kar',
                'Közgazdaságtudományi Kar'
            ],
            'BGE': [
                'Kereskedelmi, Vendéglátóipari és Idegenforgalmi Kar',
                'Külkereskedelmi Kar',
                'Pénzügyi és Számviteli Kar'
            ],
            'METU': [
                'Művészeti és Kreatívipari Kar',
                'Üzleti, Kommunikációs és Turisztikai Kar'
            ]
        };

        const selectedUniversity = formData.universityName;
        const universityFaculties = faculties[selectedUniversity] || [];

        universityFaculties.forEach(faculty => {
            const option = document.createElement("option");
            option.value = faculty;
            option.textContent = faculty;
            facultySelect.appendChild(option);
        });

        facultySelect.addEventListener("change", () => {
            formData.facultyName = facultySelect.value;
        });

        facultyDiv.appendChild(facultySelect);
        return facultyDiv;
    }

    function createInputField(index) {
        const dataInp = document.createElement("input");
        dataInp.classList.add("input");

        dataInp.style.transition = "all 0.3s ease";
        dataInp.addEventListener("mouseover", () => {
            dataInp.style.transform = "scale(1.05)";
            dataInp.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
        });
        dataInp.addEventListener("mouseout", () => {
            dataInp.style.transform = "scale(1)";
            dataInp.style.boxShadow = "none";
        });

        switch (index) {
            case 0:
                dataInp.type = "email";
                dataInp.id = "emailInput";
                dataInp.placeholder = "example@gmail.com";
                dataInp.value = formData.email;
                dataInp.addEventListener("input", function (e) {
                    const email = e.target.value.trim();
                    const conditions = validateEmail(email);
                    updateValidation(conditions);

                    if (email !== lastCheckedEmail) {
                        isEmailChecked = false;
                        lastCheckedEmail = "";
                    }
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
                });
                break;
            case 3:
                dataInp.type = "text";
                dataInp.placeholder = "@";
                dataInp.id = "usernameInput";
                dataInp.value = formData.username;
                dataInp.addEventListener("input", function (e) {
                    const username = e.target.value.trim();
                    const conditions = validateUsername(username);
                    updateValidation(conditions);

                    if (username !== lastCheckedUsername) {
                        isUsernameChecked = false;
                        lastCheckedUsername = "";
                    }
                });
                break;
            case 4:
                dataInp.type = "password";
                dataInp.placeholder = "########";
                dataInp.id = "passwordInput";
                dataInp.value = formData.passwd;
                dataInp.addEventListener("input", function (e) {
                    const password = e.target.value;
                    const conditions = validatePassword(password);
                    updateValidation(conditions);
                });
                break;
        }

        return dataInp;
    }

    function addBackButtonListener(index, dataInp) {
        backBtn.addEventListener("click", async function () {
            if (index === requiredData.length + 1) {
                await fadeOutMonitorScreen();
                createUNIverseCardStep(monitorScreenDiv);
            } else if (index === requiredData.length) {
                await fadeOutMonitorScreen();
                createFormStep(index - 1);
            } else {
                updateFormData(index, dataInp);
                createFormStep(index - 1);
            }
        });
    }

    function addContinueButtonListener(index, dataInp) {
        continueBtn.addEventListener("click", async function () {
            if (index === 0) {
                const email = dataInp.value.trim();
                // Uncomment for check with php
                //if (await handleGenericValidation(email, "email", dataInp)) {
                createFormStep(index + 1);
                //}
            } else if (index === 2) {
                const selectedGender = document.querySelector(
                    'input[name="gender-radio"]:checked'
                );
                if (selectedGender) {
                    formData.gender = selectedGender.value;
                    createFormStep(index + 1);
                }
            } else if (index === 3) {
                const username = dataInp.value.trim();
                // Uncomment for check with php
                //if (await handleGenericValidation(username, "username", dataInp)) {
                createFormStep(index + 1);
                //}
            } else if (index === 5) {
                const signatureData = await captureSignature();
                if (signatureData) {
                    formData.signature = signatureData;
                    createFormStep(index + 1);
                }
            } else if (index === 6) {
                // Handle university selection
                const uniSelect = document.getElementById('uniNameSelect');
                if (uniSelect && uniSelect.value) {
                    formData.universityName = uniSelect.value;
                    createFormStep(index + 1);
                }
            } else if (index === 7) {
                // Handle faculty selection
                const facultySelect = document.getElementById('facultySelect');
                if (facultySelect && facultySelect.value) {
                    formData.facultyName = facultySelect.value;
                    createFormStep(index + 1);
                }
            } else {
                const isValid = await validateField(dataInp, index);
                if (isValid) {
                    updateFormData(index, dataInp);
                    createFormStep(index + 1);
                }
            }
        });
    }

    function addFinalRegisterButtonListener() {
        const registerBtn = document.getElementById("registerBtn");
        registerBtn.addEventListener("click", async function () {
            try {
                await fadeOutMonitorScreen();
                monitorScreenDiv.innerHTML = "";
                const registerBtnDiv = document.createElement("div");
                registerBtnDiv.id = "registerBtnDiv";
                registerBtnDiv.style.top = "-10%";
                monitorScreenDiv.appendChild(registerBtnDiv);
                registerBtn.style.transform = "scale(0)";
                await fadeInMonitorScreen();
                await delay(600);
                registerBtn.remove();
                registerBtnDiv.style.marginTop = "22%";

                document.body.style.cursor = "progress";
                try {
                    const response = await fetch("createProfile.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    });

                    if (response.ok) {
                        await responseAnimation("200");
                    } else {
                        const errorMessage = await response.text();
                        createResponseWindow(`Registration failed: ${errorMessage}`);
                        await responseAnimation("404");
                    }
                } catch (fetchError) {
                    createResponseWindow(`Fetch error: ${fetchError.message}`);
                    await responseAnimation("404");
                }
            } catch (err) {
                createResponseWindow(`Error: ${err.message}`);
                await responseAnimation("404");
            }
            document.body.style.cursor = "default";
        });
    }

    async function createFinalRegistrationStep() {
        monitorScreenDiv.style.gridTemplateColumns = "";
        monitorScreenDiv.style.gap = "0px";
        monitorScreenDiv.innerHTML = `
        <div id="registerBtnDiv">
          <button class="button" id="registerBtn">Regisztráció befejezése</button>
        </div>`;

        const backBtn = createNavigationButton(true);
        monitorScreenDiv.appendChild(backBtn);

        addBackButtonListener(requiredData.length + 1, null);
        addFinalRegisterButtonListener();
        await fadeInMonitorScreen();
    }

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

    async function validateField(input, index) {
        if (!input) return true;

        const value = input.value.trim();
        let conditions = {};

        switch (index) {
            case 0:
                conditions = validateEmail(value);
                break;
            case 1:
                conditions = validateBirthDate(value);
                break;
            case 3:
                conditions = validateUsername(value);
                break;
            case 4:
                conditions = validatePassword(value);
                break;
        }

        updateValidation(conditions);

        return Object.keys(conditions).length === 0;
    }

    function validateBirthDate(birthDate) {
        let conditions = {};

        if (!birthDate || birthDate.trim() === "") {
            conditions.empty = "-Kötelező mező";
            return conditions;
        }

        if (birthDate.length !== 8) {
            conditions.length = "-8 karakter hosszú";
            return conditions;
        }

        const year = parseInt(birthDate.slice(0, 4), 10);
        const month = parseInt(birthDate.slice(4, 6), 10);
        const day = parseInt(birthDate.slice(6, 8), 10);

        if (isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
            conditions.validDate = "-Nem megfelelő formátum (ÉÉÉÉHHNN)";
            return conditions;
        }

        const daysInMonth = [
            31,
            (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
        if (day > daysInMonth[month - 1]) {
            conditions.validDay = "-Hibás nap az adott hónapban";
            return conditions;
        }

        const today = new Date();
        const birthDateObj = new Date(year, month - 1, day);

        if (birthDateObj > today) {
            conditions.futureDate = "-Nem jövőbeli dátum";
            return conditions;
        }

        const age =
            today.getFullYear() -
            year -
            (today < new Date(today.getFullYear(), month - 1, day) ? 1 : 0);

        if (age < 18 || age > 100) {
            conditions.age = "-Életkor 18 és 100 közötti";
            return conditions;
        }

        return conditions;
    }

    function validatePassword(password) {
        let conditions = {};
        let minLength = 8;
        let maxLength = 18;

        if (password.length < minLength) {
            conditions.length = `-Minimum ${minLength} karakter hosszú`;
        } else if (password.length > maxLength) {
            conditions.length = `-Maximum ${maxLength} karakter hosszú`;
        }

        if (!/[0-9]/.test(password)) {
            conditions.hasNumber = "-Legalább egy számjegy";
        }

        if (!/[!@#$%^&*()\-_=+]/.test(password)) {
            conditions.hasSpecialChar = "-Legalább egy speciális karakter";
        }

        return conditions;
    }

    async function createDetailP(text, condition) {
        const inputDetailsDiv = document.getElementById("inputDetailsDiv");
        let existingP = Array.from(inputDetailsDiv.querySelectorAll("p")).find(
            (p) => p.dataset.condition === condition
        );

        if (existingP) {
            if (text) {
                existingP.innerHTML = text;
                existingP.style.animation = "appear 0.5s forwards ease";
                existingP.style.display = "block";
            } else {
                existingP.style.animation = "disappear 0.5s forwards ease";
                await delay(500);
                existingP.remove();
            }
        } else if (text) {
            let newDetailP = document.createElement("p");
            newDetailP.innerHTML = text;
            newDetailP.dataset.condition = condition;
            inputDetailsDiv.appendChild(newDetailP);
            newDetailP.style.animation = "appear 0.5s forwards ease";
        }
    }
}