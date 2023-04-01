/* eslint-disable no-tabs */
import { i18nInstance } from '../app';
const channelsEl = document.querySelector('.feeds');

export default (watchedState) => {
  channelsEl.innerHTML = `
	<div class="card border-0">
	  <div class="card-body">
		<h2 class="card-title h4">${i18nInstance.t('channelsHeader')}</h2>
	  </div>
	  <ul class="list-group border-0 rounded-0"></ul>
	</div>`;
  const channelsUl = channelsEl.querySelector('ul');

  watchedState.channels.forEach((channel) => {
    const channelHTML = `
	  <li class="list-group-item border-0 border-end-0">
		<h3 class="h6 m-0">${channel.title}</h3>
		<p class="m-0 small text-black-50">${channel.description}</p>
	  </li>`;
    channelsUl.insertAdjacentHTML('afterbegin', channelHTML);
  });
};
