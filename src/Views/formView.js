import _ from 'lodash';
import { i18nInstance } from '../app';

const headerTextEl = document.querySelector('#header-text');
const leadEl = document.querySelector('#lead');
const sampleEl = document.querySelector('#sample');
const btnAdd = document.querySelector('#button-add');
const form = document.querySelector('form');
const input = document.querySelector('#url-input');
const label = document.querySelector('label');
const feedbackWrapperEl = document.querySelector('#feedback-wrapper');

export const renderForm = (watchedState) => {
  label.innerText = i18nInstance.t('label');
  headerTextEl.innerText = i18nInstance.t('header');
  leadEl.innerText = i18nInstance.t('lead');
  sampleEl.innerText = i18nInstance.t('sample');
  btnAdd.innerText = i18nInstance.t('buttonText');
  input.placeholder = i18nInstance.t('placeholder');

  if (watchedState.formState === 'filling') {
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" class="feedback m-0 position-absolute small">${i18nInstance.t(
      'feedbackFilling',
    )}</p>`;
  }
  if (watchedState.formState === 'no_input') {
    // input.classList.add('is-invalid');
    feedbackWrapperEl.innerHTML = `
      <p id="feedback" class="feedback m-0 position-absolute small text-danger">${i18nInstance.t(
        'feedbackNoInput',
      )}</p>`;
  }
  if (watchedState.formState === 'invalid') {
    input.classList.add('is-invalid');
    feedbackWrapperEl.innerHTML = `
      <p id="feedback" class="feedback m-0 position-absolute small text-danger">${i18nInstance.t(
        'feedbackInvalid',
      )}</p>`;
  }
  if (watchedState.formState === 'not_unique') {
    input.classList.add('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" class="feedback m-0 position-absolute small text-danger">${i18nInstance.t(
      'feedbackNotUnique',
    )}</p>`;
  }
  if (watchedState.formState === 'awaiting') {
    btnAdd.setAttribute('disabled', true);
    input.setAttribute('disabled', true);
    input.classList.remove('is-invalid');
    // feedbackWrapperEl.innerHTML = `
    // <p id="feedback"
    //   class="feedback m-0 position-absolute small">${i18nInstance.t(
    //     'feedbackAwaiting',
    //   )}</p>`;
    // input.value = '';
  }
  if (watchedState.formState === 'invalid_rss') {
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-danger">${i18nInstance.t(
        'feedbackRssInvalid',
      )}</p>`;
    input.value = '';
  }
  if (watchedState.formState === 'parsing_error') {
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-danger">${i18nInstance.t(
        'feedbackparsingError',
      )}</p>`;
    input.value = '';
  }
  if (watchedState.formState === 'submitted') {
    // btnAdd.removeAttribute('disabled');
    // input.removeAttribute('disabled');
    // input.classList.remove('is-invalid');
    // feedbackWrapperEl.innerHTML = `
    // <p id="feedback"
    //   class="feedback m-0 position-absolute small text-success">${i18nInstance.t(
    //     'feedbackSubmitted',
    //   )}</p>`;
    // input.value = '';

    btnAdd.disabled = false;
    input.disabled = false;
    input.classList.remove('is-invalid');
    input.value = '';
    const feedbackEl = document.createElement('p');
    feedbackEl.id = 'feedback';
    feedbackEl.classList.add(
      'feedback',
      'm-0',
      'position-absolute',
      'small',
      'text-success',
    );
    feedbackEl.textContent = 'RSS успешно загружен';
    feedbackWrapperEl.innerHTML = '';
    feedbackWrapperEl.appendChild(feedbackEl);
  }
  if (watchedState.formState === 'network_error') {
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-danger">${i18nInstance.t(
        'feedbackNetworkError',
      )}</p>`;
    input.value = '';
  }
};

export const addFormInputHandler = (handler) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(input.value);
  });
};
