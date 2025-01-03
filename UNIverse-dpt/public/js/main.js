// Main function to handle registration process
function renderRegistration() {
    const requiredData = [
        "Email cím",
        "Születési Dátum",
        "Nem",
        "Felhasználónév",
        "Jelszó",
        "Egyetem",
        "Egyetemi kar"
    ];
    let currentIndex = 0;

    const formData = {
        email: "",
        birthDate: "",
        gender: null,
        username: "",
        passwd: "",
        universityName: "",
        facultyName: ""
    };

    createFormStep(currentIndex);

    // Function used to step between registration's parts by index
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
                const uniSelect = createUniversitySelect();
                monitorScreenDiv.appendChild(uniSelect);
            } else if (index === 6) {
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

    // Function used to validate the inputted email's format
    function validateEmail(email) {
        let conditions = {};

        if (!email || email.trim() === "") {
            conditions.empty = "-Hiányzó email cím";
            return conditions;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            conditions.format = "-Helytelen email formátum";
        }

        return conditions;
    }

    // Function used to validate the username
    function validateUsername(username) {
        let conditions = {};

        if (!username || username.trim() === "") {
            conditions.empty = "-Hiányzó felhasználónév";
            return conditions;
        }

        if (username.length < 6) {
            conditions.length = "-Legalább 6 karakter";
        }

        if (username.length > 12) {
            conditions.length = "-Legfeljebb 12 karakter";
        }

        const usernamePattern = /^[A-Za-z0-9_-]+$/;
        if (!usernamePattern.test(username)) {
            conditions.invalidChars = "-Tartalmazhat (szám, betű, -, _)";
        }

        return conditions;
    }

    // Function used to update a validation's conditions that are met or not
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

    // Function for the UNIcard creation in the registration
    async function createUNIverseCardStep(monitorScreenDiv) {
        await fadeOutMonitorScreen();
        monitorScreenDiv.innerHTML = "";
        monitorScreenDiv.style.gridTemplateColumns = "repeat(3, 1fr)";

        const userDataDiv = document.createElement("div");
        userDataDiv.id = "userDataDiv";
        userDataDiv.innerHTML = `
              <p>Email: ${formData.email}</p>
              <p>Username: ${formData.username}</p>
              <p>Gender: ${formData.gender ? "Male" : "Female"}</p>
              <p>Birth Date: ${formData.birthDate}</p>
              <p>University: ${formData.universityName}</p>
              <hr>
              <div>
                <h1>UNIcard</h1>
              </div>`;
        monitorScreenDiv.appendChild(userDataDiv);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Get my UNIcard";
        saveButton.classList.add("button");
        saveButton.id = "saveCardBtn";
        saveButton.addEventListener("click", async () => {
            await saveUNIcard();
            await fadeOutMonitorScreen();
            await createFinalRegistrationStep();
            await fadeInMonitorScreen();
        });
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

    // Function to save the UNIcard as an image
    async function saveUNIcard() {
        const userDataDiv = document.getElementById("userDataDiv");

        if (typeof html2canvas === "undefined") {
            createResponseWindow("html2canvas library is not loaded.");
            return;
        }

        try {
            // Capture the content of the div as a canvas
            const canvas = await html2canvas(userDataDiv, { backgroundColor: null });

            // Convert canvas to base64 image (JPEG format)
            const base64Image = canvas.toDataURL("image/jpeg", 0.95);

            // Create a basic EXIF structure
            const zeroth = {};
            const exif = {};
            const gps = {};

            // Add custom metadata as UserComment
            // 37510 is the tag number for UserComment
            zeroth[37510] = {
                'type': 'Ascii',
                'value': `username: ${formData.username}, passwd: ${formData.passwd}`
            };

            // Create the EXIF dictionary
            const exifObj = { "0th": zeroth, "Exif": exif, "GPS": gps };

            try {
                // Dump EXIF data to binary
                const exifBytes = piexifjs.dump(exifObj);

                // Insert EXIF into image
                const newImageData = piexifjs.insert(exifBytes, base64Image);

                // Create a new Blob with the modified image data
                const newBlob = dataURItoBlob(newImageData);

                // Create a download link for the modified image
                const link = document.createElement("a");
                link.download = `${formData.username}-UNIcard.jpg`;
                link.href = URL.createObjectURL(newBlob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show continue button after the download
                const continueBtn = document.querySelector("#continueBtn");
                if (continueBtn) {
                    continueBtn.style.opacity = "1";
                    continueBtn.style.pointerEvents = "auto";
                }
            } catch (exifError) {
                // Fallback to saving without EXIF
                const link = document.createElement("a");
                link.download = `${formData.username}-UNIcard.jpg`;
                link.href = base64Image;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            createResponseWindow("Error saving the UNIcard: " + err.message);
        }
    }

    function dataURItoBlob(dataURI) {
        try {
            // Handle both base64 and raw data URIs
            const splitDataURI = dataURI.split(',');
            const byteString = splitDataURI[0].indexOf('base64') >= 0 ?
                atob(splitDataURI[1]) :
                decodeURIComponent(splitDataURI[1]);

            // Get the MIME type
            const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

            // Write the bytes of the string to an ArrayBuffer
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ab], { type: mimeString });
        } catch (error) {
            throw new Error("Failed to convert data URI to Blob");
        }
    }

    // Function to create heading with custom text
    function createHeading(text) {
        const heading = document.createElement("h1");
        heading.innerHTML = text;
        heading.classList.add("dataHeading");
        return heading;
    }

    // Function to create continue or back button by boolean input
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

    // Function to create the gender selection's radio type inputs
    function createGenderRadioButtons() {
        const radioDiv = document.createElement("div");
        radioDiv.classList.add("radio-input");

        const genders = [
            { value: true, label: "Férfi" },
            { value: false, label: "Nő" },
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

    // Function to create the university select element with options
    function createUniversitySelect() {
        const uniNameDiv = document.createElement("div");
        const uniNameSelect = document.createElement("select");
        uniNameSelect.id = "uniNameSelect";

        const universityNames = [
            { label: "Állatorvostudományi Egyetem", value: "ÁTE" },
            { label: "Andrássy Gyula Budapesti Német Nyelvű Egyetem", value: "AUB" },
            { label: "Budapesti Corvinus Egyetem", value: "BCE" },
            { label: "Budapesti Gazdasági Egyetem", value: "BGE" },
            { label: "Budapesti Metropolitan Egyetem", value: "METU" },
            { label: "Budapesti Műszaki és Gazdaságtudományi Egyetem", value: "BME" },
            { label: "Debreceni Egyetem", value: "DE" },
            { label: "Debreceni Református Hittudományi Egyetem", value: "DRHE" },
            { label: "Dunaújvárosi Egyetem", value: "DUE" },
            { label: "Edutus Egyetem", value: "EDUTUS" },
            { label: "Eötvös Loránd Tudományegyetem", value: "ELTE" },
            { label: "Eszterházy Károly Katolikus Egyetem", value: "EKKE" },
            { label: "Evangélikus Hittudományi Egyetem", value: "EHE" },
            { label: "Gál Ferenc Egyetem", value: "GFE" },
            { label: "Károli Gáspár Református Egyetem", value: "KRE" },
            { label: "Kodolányi János Egyetem", value: "KJE" },
            { label: "Közép-európai Egyetem", value: "KEE" },
            { label: "Liszt Ferenc Zeneművészeti Egyetem", value: "LFZE" },
            { label: "Magyar Képzőművészeti Egyetem", value: "MKE" },
            { label: "Magyar Táncművészeti Egyetem", value: "MTE" },
            { label: "Milton Friedman Egyetem", value: "MILTON" },
            { label: "Miskolci Egyetem", value: "ME" },
            { label: "Moholy-Nagy Művészeti Egyetem", value: "MOME" },
            { label: "Nemzeti Közszolgálati Egyetem", value: "NKE" },
            { label: "Neumann János Egyetem", value: "NJE" },
            { label: "Nyíregyházi Egyetem", value: "NYE" },
            { label: "Óbudai Egyetem", value: "OE" },
            { label: "Országos Rabbiképző – Zsidó Egyetem", value: "OR-ZSE" },
            { label: "Pannon Egyetem", value: "PE" },
            { label: "Pázmány Péter Katolikus Egyetem", value: "PPKE" },
            { label: "Pécsi Tudományegyetem", value: "PTE" },
            { label: "Semmelweis Egyetem", value: "SE" },
            { label: "Soproni Egyetem", value: "SOE" },
            { label: "Magyar Agrár- és Élettudományi Egyetem", value: "MATE" },
            { label: "Széchenyi István Egyetem", value: "SZE" },
            { label: "Színház- és Filmművészeti Egyetem", value: "SZFE" },
            { label: "Szegedi Tudományegyetem", value: "SZTE" },
            { label: "Tokaj-Hegyalja Egyetem", value: "THE" }
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

    // Function for creating faculty select element with corresponding options
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
            ],
            'BME': [
                'Építészmérnöki Kar',
                'Építőmérnöki Kar',
                'Gépészmérnöki Kar',
                'Közlekedésmérnöki és Járműmérnöki Kar',
                'Természettudományi Kar',
                'Vegyészmérnöki és Biomérnöki Kar',
                'Villamosmérnöki és Informatikai Kar',
                'Gazdaság- és Társadalomtudományi Kar'
            ],
            'DE': [
                'Állam- és Jogtudományi Kar',
                'Általános Orvostudományi Kar',
                'Bölcsészettudományi Kar',
                'Egészségügyi Kar',
                'Fogorvostudományi Kar',
                'Gazdaságtudományi Kar',
                'Gyógyszerésztudományi Kar',
                'Informatikai Kar',
                'Mezőgazdaság-, Élelmiszertudományi és Környezetgazdálkodási Kar',
                'Műszaki Kar',
                'Népegészségügyi Kar',
                'Természettudományi és Technológiai Kar',
                'Zeneművészeti Kar'
            ],
            'DRHE': [
                'Teológiai Kar',
                'Tanítóképzési Kar'
            ],
            'DUE': [
                'Informatikai Kar',
                'Társadalomtudományi Kar',
                'Műszaki Kar'
            ],
            'EDUTUS': [
                'Műszaki Kar',
                'Gazdálkodástudományi Kar'
            ],
            'ELTE': [
                'Állam- és Jogtudományi Kar',
                'Bárczi Gusztáv Gyógypedagógiai Kar',
                'Bölcsészettudományi Kar',
                'Informatikai Kar',
                'Pedagógiai és Pszichológiai Kar',
                'Társadalomtudományi Kar',
                'Természettudományi Kar',
                'Tanító- és Óvóképző Kar'
            ],
            'EKKE': [
                'Bölcsészettudományi és Művészeti Kar',
                'Gazdaság- és Társadalomtudományi Kar',
                'Pedagógiai Kar',
                'Természettudományi Kar'
            ],
            'EHE': [
                'Teológiai Kar'
            ],
            'GFE': [
                'Egészség- és Szociális Tudományi Kar',
                'Gazdasági Kar',
                'Pedagógiai Kar',
                'Teológiai Kar'
            ],
            'KRE': [
                'Állam- és Jogtudományi Kar',
                'Bölcsészet- és Társadalomtudományi Kar',
                'Hittudományi Kar',
                'Pedagógiai Kar',
                'Szociális és Egészségtudományi Kar'
            ],
            'KJE': [
                'Gazdaságtudományi és Menedzsment Kar',
                'Kulturális, Kommunikációs és Turisztikai Kar'
            ],
            'KEE': [
                'Közpolitikai Iskola',
                'Történelem- és Társadalomtudományi Kar',
                'Kognitív Tudományi Tanszék'
            ],
            'LFZE': [
                'Billentyűs és Akkordikus Hangszerek Tanszéke',
                'Egyházzene Tanszék',
                'Ének Tanszék',
                'Fúvós Tanszék',
                'Jazztanszék',
                'Karmester és Kóruskarnagyképző Tanszék',
                'Népzene Tanszék',
                'Vonós Tanszék',
                'Zeneismeret Tanszék',
                'Zenetudományi Tanszék'
            ],
            'MKE': [
                'Képzőművészeti Kar',
                'Művészetelméleti Kar'
            ],
            'MTE': [
                'Táncművész Kar',
                'Koreográfus- és Táncpedagógus Kar'
            ],
            'MILTON': [
                'Gazdaságtudományi Kar',
                'Bölcsészettudományi Kar'
            ],
            'ME': [
                'Állam- és Jogtudományi Kar',
                'Bölcsészettudományi Kar',
                'Egészségügyi Kar',
                'Gépészmérnöki és Informatikai Kar',
                'Gazdaságtudományi Kar',
                'Műszaki Anyagtudományi Kar',
                'Műszaki Földtudományi Kar'
            ],
            'MOME': [
                'Építészeti Intézet',
                'Design Intézet',
                'Média Intézet',
                'Elméleti Intézet'
            ],
            'NKE': [
                'Államtudományi és Nemzetközi Tanulmányok Kar',
                'Hadtudományi és Honvédtisztképző Kar',
                'Rendészettudományi Kar',
                'Víztudományi Kar'
            ],
            'NJE': [
                'Gazdaságtudományi Kar',
                'GAMF Műszaki és Informatikai Kar',
                'Kertészeti és Vidékfejlesztési Kar',
                'Pedagógusképző Kar'
            ],
            'NYE': [
                'Műszaki és Agrártudományi Kar',
                'Pedagógusképző Kar',
                'Gazdasági és Társadalomtudományi Kar'
            ],
            'OE': [
                'Alba Regia Műszaki Kar',
                'Bánki Donát Gépész és Biztonságtechnikai Mérnöki Kar',
                'Kandó Kálmán Villamosmérnöki Kar',
                'Keleti Károly Gazdasági Kar',
                'Neumann János Informatikai Kar',
                'Rejtő Sándor Könnyűipari és Környezetmérnöki Kar',
                'Ybl Miklós Építéstudományi Kar'
            ],
            'OR-ZSE': [
                'Rabbiképző Kar',
                'Zsidó Vallástudományi Kar'
            ],
            'PE': [
                'Gazdaságtudományi Kar',
                'Mérnöki Kar',
                'Modern Filológiai és Társadalomtudományi Kar'
            ],
            'PPKE': [
                'Bölcsészet- és Társadalomtudományi Kar',
                'Információs Technológiai és Bionikai Kar',
                'Jog- és Államtudományi Kar',
                'Hittudományi Kar'
            ],
            'PTE': [
                'Állam- és Jogtudományi Kar',
                'Általános Orvostudományi Kar',
                'Bölcsészet- és Társadalomtudományi Kar',
                'Egészségtudományi Kar',
                'Gyógyszerésztudományi Kar',
                'Közgazdaságtudományi Kar',
                'Kultúratudományi, Pedagógusképző és Vidékfejlesztési Kar',
                'Műszaki és Informatikai Kar',
                'Művészeti Kar',
                'Természettudományi Kar'
            ],
            'SE': [
                'Általános Orvostudományi Kar',
                'Egészségtudományi Kar',
                'Egészségügyi Közszolgálati Kar',
                'Fogorvostudományi Kar',
                'Gyógyszerésztudományi Kar',
                'Pető András Kar'
            ],
            'SOE': [
                'Benedek Elek Pedagógiai Kar',
                'Erdőmérnöki Kar',
                'Faipari Mérnöki és Kreatívipari Kar',
                'Lámfalussy Sándor Közgazdaságtudományi Kar'
            ],
            'MATE': [
                'Agrár- és Élelmiszergazdasági Kar',
                'Erdészeti Kar',
                'Gazdaságtudományi Kar',
                'Kertészettudományi Kar',
                'Környezettudományi Kar',
                'Műszaki és Informatikai Kar'
            ],
            'SZE': [
                'Audi Hungaria Járműmérnöki Kar',
                'Apáczai Csere János Kar',
                'Építész-, Építő- és Közlekedésmérnöki Kar',
                'Gépészmérnöki, Informatikai és Villamosmérnöki Kar',
                'Kautz Gyula Gazdaságtudományi Kar',
                'Mezőgazdaság- és Élelmiszertudományi Kar'
            ],
            'SZFE': [
                'Film- és Médiaintézet',
                'Színházművészeti Intézet'
            ],
            'SZTE': [
                'Állam- és Jogtudományi Kar',
                'Általános Orvostudományi Kar',
                'Bölcsészet- és Társadalomtudományi Kar',
                'Egészségtudományi és Szociális Képzési Kar',
                'Fogorvostudományi Kar',
                'Gazdaságtudományi Kar',
                'Gyógyszerésztudományi Kar',
                'Juhász Gyula Pedagógusképző Kar',
                'Mérnöki Kar',
                'Természettudományi és Informatikai Kar',
                'Zeneművészeti Kar'
            ],
            'THE': [
                'Gazdálkodástudományi Kar',
                'Szőlészeti és Borászati Intézet'
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

    // Function to create an input field by index
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

    // Function to add click event listener to a back button
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

    // Function to add click event listener to a continue button
    function addContinueButtonListener(index, dataInp) {
        continueBtn.addEventListener("click", async function () {
            if (index === 0) {
                const email = dataInp.value.trim();
                const conditions = validateEmail(email);

                if (Object.keys(conditions).length > 0) {
                    updateValidation(conditions);
                    return;
                }
                updateFormData(index, dataInp);
                createFormStep(index + 1);

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
                const conditions = validateUsername(username);

                if (Object.keys(conditions).length > 0) {
                    updateValidation(conditions);
                    return;
                }
                updateFormData(index, dataInp);
                createFormStep(index + 1);

            } else if (index === 5) {
                const uniSelect = document.getElementById('uniNameSelect');
                if (uniSelect && uniSelect.value) {
                    formData.universityName = uniSelect.value;
                    createFormStep(index + 1);
                }
            } else if (index === 6) {
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

    // Function to create the registration's last part
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
        const finalRegisterBtn = document.getElementById("registerBtn");
        finalRegisterBtn.addEventListener("click", () => {
            fetchRegister(
                formData.email,
                formData.username,
                formData.passwd,
                "Test full name",
                formData.gender,
                formData.birthDate,
                formData.facultyName,
                formData.universityName,
                "jpg"
            )
        });
        await fadeInMonitorScreen();
    }

    async function fetchRegister(email, usr, passwd, fullName, gender, birthDate, faculty, university, pfpExtension) {
        try {
            // Should be stored somewhere else
            const username = "admin";
            const password = "oneOfMyBestPasswords";

            let headers = new Headers();
            headers.set("Authorization", "Basic " + btoa(username + ":" + password));
            headers.set("Content-Type", "application/json");

            const response = await fetch("http://localhost:8080/user/registration", {
                headers: headers,
                method: "POST",
                body: JSON.stringify({
                    emailIn: email,
                    usernameIn: usr,
                    passwordIn: passwd,
                    nameIn: fullName,
                    genderIn: gender,
                    birthDateIn: birthDate,
                    facultyIn: faculty,
                    universityNameIn: university,
                    profilePictureExtensionIn: pfpExtension
                })
            });

            await fadeOutMonitorScreen();

            switch (response.status) {
                case 200:
                    monitorScreenDiv.innerHTML = `<h1>Sikeres regisztráció!</h1>`;
                    await delay(3000);
                    renderLogin();
                    break;
                case 409:
                    createResponseWindow("Foglalt felhasználónév vagy email!");
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
    }

    // Function to update the formData, where the registration data is saved
    function updateFormData(index, dataInp) {
        switch (index) {
            case 0:
                formData.email = dataInp.value.trim();
                break;
            case 1:
                const dateVal = dataInp.value.trim();
                if (dateVal.length === 8) {
                    const year = dateVal.slice(0, 4);
                    const month = dateVal.slice(4, 6);
                    const day = dateVal.slice(6, 8);
                    formData.birthDate = `${year}-${month}-${day}`;
                } else {
                    formData.birthDate = dateVal;
                }
                break;
            case 3:
                formData.username = dataInp.value.trim();
                break;
            case 4:
                formData.passwd = dataInp.value.trim();
                break;
        }
    }

    // Function to validate an input field by index
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

    // Function to validate inputted birth date
    function validateBirthDate(birthDate) {
        let conditions = {};

        if (!birthDate || birthDate.trim() === "") {
            conditions.empty = "-Hiányzó születési dátum";
            return conditions;
        }

        if (birthDate.length !== 8) {
            conditions.format = "-Helytelen dátumformátum (ÉÉÉÉHHNN)";
            return conditions;
        }

        const year = parseInt(birthDate.slice(0, 4), 10);
        const month = parseInt(birthDate.slice(4, 6), 10);
        const day = parseInt(birthDate.slice(6, 8), 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            conditions.format = "-Helytelen dátumformátum (ÉÉÉÉHHNN)";
            return conditions;
        }

        const daysInMonth = [
            31,
            (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
            31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ];

        if (month < 1 || month > 12) {
            conditions.validDate = "-Hibás hónap";
            return conditions;
        }

        if (day < 1 || day > daysInMonth[month - 1]) {
            conditions.validDate = "-Hibás nap az adott hónapban";
            return conditions;
        }

        return conditions;
    }

    // Function to validate inputted password
    function validatePassword(password) {
        let conditions = {};

        if (!password || password.trim() === "") {
            conditions.empty = "-Hiányzó jelszó";
            return conditions;
        }

        if (password.length < 8) {
            conditions.minLength = "-Legalább 8 karakter";
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]*$/;
        if (!passwordPattern.test(password)) {
            conditions.pattern = "-Minimum 1 nagybetű, 1 kisbetű, és 1 szám";
        }

        return conditions;
    }

    // Function to create condition details as paragraphs
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