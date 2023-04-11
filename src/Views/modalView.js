/* eslint-disable object-curly-newline */

export default (watchedState, i18nInstance, elements) => {
  const { modalTitle, modalBody, fullArticleButton, modalCloseButton } = elements;
  modalTitle.innerText = watchedState.ui.modalPost.title;
  modalBody.innerText = watchedState.ui.modalPost.description;
  fullArticleButton.href = watchedState.ui.modalPost.link;
  fullArticleButton.innerText = ` ${i18nInstance.t('modalReadFull')} `;
  modalCloseButton.innerText = ` ${i18nInstance.t('modalCloseButton')} `;
};
