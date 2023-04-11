/* eslint-disable object-curly-newline */

export default (watchedState, i18nInstance, elements) => {
  const { label, headerText, lead, sample, btnAdd, input, feedback } = elements;
  label.innerText = i18nInstance.t('label');
  headerText.innerText = i18nInstance.t('header');
  lead.innerText = i18nInstance.t('lead');
  sample.innerText = i18nInstance.t('sample');
  btnAdd.innerText = i18nInstance.t('buttonText');
  input.placeholder = i18nInstance.t('placeholder');

  switch (watchedState.form) {
    case 'invalid':
      input.classList.add('is-invalid');
      break;

    case 'valid':
      input.classList.remove('is-invalid');
      break;

    default:
      //
      break;
  }

  switch (watchedState.process) {
    case 'startup':
      // input.classList.remove('is-invalid');
      feedback.innerText = i18nInstance.t('feedbackFilling');
      break;
    case 'no_input':
      feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackNoInput');
      break;
    case 'invalid_URL':
      // input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackInvalid');
      break;
    case 'not_unique':
      // input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackNotUnique');
      break;
    case 'awaiting':
      btnAdd.setAttribute('disabled', true);
      input.setAttribute('disabled', true);
      // input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.innerText = i18nInstance.t('feedbackAwaitingHollow');
      break;
    case 'invalid_rss':
      btnAdd.removeAttribute('disabled');
      input.removeAttribute('disabled');
      // input.classList.remove('is-invalid');
      feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackRssInvalid');
      input.value = '';
      break;
    case 'submitted':
      btnAdd.removeAttribute('disabled');
      input.removeAttribute('disabled');
      // input.classList.remove('is-invalid');
      feedback.classList.add('text-success');
      feedback.classList.remove('text-danger');
      feedback.innerText = i18nInstance.t('feedbackSubmitted');
      input.value = '';
      break;
    case 'network_error':
      btnAdd.removeAttribute('disabled');
      input.removeAttribute('disabled');
      // input.classList.remove('is-invalid');
      feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackNetworkError');
      input.value = '';
      break;
    default:
      // handle unexpected formState value
      break;
  }
};
