/* eslint-disable object-curly-newline */
// const modalTitle = document.querySelector('.modal-title');
// const modalBody = document.querySelector('.modal-body');
// const fullArticleButton = document.querySelector('.full-article');
// const modalCloseButton = fullArticleButton.nextElementSibling;

export default (watchedState, i18nInstance, elements) => {
  const { modalTitle, modalBody, fullArticleButton, modalCloseButton } = elements;
  modalTitle.innerText = watchedState.uiState.modalPost.title;
  modalBody.innerText = watchedState.uiState.modalPost.description;
  fullArticleButton.href = watchedState.uiState.modalPost.link;
  fullArticleButton.innerText = ` ${i18nInstance.t('modalReadFull')} `;
  modalCloseButton.innerText = ` ${i18nInstance.t('modalCloseButton')} `;
};
