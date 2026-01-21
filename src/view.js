const render = (watchedState) => {
  const feedback = document.querySelector(".feedback");
  const input = document.getElementById("url-input");
  input.value = watchedState.form.url;

  if (watchedState.form.status === "failed") {
    input.classList.add("is-invalid");
    feedback.classList.remove("text-success");
    feedback.classList.add("text-danger");
  } else {
    input.classList.remove("is-invalid");
  }
  if (watchedState.form.status === "failed") {
    feedback.textContent = watchedState.form.error;
  } else if (watchedState.form.status === "success") {
    input.classList.remove("is-invalid");
    feedback.textContent = "RSS успешно загружен";
    feedback.classList.remove("text-danger");
    feedback.classList.add("text-success");
    input.focus();
  } else if (watchedState.form.status === "idle") {
    feedback.textContent = "";
    feedback.classList.remove("text-danger", "text-success");
  }
};

export default render;
