const elements = {
  form: document.querySelector(".js-search"),
  formContainer: document.querySelector(".js-form-container"),
  buttonAdd: document.querySelector(".js-add"),
  buttonRemove: document.querySelector(".js-remove"),
};

const { form, formContainer, buttonAdd, buttonRemove } = elements;

buttonAdd.addEventListener("click", handlerAddField);
buttonRemove.addEventListener("click", handlerRemoveField);
form.addEventListener("submit", handlerSearch);

function handlerSearch(evt) {
  evt.preventDefault();
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
