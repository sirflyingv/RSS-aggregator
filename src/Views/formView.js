/* eslint-disable object-curly-newline */

// const headerTextEl = document.querySelector('#header-text');
// const leadEl = document.querySelector('#lead');
// const sampleEl = document.querySelector('#sample');
// const btnAdd = document.querySelector('#button-add');
const formOLD = document.querySelector('form');
const inputOLD = document.querySelector('#url-input');
// const label = document.querySelector('label');
// const feedback = document.querySelector('#feedback');

export const renderForm = (watchedState, i18nInstance, elements) => {
  const { label, headerText, lead, sample, btnAdd, input, feedback } = elements;
  label.innerText = i18nInstance.t('label');
  headerText.innerText = i18nInstance.t('header');
  lead.innerText = i18nInstance.t('lead');
  sample.innerText = i18nInstance.t('sample');
  btnAdd.innerText = i18nInstance.t('buttonText');
  input.placeholder = i18nInstance.t('placeholder');

  if (watchedState.formState === 'filling') {
    input.classList.remove('is-invalid');
    feedback.innerText = i18nInstance.t('feedbackFilling');
  }
  if (watchedState.formState === 'no_input') {
    feedback.classList.add('text-danger'); //
    feedback.innerText = i18nInstance.t('feedbackNoInput');
  }
  if (watchedState.formState === 'invalid_URL') {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.innerText = i18nInstance.t('feedbackInvalid');
  }
  if (watchedState.formState === 'not_unique') {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.innerText = i18nInstance.t('feedbackNotUnique');
  }
  if (watchedState.formState === 'awaiting') {
    btnAdd.setAttribute('disabled', true);
    input.setAttribute('disabled', true);
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.innerText = i18nInstance.t('feedbackAwaitingHollow');
    // feedback.innerText = `${JSON.stringify(watchedState)}`;
  }
  if (watchedState.formState === 'invalid_rss') {
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedback.classList.add('text-danger');
    feedback.innerText = i18nInstance.t('feedbackRssInvalid');

    input.value = '';
  }
  if (watchedState.formState === 'submitted') {
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    feedback.innerText = i18nInstance.t('feedbackSubmitted');
    input.value = '';
  }
  if (watchedState.formState === 'network_error') {
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedback.classList.add('text-danger');
    feedback.innerText = i18nInstance.t('feedbackNetworkError');
    input.value = '';
  }
};

export const addFormInputHandler = (handler) => {
  formOLD.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(inputOLD.value);
  });
};
