/* eslint-disable no-tabs */
// const postsElOLD = document.querySelector('.posts');

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
    const isRead = watchedState.uiState.readPosts.some((readPost) => readPost.link === post.link);
    const postlHTML = `
		  <li
		  class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
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
};

// export const addShowButtonHandler = (handler) => {
//   postsElOLD.addEventListener('click', (e) => {
//     if (e.target.type !== 'button') return;
//     const postLink = e.target.previousElementSibling.href;
//     handler(postLink);
//   });
// };

// // not activating links used by context menu IN FACT better by :visited in css
// export const addLinkHandler = (handler) => {
//   postsElOLD.addEventListener('click', (e) => {
//     if (e.target.tagName !== 'A') return;
//     const postLink = e.target.href;
//     handler(postLink);
//   });
//   postsElOLD.addEventListener('auxclick', (e) => {
//     if (e.target.tagName !== 'A') return;
//     const postLink = e.target.href;
//     handler(postLink);
//   });
// };
