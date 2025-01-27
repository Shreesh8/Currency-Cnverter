const BASE_URL = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_nhO7d7mEV7Bnp3yrW5TrzwzD298uuKV1pSurABTQ";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (select) => {
  const flagUrl = `https://flagsapi.com/${countryList[select.value]}/flat/64.png`;
  select.parentElement.querySelector('img').src = flagUrl;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    const exchangeRate = data.data[toCurr.value];
    msg.innerText = `${amtVal} ${fromCurr.value} = ${(amtVal * exchangeRate).toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    msg.innerText = "Failed to fetch exchange rate.";
  }
};

btn.addEventListener("click", (event) => {
  event.preventDefault();
  updateExchangeRate();
});