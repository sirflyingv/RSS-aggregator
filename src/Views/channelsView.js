/* eslint-disable no-tabs */
export default (watchedState, i18nInstance, elements) => {
  const { channels } = elements;
  channels.innerHTML = `
	<div class="card border-0">
	  <div class="card-body">
		<h2 class="card-title h4">${i18nInstance.t('channelsHeader')}</h2>
	  </div>
	  <ul class="list-group border-0 rounded-0"></ul>
	</div>`;
  const channelsUl = channels.querySelector('ul');

  watchedState.channels.forEach((channel) => {
    const listItemEl = document.createElement('li');
    listItemEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const titleEl = document.createElement('h3');
    titleEl.classList.add('h6', 'm-0');
    titleEl.textContent = channel.title;

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('m-0', 'small', 'text-black-50');
    descriptionEl.textContent = channel.description;
    listItemEl.appendChild(titleEl);
    listItemEl.appendChild(descriptionEl);

    channelsUl.appendChild(listItemEl);
  });
};
