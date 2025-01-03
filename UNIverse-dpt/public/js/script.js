// Elements
const registerLoginBtn = document.getElementById("registerLoginBtn");
const registerLoginBtnDiv = document.getElementById("registerLoginBtnDiv");
const monitorScreenDiv = document.getElementById("monitorScreenDiv");

// Helper variables
let isEmailChecked = false;
let lastCheckedEmail = "";
let isUsernameChecked = false;
let lastCheckedUsername = "";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Run upon first load
document.addEventListener("DOMContentLoaded", () => {
    //arrowBtnsConfig(); check if function is unnecessary
    // Add typing effect to element with 'auto-type' class
    const typed = new Typed(".auto-type", {
        strings: ["Az egyetem csak a tanulásról szól?", "NEM!"],
        typeSpeed: 50,
        backSpeed: 50,
        loop: true
    });
});
