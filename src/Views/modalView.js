export default (watchedState, i18nInstance, elements) => {
  const {
    modalTitle,
    modalBody,
    fullArticleButton,
    modalCloseButton,
    modalWindow,
    modalBackdrop,
  } = elements;

  const modalPost = watchedState.posts.find(
    (post) => post.postId === watchedState.ui.modalPostId,
  );

  modalTitle.innerText = modalPost.title;
  modalBody.innerText = modalPost.description;
  fullArticleButton.href = modalPost.link;
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
