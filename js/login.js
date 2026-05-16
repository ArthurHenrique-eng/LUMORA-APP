(function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const formMessage = document.getElementById("formMessage");
  const submitButton = document.getElementById("submitButton");
  const togglePasswordButton = document.getElementById("togglePassword");
  const socialButtons = document.querySelectorAll(".social-btn");

  if (
    !emailInput ||
    !passwordInput ||
    !rememberInput ||
    !emailError ||
    !passwordError ||
    !formMessage ||
    !submitButton ||
    !togglePasswordButton
  ) {
    return;
  }

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setLoadingState(isLoading) {
    submitButton.classList.toggle("is-loading", isLoading);
    submitButton.setAttribute("aria-busy", String(isLoading));
    submitButton.disabled = isLoading;
  }

  function setFieldError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function setFormMessage(type, message) {
    formMessage.classList.remove("is-error", "is-success", "is-info");
    formMessage.textContent = message;
    if (!message) return;
    formMessage.classList.add(`is-${type}`);
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      setFieldError(emailInput, emailError, "Informe seu email.");
      return false;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setFieldError(emailInput, emailError, "Use um email valido.");
      return false;
    }
    setFieldError(emailInput, emailError, "");
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value;
    if (!value) {
      setFieldError(passwordInput, passwordError, "Informe sua senha.");
      return false;
    }
    if (value.length < 6) {
      setFieldError(passwordInput, passwordError, "A senha precisa ter pelo menos 6 caracteres.");
      return false;
    }
    setFieldError(passwordInput, passwordError, "");
    return true;
  }

  emailInput.addEventListener("input", () => {
    validateEmail();
    setFormMessage("", "");
  });

  emailInput.addEventListener("blur", validateEmail);

  passwordInput.addEventListener("input", () => {
    validatePassword();
    setFormMessage("", "");
  });

  passwordInput.addEventListener("blur", validatePassword);

  togglePasswordButton.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePasswordButton.textContent = isHidden ? "Ocultar" : "Mostrar";
    togglePasswordButton.setAttribute(
      "aria-label",
      isHidden ? "Ocultar senha" : "Mostrar senha"
    );
  });

  form.addEventListener("submit", (event) => {
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();

    if (!emailIsValid || !passwordIsValid) {
      event.preventDefault();
      setFormMessage("error", "Revise os campos e tente novamente.");
      return;
    }

    setLoadingState(true);
    setFormMessage("info", "Validando acesso...");
  });

  socialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const provider = button.getAttribute("data-social") || "Social";
      setFormMessage("info", `Login com ${provider} sera liberado em breve.`);
    });
  });
})();
