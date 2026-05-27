const BUTTONS = {
  nameBtn: document.getElementById("editNameBtn"),
  emailBtn: document.getElementById("editEmailBtn"),
  salaryBtn: document.getElementById("editSalaryBtn"),
};
const PLACEHOLDERS = {
  namePlaceholder: document.getElementById("namePlaceholder"),
  emailPlaceholder: document.getElementById("emailPlaceholder"),
  salaryPlaceholder: document.getElementById("salaryPlaceholder"),
};

const INPUTS_CONTAINER = {
  name: document.getElementById("nameInput"),
  email: document.getElementById("emailInput"),
  salary: document.getElementById("salaryInput"),
};

const INPUTS = {
  name: document.getElementById("displayname"),
  email: document.getElementById("email"),
  salary: document.getElementById("salary"),
};

for (let button in BUTTONS) {
  BUTTONS[button].addEventListener("click", (e) => {
    e.preventDefault();
    addClass(BUTTONS[button]);
  });
}

for (let placeholder in PLACEHOLDERS) {
  for (let input in INPUTS) {
    INPUTS[input].addEventListener("blur", (e) => {
      if (
        INPUTS[input].value == "" &&
        PLACEHOLDERS[placeholder].classList.contains("d-none")
      ) {
        PLACEHOLDERS[placeholder].classList.remove("d-none");
        INPUTS_CONTAINER[input].classList.add("d-none");
      }
    });
  }
}

function addClass(button) {
  if (button === BUTTONS.nameBtn) {
    if (!PLACEHOLDERS.namePlaceholder.classList.contains("d-none")) {
      PLACEHOLDERS.namePlaceholder.classList.add("d-none");
      INPUTS_CONTAINER.name.classList.remove("d-none");
      INPUTS.name.focus();
    }
  } else if (button === BUTTONS.emailBtn) {
    if (!PLACEHOLDERS.emailPlaceholder.classList.contains("d-none")) {
      PLACEHOLDERS.emailPlaceholder.classList.add("d-none");
      INPUTS_CONTAINER.email.classList.remove("d-none");
      INPUTS.email.focus();
    }
  } else {
    if (!PLACEHOLDERS.salaryPlaceholder.classList.contains("d-none")) {
      PLACEHOLDERS.salaryPlaceholder.classList.add("d-none");
      INPUTS_CONTAINER.salary.classList.remove("d-none");
      INPUTS.salary.focus();
    }
  }
}
