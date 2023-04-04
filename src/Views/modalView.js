/* eslint-disable object-curly-newline */

export default (watchedState, i18nInstance, elements) => {
  const { modalTitle, modalBody, fullArticleButton, modalCloseButton } = elements;
  modalTitle.innerText = watchedState.uiState.modalPost.title;
  modalBody.innerText = watchedState.uiState.modalPost.description;
  fullArticleButton.href = watchedState.uiState.modalPost.link;
  fullArticleButton.innerText = ` ${i18nInstance.t('modalReadFull')} `;
  modalCloseButton.innerText = ` ${i18nInstance.t('modalCloseButton')} `;
};
