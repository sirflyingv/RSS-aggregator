/* eslint-disable no-tabs */
export default (watchedState, i18nInstance, elements) => {
  const { posts } = elements;
  posts.innerHTML = `
		<div class="card border-0">
		  <div class="card-body">
			<h2 class="card-title h4">${i18nInstance.t('postsHeader')}</h2>
		  </div>
		  <ul class="list-group border-0 rounded-0"></ul>
		</div>`;
  const postsUl = posts.querySelector('ul');

  watchedState.posts.forEach((post) => {
    const isRead = watchedState.ui.readPostsIds.some((id) => id === post.postId);
    const postEl = document.createElement('li');
    postEl.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    postEl.dataset.postId = post.postId;

    const linkEl = document.createElement('a');
    linkEl.href = post.link;
    linkEl.classList.add('fw-bold');
    if (isRead) {
      linkEl.classList.add('fw-normal', 'link-secondary');
    }
    linkEl.dataset.postLink = true;
    linkEl.dataset.id = '6';
    linkEl.target = '_blank';
    linkEl.rel = 'noopener noreferrer';
    linkEl.textContent = post.title;

    const buttonEl = document.createElement('button');
    buttonEl.type = 'button';
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'btn-show-modal');
    buttonEl.dataset.id = '6';
    buttonEl.dataset.bsToggle = 'modal';
    buttonEl.dataset.bsTarget = '#modal';
    buttonEl.textContent = i18nInstance.t('postOpenBtn');

    postEl.appendChild(linkEl);
    postEl.appendChild(buttonEl);

    postsUl.insertAdjacentElement('afterbegin', postEl);
  });
};
