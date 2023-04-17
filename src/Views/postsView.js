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
    // const postlHTML = `
    // 	  <li
    // eslint-disable-next-line max-len
    // 	  class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"
    // 	  data-post-id="${post.postId}"
    // 	  >
    // 	  <a
    // 		href="${post.link}"
    // 		class="${isRead ? 'fw-normal link-secondary' : 'fw-bold'}"
    // 		data-post-link="true"
    // 		data-id="6"
    // 		target="_blank"
    // 		rel="noopener noreferrer"
    // 	  >${post.title}</a>
    // 	  <button
    // 		type="button"
    // 		class="btn btn-outline-primary btn-sm btn-show-modal"
    // 		data-id="6"
    // 		data-bs-toggle="modal"
    // 		data-bs-target="#modal"
    // 	  >
    // 	  ${i18nInstance.t('postOpenBtn')}
    // 	  </button>
    // 	</li>
    // 	`;
    const postElement = document.createElement('li');
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    postElement.dataset.postId = post.postId;

    const linkElement = document.createElement('a');
    linkElement.href = post.link;
    linkElement.classList.add('fw-bold');
    if (isRead) {
      linkElement.classList.add('fw-normal', 'link-secondary');
    }
    linkElement.dataset.postLink = true;
    linkElement.dataset.id = '6';
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.textContent = post.title;

    const buttonElement = document.createElement('button');
    buttonElement.type = 'button';
    buttonElement.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'btn-show-modal');
    buttonElement.dataset.id = '6';
    buttonElement.dataset.bsToggle = 'modal';
    buttonElement.dataset.bsTarget = '#modal';
    buttonElement.textContent = i18nInstance.t('postOpenBtn');

    postElement.appendChild(linkElement);
    postElement.appendChild(buttonElement);

    // postsUl.insertAdjacentHTML('afterbegin', postlHTML);
    postsUl.appendChild(postElement);
  });
};
