const registerLoginBtn = document.getElementById("registerLoginBtn");
const registerLoginBtnDiv = document.getElementById("registerLoginBtnDiv");
const monitorScreenDiv = document.getElementById("monitorScreenDiv");
let isEmailChecked = false;
let lastCheckedEmail = "";
let isUsernameChecked = false;
let lastCheckedUsername = "";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

registerLoginBtn.addEventListener("click", splitMainButton);

async function splitMainButton() {
  registerLoginBtn.style.transform = "scale(0)";
  registerLoginBtn.style.transition = "transform 0.5s";

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
      if (data.id === "registerBtn") {
        monitorScreenDiv.innerHTML = "";
        renderRegistration();
      } else {
        monitorScreenDiv.innerHTML = ``;
        renderLogin();
      }
      await fadeInMonitorScreen();
    });
  }
}

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

async function fadeOutMonitorScreen() {
  monitorScreenDiv.style.opacity = "0";
  await delay(200);
}

async function fadeInMonitorScreen() {
  monitorScreenDiv.style.opacity = "1";
  await delay(100);
}

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

async function createNew404Effect() {
  const script = document.createElement("script");
  script.src =
    "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
  script.type = "module";
  registerBtnDiv.appendChild(script);

  const lottiePlayer = document.createElement("dotlottie-player");
  lottiePlayer.src =
    "https://lottie.host/7ecd4f29-9d72-4ba1-83c7-8516c2b607dc/bwUOV026I3.json";
  lottiePlayer.id = "animated404";
  lottiePlayer.setAttribute("speed", "1");
  lottiePlayer.setAttribute("autoplay", "");
  lottiePlayer.setAttribute("loop", "true");

  lottiePlayer.style.transform = "scale(0)";
  lottiePlayer.style.transition = "transform 0.5s";

  registerBtnDiv.appendChild(lottiePlayer);

  await delay(10);
  lottiePlayer.style.transform = "scale(1)";
}

async function responseAnimation(status) {
  const existing404El = document.getElementById("animated404");
  if (status === "200") {
    createResponseHeading(false, "Sikeres regisztráció!<br>Jelentkezz be!");
    await delay(1000);
    createResponseHeading(true);
    createSuccessfulResponseEffect();
    registerBtnDiv.style.marginTop = "0%";
    await delay(4000);
    await fadeOutMonitorScreen();
    renderLogin();
    await fadeInMonitorScreen();
  } else if (status === "404") {
    await delay(1000);
    createResponseHeading(false, "Hiba történt");
    createResponseHeading(true);
    if (existing404El) {
      existing404El.style.transform = `scale(${operation === "scale1" ? 1 : 0
        })`;
    } else {
      createNew404Effect();
    }
    registerBtnDiv.style.marginTop = "14%";
  }
}

function createHomeButton() {
  const homeBtn = document.createElement("button");
  homeBtn.id = "homeBtn";
  homeBtn.innerHTML = `<i class="fa fa-home"></i>`;
  homeBtn.addEventListener("click", async function () {
    window.location.reload();
  });
  return homeBtn;
}

function renderRegistration() {
  const requiredData = [
    "Email cím",
    "Születési Dátum",
    "Nem",
    "Felhasználónév",
    "Jelszó",
    "Aláírás"
  ];
  let currentIndex = 0;

  const formData = {
    email: "",
    birthDate: "",
    gender: "",
    username: "",
    passwd: "",
    imgPasswd: "",
    signature: null
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
      } else {
        dataInp = createInputField(index);
        monitorScreenDiv.appendChild(dataInp);

        if (index === 4) {
          const showBtn = document.createElement("button");
          showBtn.id = "showBtn";
          showBtn.classList.add("button");
          showBtn.innerHTML = "Show";

          showBtn.addEventListener("click", function () {
            if (passwordInput.type === "password") {
              passwordInput.type = "text";
              showBtn.innerHTML = "Hide";
            } else {
              passwordInput.type = "password";
              showBtn.innerHTML = "Show";
            }
          });
          monitorScreenDiv.appendChild(showBtn);
        }

        if (index === 5) {
          const signatureDiv = document.createElement("div");
          signatureDiv.id = "signatureDiv";
          signatureDiv.innerHTML = `
                    <canvas id="signatureCanvas"></canvas>
                    <button id="resetCanvasBtn">Reset</button>`;
          monitorScreenDiv.querySelector("input").remove();
          monitorScreenDiv.appendChild(signatureDiv);
          continueBtn.querySelector("#continueBtn").style.opacity = "0.5";
          continueBtn.querySelector("#continueBtn").style.pointerEvents =
            "none";
          setupSignatureCanvas();
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
        if (await handleGenericValidation(email, "email", dataInp)) {
          createFormStep(index + 1);
        }
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
        if (await handleGenericValidation(username, "username", dataInp)) {
          createFormStep(index + 1);
        }
      } else if (index === 5) {
        const signatureData = await captureSignature();
        if (signatureData) {
          formData.signature = signatureData;
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
    await fadeOutMonitorScreen();
    monitorScreenDiv.innerHTML = ``;
    monitorScreenDiv.style.gridTemplateColumns = "";
    monitorScreenDiv.style.gap = "0px";

    const registerBtnDiv = document.createElement("div");
    registerBtnDiv.id = "registerBtnDiv";
    const registerBtn = document.createElement("button");
    registerBtn.id = "registerBtn";
    registerBtn.classList.add("button");
    registerBtn.innerHTML = "Regisztráció befejezése";
    registerBtnDiv.appendChild(registerBtn);
    monitorScreenDiv.appendChild(registerBtnDiv);

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
    let maxLength = 26;

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

  function startDrawing(event) {
    isDrawing = true;
    const pos = getEventPosition(event);
    lastX = pos.x;
    lastY = pos.y;
    context.beginPath();
    context.moveTo(lastX, lastY);
    event.preventDefault();
  }

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

  function stopDrawing(event) {
    if (isDrawing) {
      isDrawing = false;
      event.preventDefault();
    }
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#141414";
    context.fillRect(0, 0, canvas.width, canvas.height);
    hasDrawn = false;
    updateContinueButton();
  }

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

async function hashImage(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

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

async function renderLogin() {
  monitorScreenDiv.innerHTML = `
    <form id="loginForm" onsubmit="return false;">
        <input type="email" placeholder="Email..." class="input" name="email">
        <input type="password" placeholder="Jelszó..." class="input" name="passwd">
        <button class="button" id="loginBtn">Bejelentkezés</button>
    </form>
    <button class="button" id="cardLoginBtn">UNIcard használata</button>`;
  monitorScreenDiv.appendChild(createHomeButton());

  const handleError = async (errorMessage) => {
    createResponseWindow(errorMessage);
    await fadeInMonitorScreen();
  };

  // Simple login
  document.getElementById("loginBtn").addEventListener("click", async () => {
    document.body.style.cursor = "progress";
    const formData = new FormData(document.getElementById("loginForm"));
    try {
      const response = await fetch("login.php", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        await handleError("Network response was not ok");
        return;
      }

      const responseData = await response.json();

      if (responseData.error) {
        await handleError(responseData.error);
        return;
      }

      if (responseData.success) {
        createResponseWindow(responseData.success);
      }
    } catch (error) {
      await handleError(error.message);
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
                createResponseWindow("Successful login! Redirecting...");
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

function extractEmail(text) {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
}

document.addEventListener("DOMContentLoaded", () => {
  arrowBtnsConfig();
  const typed = new Typed(".auto-type", {
    strings: ["Az egyetem csak a tanulásról szól?", "NEM!"],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true
  });
});
