import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as yup from 'yup';
import onChange from 'on-change';
import { addFormInputHandler, render } from './formView';

// Model
export const state = {
  links: [],
  formState: 'filling',
};

const watchedState = onChange(state, render);

// controller
const handleFormInput = (value) => {
  inputSchema
    .validate(value)
    .then((value) => {
      watchedState.links.push(value);
      watchedState.formState = 'submitted'; // it should be downloaded first
    })
    .catch((err) => {
      if (err.message === 'invalid URL') watchedState.formState = 'invalid';
      if (err.message === 'already added') watchedState.formState = 'repeated_value';
      console.error(err);
    });
};

addFormInputHandler(handleFormInput);

render();
// utils
const inputSchema = yup
  .string()
  .trim()
  .url('invalid URL')
  .test('is unique', 'already added', (url) => !state.links.includes(url));
