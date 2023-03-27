// View

const headerTextEl = document.querySelector('#header-text');
const leadEl = document.querySelector('#lead');
const sampleEl = document.querySelector('#sample');
const btnAdd = document.querySelector('#button-add');
const form = document.querySelector('form');
const input = document.querySelector('#url-input');
const label = document.querySelector('label');
const feedbackWrapperEl = document.querySelector('#feedback-wrapper');

export const render = (watchedState) => {
  label.innerText = watchedState.uiState.label;
  headerTextEl.innerText = watchedState.uiState.header;
  leadEl.innerText = watchedState.uiState.lead;
  sampleEl.innerText = watchedState.uiState.sample;
  btnAdd.value = watchedState.uiState.buttonText;

  if (watchedState.formState === 'filling') {
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" class="feedback m-0 position-absolute small">
      ${watchedState.uiState.feedback}
    </p>`;
  }
  if (watchedState.formState === 'invalid') {
    input.classList.add('is-invalid');
    feedbackWrapperEl.innerHTML = `
      <p id="feedback" class="feedback m-0 position-absolute small text-danger">
      ${watchedState.uiState.feedback}
      </p>`;
  }
  if (watchedState.formState === 'not_unique') {
    input.classList.add('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" class="feedback m-0 position-absolute small text-danger">
    ${watchedState.uiState.feedback}
    </p>`;
  }
  if (watchedState.formState === 'submitted') {
    // This when rss file successfully downloaded
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-success">
      ${watchedState.uiState.feedback}
    </p>`;
    input.value = '';
  }
};

export const addFormInputHandler = (handler) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(input.value);
  });
};
