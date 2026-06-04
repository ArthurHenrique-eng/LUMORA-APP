(function initSignupPage() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmarSenha");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const formMessage = document.getElementById("formMessage");
  const submitButton = document.getElementById("submitButton");
  const togglePasswordButton = document.getElementById("togglePassword");
  const toggleConfirmPasswordButton = document.getElementById("toggleConfirmPassword");

  if (
    !emailInput ||
    !passwordInput ||
    !confirmPasswordInput ||
    !emailError ||
    !passwordError ||
    !confirmPasswordError ||
    !formMessage ||
    !submitButton ||
    !togglePasswordButton ||
    !toggleConfirmPasswordButton
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

  function validateConfirmPassword() {
    const value = confirmPasswordInput.value;
    if (!value) {
      setFieldError(confirmPasswordInput, confirmPasswordError, "Confirme sua senha.");
      return false;
    }
    if (value !== passwordInput.value) {
      setFieldError(confirmPasswordInput, confirmPasswordError, "As senhas nao coincidem.");
      return false;
    }
    setFieldError(confirmPasswordInput, confirmPasswordError, "");
    return true;
  }

  function setupPasswordToggle(button, input, showText, hideText) {
    button.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      button.textContent = isHidden ? hideText : showText;
      button.setAttribute(
        "aria-label",
        isHidden ? `Ocultar ${input.id}` : `Mostrar ${input.id}`
      );
    });
  }

  emailInput.addEventListener("input", () => {
    validateEmail();
    setFormMessage("", "");
  });
  emailInput.addEventListener("blur", validateEmail);

  passwordInput.addEventListener("input", () => {
    validatePassword();
    validateConfirmPassword();
    setFormMessage("", "");
  });
  passwordInput.addEventListener("blur", validatePassword);

  confirmPasswordInput.addEventListener("input", () => {
    validateConfirmPassword();
    setFormMessage("", "");
  });
  confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

  setupPasswordToggle(togglePasswordButton, passwordInput, "Mostrar", "Ocultar");
  setupPasswordToggle(toggleConfirmPasswordButton, confirmPasswordInput, "Mostrar", "Ocultar");

  form.addEventListener("submit", (event) => {
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();
    const confirmPasswordIsValid = validateConfirmPassword();

    if (!emailIsValid || !passwordIsValid || !confirmPasswordIsValid) {
      event.preventDefault();
      setFormMessage("error", "Revise os campos e tente novamente.");
      return;
    }

    setLoadingState(true);
    setFormMessage("info", "Criando sua conta...");
  });
})();
