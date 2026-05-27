const ADDRESS_INPUTS = {
  street1: document.getElementById("inputAddress"),
  street2: document.getElementById("inputAddress2"),
  city: document.getElementById("inputCity"),
  state: document.getElementById("inputState"),
  zipcode: document.getElementById("inputZip"),
};

const HOUSEHOLD_NAME = document.getElementById("householdName");
const HOUSEHOLD_INPUT = document.getElementById("name");
const HEADERS = Array.from(document.querySelectorAll(".editAddressHeader"));

const BUTTONS = {
  name: document.getElementById("editNameBtn"),
  address: document.getElementById("editAddressBtn"),
  submitName: document.getElementById("submitNameBtn"),
  submitAddress: document.getElementById("submitAddressBtn"),
};

// Household Name

BUTTONS.name.addEventListener("click", (e) => {
  e.preventDefault();
  changeButtons(true, "name");
});

// Household Address

BUTTONS.address.addEventListener("click", (e) => {
  e.preventDefault();
  HEADERS.forEach((header) => {
    if (!header.classList.contains("d-none")) {
      header.classList.add("d-none");
    }
  });
  changeButtons(true, "address");
  loopOverInputs(true);
});

function loopOverInputs(boolean) {
  if (boolean === true) {
    for (let address in ADDRESS_INPUTS) {
      ADDRESS_INPUTS[address].classList.remove("d-none");
      ADDRESS_INPUTS[address].setAttribute("required", "");
    }
  } else {
    return;
  }
}

function changeButtons(boolean, type) {
  if (boolean === true && type === "address") {
    BUTTONS.address.classList.add("d-none");
    BUTTONS.submitAddress.classList.remove("d-none");
  } else if (boolean === true && type === "name") {
    HOUSEHOLD_NAME.classList.add("d-none");
    HOUSEHOLD_INPUT.classList.remove("d-none");
    BUTTONS.submitName.classList.remove("d-none");
  }
}
