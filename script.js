const elements = {
  form: document.querySelector(".js-search"),
  formContainer: document.querySelector(".js-form-container"),
  list: document.querySelector(".js-list"),
  buttonAdd: document.querySelector(".js-add"),
  buttonRemove: document.querySelector(".js-remove"),
};

const { form, formContainer, list, buttonAdd, buttonRemove } = elements;

buttonAdd.addEventListener("click", handlerAddField);
buttonRemove.addEventListener("click", handlerRemoveField);
form.addEventListener("submit", handlerSearch);

async function handlerSearch(evt) {
  evt.preventDefault();
  const formData = new FormData(evt.currentTarget);
  const countries = formData.getAll("country");

  try {
    const capitals = await serviceGetCountries(countries);
    const weather = await serviceGetWeather(capitals);

    list.innerHTML = createMarkup(weather);
  } catch (error) {
    console.log(error);
  } finally {
    formContainer.innerHTML = `<input type="text" name="country"/>`;
  }
}

async function serviceGetCountries(arr) {
  const promises = arr.map(async (country) => {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
  const data = await Promise.allSettled(promises);
  return data
    .filter(({ status }) => status === "fulfilled")
    .map(({ value }) => value[0].capital[0]);
}

async function serviceGetWeather(arr) {
  const API_KEY = "61069fb8abf74210b7d232148231510";
  const BASE_URL = "http://api.weatherapi.com/v1";
  const END_POINT = "/current.json";

  const promises = arr.map(async (capital) => {
    const params = new URLSearchParams({
      key: API_KEY,
      q: capital,
      lang: "en",
    });
    const response = await fetch(`${BASE_URL}${END_POINT}?${params}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
  const data = await Promise.allSettled(promises);
  return data
    .filter(({ status }) => status === "fulfilled")
    .map(
      ({
        value: {
          location: { country, name },
          current: {
            temp_c,
            condition: { icon, text },
          },
        },
      }) => {
        return { country, name, temp_c, icon, text };
      }
    );
}

function handlerAddField() {
  formContainer.insertAdjacentHTML(
    "beforeend",
    `<input type="text" name="country"/>`
  );
}

function handlerRemoveField() {
  const { children, lastElementChild } = formContainer;

  if (children.length === 1) {
    return;
  }

  lastElementChild.remove();
}

function createMarkup(arr) {
  return arr
    .map(
      ({ country, name, temp_c, icon, text }) =>
        ` 
       <li>
        <img src="${icon}" alt="${text}" />
        <h2>${name}</h2>
        <h2>${country}</h2>
        <p>${text}</p>
        <p class="temp">${temp_c} ˚C</p>
      </li>`
    )
    .join("");
}
