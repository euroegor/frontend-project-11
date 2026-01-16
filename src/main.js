import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import render from './view.js';

const state = {
  form: {
    status: 'idle', // idle | sending | success | failed
    error: null,
  },
  feeds: [],
  posts: [],
  ui: {
    readPostsIds: new Set(),
  },
};

const init = () => {
  render(state);
};

init();