import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import render from "./view.js";
import onChange from "on-change";
import * as yup from "yup";
import initI18n from "./locales/initI18n.js";
import axios from "axios";
import parseRss from "./parsers/rss.js";

initI18n().then((i18n) => {
  const state = {
    form: {
      status: "idle", // idle | success | failed | sending
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

  const makeProxyUrl = (url) => {
    const proxy = "https://allorigins.hexlet.app/get";
    const params = new URLSearchParams({
      disableCache: "true",
      url,
    });

    return `${proxy}?${params.toString()}`;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("url-input");
    watchedState.form.url = input.value.trim();
    schema
      .validate(watchedState.form.url)
      .then(() => {
        watchedState.form.status = "sending";
        watchedState.form.error = null;
        return axios.get(makeProxyUrl(watchedState.form.url));
      })
      .then((response) => {
        const xml = response.data.contents;
        return parseRss(xml);
      })
      .then(({ feed, posts }) => {
        const url = watchedState.form.url;
        const randomId = crypto.randomUUID();
        const newFeed = {
          id: randomId,
          url: url,
          title: feed.title,
          description: feed.description,
        };
        const newPosts = posts.map((item) => {
          return {
            id: crypto.randomUUID(),
            feedId: randomId,
            title: item.title,
            description: item.description,
            link: item.link,
          };
        });
        watchedState.feeds.push(newFeed);
        watchedState.posts = newPosts.concat(watchedState.posts);
        watchedState.form.status = "success";
        watchedState.form.url = "";
        watchedState.form.error = null;
      })
      .catch((err) => {
        watchedState.form.error = err.message || "errors.network";
        watchedState.form.status = "failed";
      });
  });

  render(watchedState, i18n);
});
