/* eslint-disable object-curly-newline */

export default (watchedState, i18nInstance, elements) => {
  const { label, headerText, lead, sample, btnAdd, input, feedback } = elements;
  label.innerText = i18nInstance.t('label');
  headerText.innerText = i18nInstance.t('header');
  lead.innerText = i18nInstance.t('lead');
  sample.innerText = i18nInstance.t('sample');
  btnAdd.innerText = i18nInstance.t('buttonText');
  input.placeholder = i18nInstance.t('placeholder');

  switch (watchedState.form.valid) {
    case false:
      input.classList.add('is-invalid');
      break;

    case true:
      input.classList.remove('is-invalid');
      break;

    default:
      //
      break;
  }

  switch (watchedState.fetch.state) {
    case 'idle':
      btnAdd.removeAttribute('disabled');
      input.removeAttribute('disabled');
      feedback.classList.remove('text-danger');
      break;
    case 'fail':
      btnAdd.removeAttribute('disabled');
      input.removeAttribute('disabled');
      feedback.classList.add('text-danger');
      break;
    case 'fetching':
      btnAdd.setAttribute('disabled', true);
      input.setAttribute('disabled', true);
      feedback.classList.remove('text-danger');
      feedback.innerText = i18nInstance.t('feedbackAwaitingHollow');
      break;
    case 'submitted':
      btnAdd.removeAttribute('disabled');
      input.removeAttribute('disabled');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.innerText = i18nInstance.t('feedbackSubmitted');
      input.value = '';
      break;
    default:
      //
      break;
  }

  switch (watchedState.fetch.error) {
    // case 'startup':
    //   feedback.innerText = i18nInstance.t('feedbackFilling');
    //   break;
    case 'no_input':
      // feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackNoInput');
      break;
    case 'invalid_URL':
      feedback.innerText = i18nInstance.t('feedbackInvalid');
      // feedback.classList.add('text-danger');
      break;
    case 'not_unique':
      // feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackNotUnique');
      break;
    // case 'fetching':
    //   btnAdd.setAttribute('disabled', true);
    //   input.setAttribute('disabled', true);
    //   feedback.classList.remove('text-danger');
    //   feedback.innerText = i18nInstance.t('feedbackAwaitingHollow');
    //   break;
    case 'invalid_rss':
      // btnAdd.removeAttribute('disabled');
      // input.removeAttribute('disabled');
      // feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackRssInvalid');
      input.value = '';
      break;
    // case 'submitted':
    //   // btnAdd.removeAttribute('disabled');
    //   // input.removeAttribute('disabled');
    //   // feedback.classList.add('text-success');
    //   // feedback.classList.remove('text-danger');
    //   feedback.innerText = i18nInstance.t('feedbackSubmitted');
    //   input.value = '';
    //   break;
    case 'network_error':
      // btnAdd.removeAttribute('disabled');
      // input.removeAttribute('disabled');
      // feedback.classList.add('text-danger');
      feedback.innerText = i18nInstance.t('feedbackNetworkError');
      input.value = '';
      break;
    default:
      //
      break;
  }
};
