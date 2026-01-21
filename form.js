const form = document.getElementById("contactForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPw = document.getElementById("confirm");
const message = document.getElementById("message");
const agree = document.getElementById("agree");
const pwToggle = document.getElementById("pwToggle");

const errName = document.getElementById("errName");
const errEmail = document.getElementById("errEmail");
const errPassword = document.getElementById("errPassword");
const errConfirm = document.getElementById("errConfirm");
const errMessage = document.getElementById("errMessage");
const errAgree = document.getElementById("errAgree");

// Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// მინ. 8 სიმბოლო, 1 დიდი ასო, 1 ციფრი
const passRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

function setErr(el, msg) {
  if (!el) return;
  el.textContent = msg || "";
}

function validate() {
  let ok = true;

  const nameVal = fullName.value.trim();
  const emailVal = email.value.trim();
  const passVal = password.value;
  const confirmVal = confirmPw.value;
  const msgVal = message.value.trim();

  // Name
  if (nameVal.length < 2) { setErr(errName, "შეიყვანე მინიმუმ 2 სიმბოლო."); ok = false; }
  else setErr(errName, "");

  // Email
  if (!emailRegex.test(emailVal)) { setErr(errEmail, "ელ-ფოსტის ფორმატი არასწორია."); ok = false; }
  else setErr(errEmail, "");

  // Password
  if (!passRegex.test(passVal)) {
    setErr(errPassword, "პაროლი უნდა იყოს მინ. 8, შეიცავდეს 1 დიდ ასოს და 1 ციფრს.");
    ok = false;
  } else setErr(errPassword, "");

  // Confirm
  if (confirmVal !== passVal || confirmVal.length === 0) { setErr(errConfirm, "პაროლები არ ემთხვევა."); ok = false; }
  else setErr(errConfirm, "");

  // Message
  if (msgVal.length < 5) { setErr(errMessage, "მესიჯი ძალიან მოკლეა (მინ. 5 სიმბოლო)."); ok = false; }
  else setErr(errMessage, "");

  // Agree
  if (!agree.checked) { setErr(errAgree, "აუცილებელია თანხმობა."); ok = false; }
  else setErr(errAgree, "");

  return ok;
}

// show/hide password
if (pwToggle) {
  pwToggle.addEventListener("click", () => {
    const isPw = password.type === "password";
    password.type = isPw ? "text" : "password";
    pwToggle.textContent = isPw ? "Hide" : "Show";
  });
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validate();
    if (!ok) return;

    // Demo submit
    alert("ფორმა წარმატებით გაიგზავნა ✅ (demo)");
    form.reset();

    // reset errors
    [errName, errEmail, errPassword, errConfirm, errMessage, errAgree].forEach(el => setErr(el, ""));
    if (pwToggle) pwToggle.textContent = "Show";
    password.type = "password";
  });

  // live validation (optional)
  [fullName, email, password, confirmPw, message, agree].forEach(el => {
    el.addEventListener("input", validate);
    el.addEventListener("change", validate);
  });
}
