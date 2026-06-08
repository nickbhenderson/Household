const headers = document.querySelector("#headers");
const formCards = document.querySelectorAll(".newHousehold");

headers.style.opacity = "0";

formCards.forEach((formCard) => {
  formCard.style.opacity = "0";
});

const delayedTextCrawl = (object, delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      object.style.opacity === "0"
        ? (object.style.opacity = "1")
        : (object.style.opacity = "0");
      resolve();
    }, delay);
  });
};

const removeHeaders = (delay) => {
  setTimeout(() => {
    headers.remove();
  }, delay);
};

async function changeTextOpacity() {
  await delayedTextCrawl(headers, 1000);
  await delayedTextCrawl(headers, 2000);
  removeHeaders(1000);

  for (const formCard of formCards) {
    await delayedTextCrawl(formCard, 1000);
  }
}

changeTextOpacity();