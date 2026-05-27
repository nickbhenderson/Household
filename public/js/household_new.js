const headers = document.querySelector("#headers");
const formCard = document.querySelector("#newHousehold");

headers.style.opacity = "0";
formCard.style.opacity = "0";

const delayedTextCrawl = (object, delay) => {
  return new Promise((resolve, reject) => {
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
  await delayedTextCrawl(formCard, 1000);
}

changeTextOpacity();
