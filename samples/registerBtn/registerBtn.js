const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
        createResponseHeading("", "Success!");
        await delay(1000);
        createResponseHeading("scale1");
        createSuccessfulResponseEffect();
    } else if (status === "404") {
        await create404Effect("scale1");
    }
}

let registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("click", async function () {
    registerBtn.style.transform = "scale(0)";
    await delay(600);
    registerBtn.remove();

    await loadingAnimation(3000);
    await responseAnimation("404"); // CHANGE HERE
});
