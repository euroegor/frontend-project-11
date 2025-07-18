import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import * as yup from "yup";
import onChange from "on-change";
import initView from "./view.js";
import initI18n from "./locales/index.js";

initI18n().then(() => {
  const elements = {
    form: document.getElementById("rss-form"),
    input: document.getElementById("url-input"),
    feedback: document.querySelector(".feedback"),
  };

  const state = {
    form: {
      status: "idle", // 'valid', 'invalid'
      error: null,
    },
    urladded: [],
  };

  const watchedState = onChange(state, initView(state, elements));

  const schemaDinamic = () => {
  return yup
    .string()
    .required()
    .url()
    .notOneOf(state.urladded);
};
  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = elements.input.value.trim();

    schemaDinamic()
      .validate(url)
      .then(() => {
        watchedState.urladded.push(url);
        watchedState.form.status = "valid";
        elements.form.reset();
        elements.input.focus();
      })
      .catch((err) => {
        watchedState.form.status = "invalid";
        watchedState.form.error = err.message;
      });
  });
});
