const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animateScrollUp');
            observer.unobserve(entry.target);
        }
    });
});
document.querySelectorAll('.animateOnScroll').forEach(el => observer.observe(el));

window.onclick = function (event) {
    const popup = document.getElementById("loginPopup");
    if (event.target === popup) popup.style.display = "none";
};


function getCookie(name) {
    const cookies = document.cookie.split(";").map(c => c.trim());
    for (let c of cookies) {
        if (c.startsWith(name + "=")) return c.substring(name.length + 1);
    }
    return "";
}


function checkLogin() {
    const user = getCookie("username");
    if (user) {
        const navBtn = document.getElementById("navLoginBtn");
        if (navBtn) navBtn.value = "Logout";
    }
}


function loginLogoutTxt() {
    const button = document.getElementById("navLoginBtn");
    if (!button) return;

    if (button.value === "Logout") {
        if (confirm("Are you sure you want to logout?")) {
            document.cookie = "username=; Max-Age=0; path=/";
            window.location.href = "logout.html";
        }
    } else {
        window.location.href = "login.html";
    }
}


function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("usernameField").value;
    const password = document.getElementById("passwordField").value;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username] && users[username] === password) {
        document.cookie = "username=" + username + "; path=/";
        alert("Welcome " + username + ", you have successfully logged in.");
        window.location.href = "index.html";
    } else {
        const invalidLogin = document.getElementById("invalidLogin");
        if (invalidLogin) invalidLogin.style.display = "block";
    }
}


function handleRegistration(e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username]) {
        alert("Username already exists.");
        return;
    }
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));

    const message = document.getElementById("registrationMessage");
    if (message) {
        message.style.display = "block";
        message.innerText = `Registration successful! Welcome, ${username}`;
    }

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
}


function handleRentalForm(e) {
    e.preventDefault();

    const username = getCookie("username");
    if (!username) {
        alert("You must be logged in to reserve a car.");
        window.location.href = "login.html";
        return;
    }

    const carModel = document.getElementById("carModel").value;
    const pickupLocation = document.getElementById("pickupLocation").value;
    const rentalDays = document.getElementById("rentalDays").value;
    const startDate = document.getElementById("startDate").value;

    if (!pickupLocation) {
        alert("Please select a pick-up location.");
        return;
    }

    const rentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    rentals.push({ username, carModel, pickupLocation, rentalDays, startDate });
    localStorage.setItem("rentals", JSON.stringify(rentals));

    const message = document.getElementById("rentMessage");
    if (message) {
        message.style.display = "block";
        message.innerText = `Success! ${username}, you reserved a ${carModel} from ${pickupLocation} for ${rentalDays} day(s) starting from ${startDate}. Payment will be done at the respective office.`;
    }

    setTimeout(() => window.location.href = "Index.html", 5000);
}


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const rentalForm = document.getElementById("rentalForm");

    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (registerForm) registerForm.addEventListener("submit", handleRegistration);
    if (rentalForm) rentalForm.addEventListener("submit", handleRentalForm);

    const urlParams = new URLSearchParams(window.location.search);
    const carName = urlParams.get("car") || "BMW";
    const carInput = document.getElementById("carModel");
    if (carInput) carInput.value = carName;

    checkLogin();
});

