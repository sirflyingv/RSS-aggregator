import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as yup from 'yup';
import onChange from 'on-change';
import { addFormInputHandler, render } from './formView';

import i18n from 'i18next';
import locales from './locales/index.js';

export default () => {
  const i18nInstance = i18n.createInstance();

  const { ru } = locales;

  // Model
  const state = {
    links: [],
    uiState: {
      header: '',
      lead: '',
      label: '',
      buttonText: '',
      sample: '',
      feedback: '',
    },
    formState: 'filling',
  };

  i18nInstance
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    })
    .then(function (t) {
      watchedState.uiState = {
        header: i18nInstance.t('header'),
        lead: i18nInstance.t('lead'),
        label: i18nInstance.t('label'),
        buttonText: i18nInstance.t('buttonText'),
        sample: i18nInstance.t('sample'),
        feedback: i18nInstance.t('feedbackFilling'),
      };
    });

  const watchedState = onChange(state, () => {
    render(watchedState);
  });

  // controller
  const handleFormInput = (value) => {
    inputSchema
      .validate(value)
      .then((value) => {
        watchedState.links.push(value);
        watchedState.formState = 'submitted'; // it should be downloaded first
        watchedState.uiState.feedback = i18nInstance.t('feedbackSubmitted');
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  addFormInputHandler(handleFormInput);

  //   render(watchedState);

  // utils
  const inputSchema = yup
    .string()
    .required('no_input')
    .trim()
    .url((err) => {
      watchedState.formState = 'invalid';
      watchedState.uiState.feedback = i18nInstance.t('feedbackInvalid');
      return `The value ${err.value} is not a valid URL.`;
    })
    .test(
      'is unique',
      (err) => `URL ${err.value} is already added`,
      (url) => {
        const isUnique = !state.links.includes(url);
        if (!isUnique) {
          watchedState.formState = 'not_unique';
          watchedState.uiState.feedback = i18nInstance.t('feedbackNotUnique');
        }
        return isUnique;
      },
    );
};
