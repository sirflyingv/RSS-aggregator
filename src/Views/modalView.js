export default (watchedState, i18nInstance, elements) => {
  const {
    modalTitle,
    modalBody,
    fullArticleButton,
    modalCloseButton,
    modalWindow,
    modalBackdrop,
  } = elements;

  modalTitle.innerText = watchedState.ui.modalPost.title;
  modalBody.innerText = watchedState.ui.modalPost.description;
  fullArticleButton.href = watchedState.ui.modalPost.link;
  fullArticleButton.innerText = ` ${i18nInstance.t('modalReadFull')} `;
  modalCloseButton.innerText = ` ${i18nInstance.t('modalCloseButton')} `;

  if (watchedState.ui.showModal) {
    modalWindow.style.display = 'block';
    modalWindow.classList.add('show');
    modalBackdrop.style.display = 'block';
  }
  if (!watchedState.ui.showModal) {
    modalWindow.style.display = 'none';
    modalWindow.classList.remove('show');
    modalBackdrop.style.display = 'none';
  }
};
