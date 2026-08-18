// 1. Mobile Navigation Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 2. Resume Download Simulation Alert
document.getElementById('download-btn').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Resume download started successfully!');
});

// 3. Contact Form Validation Logic
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let message = document.getElementById('message').value.trim();
    let msgElement = document.getElementById('form-msg');

    if (name === "" || email === "" || message === "") {
        msgElement.style.color = "#f87171";
        msgElement.textContent = "Please fill in all fields before submitting!";
    } else {
        msgElement.style.color = "#34d399";
        msgElement.textContent = "Thank you! Your message has been sent successfully.";
        document.getElementById('contactForm').reset();
    }
});