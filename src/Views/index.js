import renderForm from './formView';
import renderPosts from './postsView';
import renderModal from './modalView';
import renderChannels from './channelsView';

const elements = {
  headerText: document.querySelector('#header-text'),
  lead: document.querySelector('#lead'),
  sample: document.querySelector('#sample'),
  btnAdd: document.querySelector('#button-add'),
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  label: document.querySelector('label'),
  feedback: document.querySelector('#feedback'),
  posts: document.querySelector('.posts'),
  channels: document.querySelector('.feeds'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  fullArticleButton: document.querySelector('.full-article'),
  modalCloseButton: document.querySelector('#btn-close-modal'),
};

// eslint-disable-next-line object-curly-newline
export { elements, renderForm, renderPosts, renderModal, renderChannels };
