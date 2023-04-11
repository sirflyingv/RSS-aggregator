/* eslint-disable no-param-reassign */
export default (watchedState, i18nInstance, elements) => {
  elements.modalTitle.innerText = watchedState.ui.modalPost.title;
  elements.modalBody.innerText = watchedState.ui.modalPost.description;
  elements.fullArticleButton.href = watchedState.ui.modalPost.link;
  elements.fullArticleButton.innerText = ` ${i18nInstance.t('modalReadFull')} `;
  elements.modalCloseButton.innerText = ` ${i18nInstance.t('modalCloseButton')} `;

  if (watchedState.ui.showModal) {
    elements.modalWindow.style.display = 'block';
    elements.modalWindow.classList.add('show');
    elements.modalBackdrop.style.display = 'block';
  }
  if (!watchedState.ui.showModal) {
    elements.modalWindow.style.display = 'none';
    elements.modalWindow.classList.remove('show');
    elements.modalBackdrop.style.display = 'none';
  }
};
