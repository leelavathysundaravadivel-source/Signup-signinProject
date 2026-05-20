document.addEventListener("DOMContentLoaded", function() {
    // --- 1. DYNAMIC PASSWORD VISIBILITY TOGGLE CORE FEATURE ---
    const toggleButtons = document.querySelectorAll(".toggle-password");
    toggleButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetId = this.getAttribute("data-target");
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector("i");

            if (targetInput.type === "password") {
                targetInput.type = "text";
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            } else {
                targetInput.type = "password";
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            }
        });
    });

    // --- 2. SIGN-UP LOGIC ARCHITECTURE ---
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            let isValid = true;

            // Clear previous errors & indicators
            document.querySelectorAll(".error-msg").forEach(el => el.innerText = "");
            document.querySelectorAll(".form-control").forEach(input => input.classList.remove("is-invalid", "is-valid"));

            // Retrieve structural elements
            const fullName = document.getElementById("fullName");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const location = document.getElementById("location");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");

            // a. Full Name Validation (Mandatory)
            if (fullName.value.trim() === "") {
                setError(fullName, "document.getElementById('nameError')", "Full Name is required.");
                isValid = false;
            } else {
                setValid(fullName);
            }

            // b. Email Validation (Regex format validation)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                setError(email, "document.getElementById('emailError')", "Provide a valid email format (e.g., name@mail.com).");
                isValid = false;
            } else {
                setValid(email);
            }

            // c. Phone Number Validation (Strict 10 Digits verification)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                setError(phone, "document.getElementById('phoneError')", "Phone number must contain exactly 10 digits.");
                isValid = false;
            } else {
                setValid(phone);
            }

            // d. Location/City Validation (Alphabets only restriction)
            const alphaRegex = /^[A-Za-z\s]+$/;
            if (!alphaRegex.test(location.value.trim())) {
                setError(location, "document.getElementById('locationError')", "Location must contain only alphabetical characters.");
                isValid = false;
            } else {
                setValid(location);
            }

            // e. Password Boundary Verification (Min 8 Chars, Mixed Alpha-Numeric check)
            const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passRegex.test(password.value)) {
                setError(password, "document.getElementById('passwordError')", "Must be at least 8 characters long with letters and numbers.");
                isValid = false;
            } else {
                setValid(password);
            }

            // f. Password Matching Verification
            if (confirmPassword.value === "" || password.value !== confirmPassword.value) {
                setError(confirmPassword, "document.getElementById('confirmPasswordError')", "Passwords do not match.");
                isValid = false;
            } else {
                setValid(confirmPassword);
            }

            // Persistence Mechanism execution on validated state
            if (isValid) {
                const userObject = {
                    name: fullName.value.trim(),
                    email: email.value.trim().toLowerCase(),
                    phone: phone.value.trim(),
                    location: location.value.trim(),
                    password: password.value
                };

                // Commit parameters to LocalStorage array structure
                let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

                // Prevent duplicate records for equivalent IDs
                const trackingIndex = users.findIndex(u => u.email === userObject.email);
                if (trackingIndex !== -1) {
                    setError(email, "document.getElementById('emailError')", "This email address is already registered.");
                    return;
                }

                users.push(userObject);
                localStorage.setItem("registeredUsers", JSON.stringify(users));

                alert("Registration Successful! Redirecting to login dashboard...");
                window.location.href = "SignIn.html";
            }
        });
    }

    // --- 3. SIGN-IN AUTHENTICATION SUBSYSTEM ---
    const signinForm = document.getElementById("signinForm");
    if (signinForm) {
        signinForm.addEventListener("submit", function(event) {
            event.preventDefault();
            let isValid = true;

            const signinEmail = document.getElementById("signinEmail");
            const signinPassword = document.getElementById("signinPassword");
            const authAlert = document.getElementById("authAlert");

            // Reset execution feedback structures
            authAlert.classList.add("d-none");
            authAlert.innerText = "";
            document.querySelectorAll(".error-msg").forEach(el => el.innerText = "");
            document.querySelectorAll(".form-control").forEach(input => input.classList.remove("is-invalid", "is-valid"));

            // Verification checking routine
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(signinEmail.value.trim())) {
                setError(signinEmail, "document.getElementById('signinEmailError')", "Please provide a valid email format.");
                isValid = false;
            }

            if (signinPassword.value === "") {
                setError(signinPassword, "document.getElementById('signinPasswordError')", "Password cannot be empty.");
                isValid = false;
            }

            if (isValid) {
                const enteredEmail = signinEmail.value.trim().toLowerCase();
                const enteredPassword = signinPassword.value;

                // Load database profile collection arrays
                const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
                const matchedUser = users.find(u => u.email === enteredEmail && u.password === enteredPassword);

                if (matchedUser) {
                    setValid(signinEmail);
                    setValid(signinPassword);
                    alert(`Welcome back, ${matchedUser.name}! Authentication Successful.`);
                    // Route user to target tourist interface
                    window.location.href = "travelapp.html";
                } else {
                    authAlert.classList.remove("d-none");
                    authAlert.innerText = "Error: Invalid email or password credentials. Ensure you are registered.";
                    signinEmail.classList.add("is-invalid");
                    signinPassword.classList.add("is-invalid");
                }
            }
        });
    }

    // --- HELPER WRAPPER UTILITIES FOR INLINE ERROR HANDLING ---
    function setError(inputElement, errorElementEvalStr, validationFeedbackText) {
        inputElement.classList.add("is-invalid");
        eval(errorElementEvalStr).innerText = validationFeedbackText;
    }

    function setValid(inputElement) {
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
    }
});
