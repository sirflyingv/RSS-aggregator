// View
import _ from 'lodash';
import { i18nInstance } from './app';

const headerTextEl = document.querySelector('#header-text');
const leadEl = document.querySelector('#lead');
const sampleEl = document.querySelector('#sample');
const btnAdd = document.querySelector('#button-add');
const form = document.querySelector('form');
const input = document.querySelector('#url-input');
const label = document.querySelector('label');
const feedbackWrapperEl = document.querySelector('#feedback-wrapper');

const feedsEl = document.querySelector('.feeds');
const postsEl = document.querySelector('.posts');

const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const fullArticleButton = document.querySelector('.full-article');

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
    input.setAttribute('disabled', true);
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small">
      ${i18nInstance.t('feedbackAwaiting')}
    </p>`;
    input.value = '';
  }
  if (watchedState.formState === 'invalid_rss') {
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-danger">
      ${i18nInstance.t('feedbackRssInvalid')}
    </p>`;
    input.value = '';
  }
  if (watchedState.formState === 'submitted') {
    // This when rss file successfully downloaded
    btnAdd.removeAttribute('disabled');
    input.removeAttribute('disabled');
    // input.classList.remove('is-invalid');
    feedbackWrapperEl.innerHTML = `
    <p id="feedback" 
      class="feedback m-0 position-absolute small text-success">
      ${i18nInstance.t('feedbackSubmitted')}
    </p>`;
    input.value = '';
  }

  // rendering rss
  if (watchedState.channels.length > 0) {
    // feeds
    feedsEl.innerHTML = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">Фиды</h2>
      </div>
      <ul class="list-group border-0 rounded-0"></ul>
    </div>`;
    const feedsUl = feedsEl.querySelector('ul');

    watchedState.channels.forEach((channel) => {
      const channelHTML = `
      <li class="list-group-item border-0 border-end-0">
        <h3 class="h6 m-0">${channel.title}</h3>
        <p class="m-0 small text-black-50">${channel.description}</p>
      </li>`;
      feedsUl.insertAdjacentHTML('afterbegin', channelHTML);
    });

    // posts
    postsEl.innerHTML = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">Посты</h2>
      </div>
      <ul class="list-group border-0 rounded-0"></ul>
    </div>`;
    const postsUl = postsEl.querySelector('ul');

    watchedState.posts.forEach((post) => {
      const isRead = watchedState.uiState.readPosts.some(
        (readPost) => readPost.link === post.link,
      );
      const postlHTML = `
      <li
      class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"
    >
      <a
        href="${post.link}"
        class="${isRead ? 'fw-normal link-secondary' : 'fw-bold'}"
        data-id="6"
        target="_blank"
        rel="noopener noreferrer"
      >${post.title}</a>
      <button
        type="button"
        class="btn btn-outline-primary btn-sm"
        data-id="6"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
      ${i18nInstance.t('postOpenBtn')}
      </button>
    </li>
    `;
      postsUl.insertAdjacentHTML('afterbegin', postlHTML);
    });
  }

  // rendering modal
  modalTitle.innerText = watchedState.uiState.modalPost.title;
  modalBody.innerText = watchedState.uiState.modalPost.description;
  fullArticleButton.href = watchedState.uiState.modalPost.link;
};

export const addFormInputHandler = (handler) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(input.value);
  });
};

export const addShowButtonHandler = (handler) => {
  postsEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.type !== 'button') return;
    const postLink = e.target.previousElementSibling.href;
    handler(postLink);
  });
};

// https://www.pinkbike.com/pinkbike_xml_feed.php
