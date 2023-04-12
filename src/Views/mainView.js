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
      console.log('false');
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      break;
    case true:
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      break;
    default:
      //
      break;
  }

  switch (watchedState.form.error) {
    case 'no_input':
      feedback.innerText = i18nInstance.t('feedbackNoInput');
      break;
    case 'invalid_URL':
      feedback.innerText = i18nInstance.t('feedbackInvalid');
      break;
    case 'not_unique':
      feedback.innerText = i18nInstance.t('feedbackNotUnique');
      break;
    default:
      //
      break;
  }

  switch (watchedState.fetch.state) {
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
    // case 'no_input':
    //   feedback.innerText = i18nInstance.t('feedbackNoInput');
    //   break;
    // case 'invalid_URL':
    //   feedback.innerText = i18nInstance.t('feedbackInvalid');
    //   break;
    // case 'not_unique':
    //   feedback.innerText = i18nInstance.t('feedbackNotUnique');
    //   break;
    case 'invalid_rss':
      feedback.innerText = i18nInstance.t('feedbackRssInvalid');
      input.value = '';
      break;
    case 'network_error':
      feedback.innerText = i18nInstance.t('feedbackNetworkError');
      input.value = '';
      break;
    default:
      //
      break;
  }
};
