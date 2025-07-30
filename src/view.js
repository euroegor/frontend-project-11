import onChange from "on-change";
import i18next from 'i18next';

export default (state, elements) => {
  const { input, feedback } = elements;
  return onChange(state, (path) => {
    if (path === "form.status" || path === "form.error") {
      if (state.form.status === "invalid") {
        feedback.textContent = state.form.error;
        input.classList.add("is-invalid");
        feedback.classList.add("text-danger");
        feedback.classList.remove("text-success");
      } else if (state.form.status === "valid") {
        feedback.textContent = i18next.t('success');
        input.classList.remove("is-invalid");
        feedback.classList.remove("text-danger");
        feedback.classList.add("text-success");
      }
    }
  });
};
