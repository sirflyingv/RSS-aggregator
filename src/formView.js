import { state } from './index.js';
// View

const form = document.querySelector('form');
const input = document.querySelector('#url-input');
const inputFeedbackEl = document.querySelector('#invalid-url-alert');

export const render = () => {
  if (state.formState === 'filling') {
    form.reset();
    input.classList.remove('is-invalid');
    inputFeedbackEl.innerText = '';
  }
  if (state.formState === 'invalid') {
    inputFeedbackEl.classList.remove('text-success');
    inputFeedbackEl.classList.add('text-danger');
    input.classList.add('is-invalid');
    inputFeedbackEl.innerText = 'Ссылка должна быть валидным URL';
  }
  if (state.formState === 'repeated_value') {
    inputFeedbackEl.classList.remove('text-success');
    inputFeedbackEl.classList.add('text-danger');
    input.classList.add('is-invalid');
    inputFeedbackEl.innerText = 'RSS уже существует';
  }
  if (state.formState === 'submitted') {
    // This when rss file successfully downloaded
    input.classList.remove('is-invalid');
    inputFeedbackEl.classList.remove('text-danger');
    inputFeedbackEl.classList.add('text-success');
    inputFeedbackEl.innerText = 'RSS успешно загружен';
  }
};

export const addFormInputHandler = (handler) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(input.value);
  });
};
