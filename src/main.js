import  './styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import initView from './view.js';

const elements = {
  form: document.getElementById('rss-form'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('.feedback'),
};

  const state = {
  form: {
    status: 'idle', // 'valid', 'invalid'
    error: null,
  },
  urladded: [],
};

const watchedState = onChange(state, initView(state, elements));

const schema = yup
  .string()
  .required('Поле не должно быть пустым')
  .url('Ссылка должна быть валидным URL')
  .notOneOf(state.urladded, 'RSS уже существует');

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = elements.input.value.trim();

  schema
    .validate(url)
    .then(() => {
      watchedState.urladded.push(url);
      watchedState.form.status = 'valid';
      elements.form.reset();
      elements.input.focus();
    })
    .catch((err) => {
      watchedState.form.status = 'invalid';
      watchedState.form.error = err.message;
    });
});