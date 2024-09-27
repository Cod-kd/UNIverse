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
            newBtn.innerHTML = "Regisztráció";
            newBtn.style.transform = "translateX(-200%)";
        } else {
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
            // Render the first input field of the tregistration
            await delay(300);
            monitorScreenDiv.style.opacity = "1";
        });
    }
}

