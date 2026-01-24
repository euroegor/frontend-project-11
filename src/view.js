const render = (watchedState, i18n) => {
  const feedsContainer = document.getElementById("feeds-container");
  const postsContainer = document.getElementById("posts-container");
  const feedback = document.querySelector(".feedback");
  const input = document.getElementById("url-input");
  input.value = watchedState.form.url;

  if (watchedState.form.status === "sending") {
    input.classList.remove("is-invalid");
  } else if (watchedState.form.status === "failed") {
    input.classList.add("is-invalid");
    feedback.classList.remove("text-success");
    feedback.classList.add("text-danger");
  } else {
    input.classList.remove("is-invalid");
  }
  if (watchedState.form.status === "failed") {
    feedback.textContent = i18n.t(watchedState.form.error);
  } else if (watchedState.form.status === "success") {
    input.classList.remove("is-invalid");
    feedback.textContent = i18n.t("feedback.success");
    feedback.classList.remove("text-danger");
    feedback.classList.add("text-success");
    input.focus();
  } else if (watchedState.form.status === "idle") {
    feedback.textContent = "";
    feedback.classList.remove("text-danger", "text-success");
  }

  feedsContainer.innerHTML = "";
  watchedState.feeds.forEach((feed) => {
    const feedEl = document.createElement("div");
    const titleEl = document.createElement("h2");
    titleEl.textContent = feed.title;
    const descEl = document.createElement("p");
    descEl.textContent = feed.description;
    feedEl.append(titleEl, descEl);
    feedsContainer.append(feedEl);
  });
  postsContainer.innerHTML = "";
  const ul = document.createElement("ul");
  watchedState.posts.forEach((post) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = post.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = post.title;
    li.append(link);
    ul.append(li);
  });
  postsContainer.append(ul);
};

export default render;
