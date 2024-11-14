// Ensures everything loads at the start of the page
document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registration");
  const errorDisplay = document.getElementById("errorDisplay");

  // Function to show alerts and focus on the input element
  function showAlert(message, inputElement) {
    alert(message);
    inputElement.focus(); // Corrected typo: 'foucus' to 'focus'
  }

  // Function to check unique characters
  function uniqueChar(str) {
    return new Set(str).size >= 2;
  }

  // Function to check email
  function isValidEmail(email) {
    const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailCheck.test(email);
  }

  // Function to check password
  function isValidPassword(pass, user) {
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const containsPassword = /password/i.test(pass);
    const containsUsername = new RegExp(user, "i").test(pass);

    // Added the missing return statement
    return (
      pass.length >= 12 &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar &&
      !containsPassword &&
      !containsUsername
    );
  }

  // Checks if username is unique
  function isUniqueUsername(user) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    // Corrected the parameter reference
    return !users.hasOwnProperty(user.toLowerCase());
  }

  // Prevents submission if conditions aren't met
  registrationForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    // The form's elements
    const usernameInput = registrationForm.username;
    const emailInput = registrationForm.email;
    const passwordInput = registrationForm.password;
    const passwordCheckInput = registrationForm.passwordCheck;
    const termsInput = registrationForm.terms;

    // Trim the values
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;

    // Username check
    if (username === "") {
      showAlert(
        "Everybody has a name, at least they do here, so don't draw a blank.",
        usernameInput
      );
      return;
    }
    if (username.length < 4) {
      showAlert(
        "Even the word short has more letters than what you entered, don't be shorter than short..",
        usernameInput
      );
      return;
    }
    // Corrected function call: uniqueChar instead of hasAtLeastTwoUniqueChars
    if (!uniqueChar(username)) {
      showAlert(
        "You may not be the main character but you must at least contain 2 special characters",
        usernameInput
      );
      return;
    }
    if (/[^a-zA-Z0-9]/.test(username)) {
      showAlert(
        "...If you need more space or want to be a special character, please have your phase elsewhere",
        usernameInput
      );
      return;
    }
    if (!isUniqueUsername(username)) {
      showAlert("That name already belongs to me!.", usernameInput);
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      showAlert(
        "I can't send a fake email like that to ad agencies! .",
        emailInput
      );
      return;
    }
    if (email.toLowerCase().endsWith("@example.com")) {
      showAlert(
        "Yuck 'example.com' is that even a real email address? ",
        emailInput
      );
      return;
    }

    // Password validation
    if (!isValidPassword(password, username)) {
      showAlert(
        "Ngl, this requirment is pretty harsh for: Password must be longer than 12 character, have both lower and uppercase AND! *drumroll* special characters. And yes I expect you to remember it. ( I can't be botherd to implement a *forgot password checker)",
        passwordInput
      );
      return;
    }
    if (password !== passwordCheck) {
      showAlert(
        "Sorry, your passwords have to be twins (we can't always win).",
        passwordCheckInput
      );
      return;
    }

    // Terms and conditions validation
    if (!termsInput.checked) {
      showAlert(
        "Did you forget to sell your soul? (Terms and conditions).",
        termsInput
      );
      return;
    }

    // Store user data in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || {};
    users[username.toLowerCase()] = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
    };
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message and clear form
    alert(
      "HAHAHAHA, you didn't even bother to read the terms and conditions, Did you!? Omg you poor poor fool."
    );
    registrationForm.reset();
  });
});
