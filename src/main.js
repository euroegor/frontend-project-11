import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import render from "./view.js";
import onChange from "on-change";
import * as yup from "yup";

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
  render(watchedState);
});

const schema = yup
  .string()
  .trim()
  .required("Поле не должно быть пустым")
  .url("Ссылка должна быть валидным URL")
  .test("is-duplicate-rss", "RSS уже существует", (url) => {
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
    watchedState.form.status = 'success';
    watchedState.feeds.push({ url: watchedState.form.url });
    watchedState.form.url = '';
  })
  .catch((err) => {
    watchedState.form.error = err.message;
    watchedState.form.status = 'failed';
  })
});

const init = () => {
  render(watchedState);
};

init();
