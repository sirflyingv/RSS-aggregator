// View
import { i18nInstance } from './app';

const headerTextEl = document.querySelector('#header-text');
const leadEl = document.querySelector('#lead');
const sampleEl = document.querySelector('#sample');
const btnAdd = document.querySelector('#button-add');
const form = document.querySelector('form');
const input = document.querySelector('#url-input');
const label = document.querySelector('label');
const feedbackWrapperEl = document.querySelector('#feedback-wrapper');

export const render = (watchedState) => {
  label.innerText = i18nInstance.t('label');
  headerTextEl.innerText = i18nInstance.t('header');
  leadEl.innerText = i18nInstance.t('lead');
  sampleEl.innerText = i18nInstance.t('sample');
  btnAdd.value = i18nInstance.t('buttonText');
  input.placeholder = i18nInstance.t('placeholder');

  if (watchedState.formState === 'filling') {
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" class="feedback m-0 position-absolute small">
      ${i18nInstance.t('feedbackFilling')}
    </p>`;
  }
  if (watchedState.formState === 'invalid') {
    input.classList.add('is-invalid');
    feedbackWrapperEl.innerHTML = `
      <p id="feedback" class="feedback m-0 position-absolute small text-danger">
      ${i18nInstance.t('feedbackInvalid')}
      </p>`;
  }
  if (watchedState.formState === 'not_unique') {
    input.classList.add('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" class="feedback m-0 position-absolute small text-danger">
    ${i18nInstance.t('feedbackNotUnique')}
    </p>`;
  }
  if (watchedState.formState === 'awaiting') {
    btnAdd.setAttribute('disabled', true);
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small">
      ${''}
    </p>`;
    input.value = '';
  }
  if (watchedState.formState === 'invalid_rss') {
    btnAdd.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-danger">
      ${'Ресурс не содержит валидный RSS'}
    </p>`;
    input.value = '';
  }
  if (watchedState.formState === 'submitted') {
    // This when rss file successfully downloaded
    btnAdd.removeAttribute('disabled');
    // input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-success">
      ${i18nInstance.t('feedbackSubmitted')}
    </p>`;
    input.value = '';
  }

  // rendering rss
  // console.log(watchedState.links);
};

export const addFormInputHandler = (handler) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(input.value);
  });
};
// https://www.pinkbike.com/pinkbike_xml_feed.php
