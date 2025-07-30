import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import * as yup from "yup";
import initView from "./view.js";
import initI18n from "./locales/initI18n.js";
import i18next from "i18next";

const runApp = async () => {
  await initI18n();

 yup.setLocale({
    string: {
      url: () => i18next.t('errors.invalidUrl'),
      required: () => i18next.t('errors.invalidUrl'),
    },
    mixed: {
      notOneOf: () => i18next.t('errors.notOneOf'),
    },
  });
  console.log(i18next.t('errors.invalidUrl'))

  const state = {
    form: {
      status: "idle", // 'valid' 'invalid'
      error: null,
    },
    urls: [],
  };

  const form = document.getElementById("rss-form");
  const input = document.getElementById("url-input");
  const feedback = document.querySelector(".feedback");

  const elements = { form, input, feedback };
  const watchedState = initView(state, elements);

   const schema = () => yup
    .string()
    .trim()
    .required()
    .url()
    .notOneOf(state.urls);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = input.value.trim();
    schema()
      .validate(url)
      .then(() => {
        watchedState.form.status = "valid";
        watchedState.form.error = null;
        watchedState.urls.push(url);
        input.value = "";
        input.focus();
      })
      .catch((err) => {
        console.log(err.message);
        watchedState.form.status = "invalid";
        watchedState.form.error = err.message;
      });
  });
};

runApp();
