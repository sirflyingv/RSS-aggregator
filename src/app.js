/* eslint-disable max-len */
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import { setLocale } from 'yup';
import locales from './locales/index.js';

import { UPDATE_INTERVAL } from './config.js';
import { fetchRSS, parseXML } from './helpers.js';

// eslint-disable-next-line object-curly-newline
import { renderMain, renderPosts, renderModal, renderChannels } from './Views/index.js';

const { ru } = locales;

export default () => {
  const i18nInstance = i18n.createInstance();

  const elements = {
    body: document.querySelector('body'),
    headerText: document.querySelector('#header-text'),
    lead: document.querySelector('#lead'),
    sample: document.querySelector('#sample'),
    btnAdd: document.querySelector('#button-add'),
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    label: document.querySelector('label'),
    feedback: document.querySelector('#feedback'),
    posts: document.querySelector('.posts'),
    channels: document.querySelector('.feeds'),
    modalWindow: document.querySelector('.modal'),
    modalBackdrop: document.querySelector('.modal-backdrop'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    fullArticleButton: document.querySelector('.full-article'),
    modalCloseButton: document.querySelector('#btn-close-modal'),
  };

  // Model
  const state = {
    links: [],
    channels: [],
    posts: [],
    ui: {
      modalPost: {},
      showModal: false,
      readPostsIds: [],
    },
    form: { valid: true, error: null },
    fetch: { state: 'startup', error: null },
  };

  const watchedState = onChange(state, () => {
    renderMain(watchedState, i18nInstance, elements);
    renderModal(watchedState, i18nInstance, elements);
    if (watchedState.channels.length > 0) {
      renderChannels(watchedState, i18nInstance, elements);
      renderPosts(watchedState, i18nInstance, elements);
    }
  });

  const addChannel = (channel) => {
    const channelId = _.uniqueId('channel_');
    const idfyiedChannel = { ...channel, ...{ channelId } };
    watchedState.channels.push(idfyiedChannel);
  };

  const addPosts = (posts, channelId) => {
    const idfyiedPosts = posts.map((post) => ({
      ...post,
      ...{ postId: _.uniqueId('post_'), channelId },
    }));
    watchedState.posts.push(...idfyiedPosts);
  };

  // validating url input
  setLocale({
    mixed: {
      required: () => ({ key: 'noInput' }),
    },
    string: {
      url: () => ({ key: 'notUrl' }),
    },
  });

  const inputSchema = yup.string().trim().required().url();

  const isUrlUnique = (url) => !watchedState.channels.find((channel) => channel.url === url);

  // controller
  const handleFormSubmit = (form) => {
    watchedState.fetch.state = 'idle';
    const data = new FormData(form);
    const url = data.get('url');

    if (!isUrlUnique(url)) {
      watchedState.form = { valid: false, error: 'not_unique' };
    } else {
      inputSchema
        .validate(url)
        .then(() => {
          watchedState.form.valid = true;
          watchedState.fetch = { state: 'fetching', error: null };
          return fetchRSS(url);
        })
        .then((rssData) => {
          const parsedRss = parseXML(rssData);
          const channel = {
            url,
            title: parsedRss.rss.channel.title,
            description: parsedRss.rss.channel.description,
          };
          const posts = parsedRss.rss.items;
          addChannel(channel);
          addPosts(posts.reverse());
          watchedState.fetch = { state: 'submitted', error: null };
        })
        .catch((err) => {
          if (err.message.key === 'noInput') {
            watchedState.form = { valid: false, error: 'no_input' };
          }
          if (err.message.key === 'notUrl') {
            watchedState.form = { valid: false, error: 'invalid_URL' };
          }
          if (err.isParsingError) {
            watchedState.fetch = { state: 'fail', error: 'invalid_rss' };
          }
          if (err.code === 'ERR_NETWORK') {
            watchedState.fetch = { state: 'fail', error: 'network_error' };
          }
          console.error(err);
        });
    }
  };

  const handlePostClick = (postId) => {
    const chosenPost = watchedState.posts.find((post) => post.postId === postId);
    watchedState.ui.modalPost = chosenPost;
    watchedState.ui.showModal = true;
    watchedState.ui.readPostsIds.push(postId);
  };

  i18nInstance
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
      interpolation: { escapeValue: false },
    })
    .then(() => {
      watchedState.fetch.state = 'idle';

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(e.target);
      });

      elements.modalCloseButton.addEventListener('click', () => {
        watchedState.ui.showModal = false;
      });

      elements.modalWindow.addEventListener('click', () => {
        watchedState.ui.showModal = false;
      });

      elements.posts.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-show-modal')) return;
        const { postId } = e.target.closest('li').dataset;
        handlePostClick(postId);
      });

      elements.posts.addEventListener('click', (e) => {
        if (!e.target.dataset.postLink) return;
        const { postId } = e.target.closest('li').dataset;
        watchedState.ui.readPostsIds.push(postId);
      });

      elements.posts.addEventListener('auxclick', (e) => {
        if (!e.target.dataset.postLink) return;
        const { postId } = e.target.closest('li').dataset;
        watchedState.ui.readPostsIds.push(postId);
      });
    });

  const getFreshPosts = (posts, oldPosts) => _.differenceBy(posts, oldPosts, ['link', 'title']);

  const updateFeed = () => {
    if (watchedState.channels.length > 0) {
      watchedState.channels.forEach((channel) => {
        fetchRSS(channel.url)
          .then((rssData) => {
            const parsedRss = parseXML(rssData);
            const updatedPosts = parsedRss.rss.items;
            const freshPosts = getFreshPosts(updatedPosts, watchedState.posts);
            addPosts(freshPosts.reverse());
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
    setTimeout(updateFeed, UPDATE_INTERVAL);
  };

  updateFeed();
};
