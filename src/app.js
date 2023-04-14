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
    addChannel(channel) {
      const channelId = _.uniqueId('channel_');
      const idfyiedChannel = { ...channel, ...{ channelId } };
      this.channels.push(idfyiedChannel);
    },
    addPosts(posts, channelId) {
      const idfyiedPosts = posts.map((post) => ({
        ...post,
        ...{ postId: _.uniqueId('post_'), channelId },
      }));
      this.posts.push(...idfyiedPosts);
      console.log(this.posts);
    },
  };

  const watchedState = onChange(state, () => {
    renderMain(watchedState, i18nInstance, elements);
    renderModal(watchedState, i18nInstance, elements);
    if (watchedState.channels.length > 0) {
      renderChannels(watchedState, i18nInstance, elements);
      renderPosts(watchedState, i18nInstance, elements);
    }
  });

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

  function isUrlUnique(url) {
    return !watchedState.channels.find((channel) => channel.url === url);
  }

  // controller
  function handleFormSubmit(form) {
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
          watchedState.addChannel(channel);
          watchedState.addPosts(posts.reverse());
          // posts.reverse().forEach((post) => watchedState.addPost(post));
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
          console.error(err.message);
        });
    }
  }

  function handlePostClick(postId) {
    const chosenPost = watchedState.posts.find((post) => post.postId === postId);
    watchedState.ui.modalPost = chosenPost;
    watchedState.ui.showModal = true;
    watchedState.ui.readPostsIds.push(postId);
  }

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

  // function getFreshPosts(posts, currentPosts) {
  //   function isFresh(post) {
  //     return !currentPosts.some(
  //       (curPost) => curPost.title === post.title && curPost.link === post.link,
  //     );
  //   }
  //   return posts.filter(isFresh);
  // }

  // const comparator = (post1, post2) =>
  //   post1.title === post2.title && post1.link === post2.link;

  const getFreshPosts2 = (posts, currentPosts) =>
    _.differenceBy(posts, currentPosts, ['link', 'title']);

  const updateFeed = () => {
    if (watchedState.channels.length > 0) {
      watchedState.channels.forEach((channel) => {
        fetchRSS(channel.url)
          .then((rssData) => {
            const parsedRss = parseXML(rssData);
            const updatedPosts = parsedRss.rss.items;
            const freshPosts = getFreshPosts2(updatedPosts, watchedState.posts);
            watchedState.addPosts(freshPosts.reverse());
          })
          .catch((err) => {
            console.error(err.message);
          });
      });
    }
    setTimeout(updateFeed, UPDATE_INTERVAL);
  };

  updateFeed();
};
