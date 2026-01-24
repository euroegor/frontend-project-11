import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import render from "./view.js";
import onChange from "on-change";
import * as yup from "yup";
import initI18n from "./locales/initI18n.js";

initI18n().then((i18n) => {
  const state = {
    form: {
      status: "idle", // idle | success | failed
      error: null,
      url: "",
    },
    feeds: [],
    posts: [],
    ui: {
      readPostsIds: new Set(),
    },
  };

  const form = document.getElementById("rss-form");

  const watchedState = onChange(state, () => {
    render(watchedState, i18n);
  });

  const schema = yup
    .string()
    .trim()
    .required()
    .url()
    .test("is-duplicate-rss", "errors.duplicate", (url) => {
      if (watchedState.feeds.some((item) => item.url === url)) {
        return false;
      }
      return true;
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("url-input");
    watchedState.form.url = input.value.trim();
    schema
      .validate(watchedState.form.url)
      .then(() => {
        watchedState.form.error = null;
        watchedState.form.status = "success";
        watchedState.feeds.push({ url: watchedState.form.url });
        watchedState.form.url = "";
      })
      .catch((err) => {
        watchedState.form.error = err.message;
        watchedState.form.status = "failed";
      });
  });

  render(watchedState, i18n);
});
