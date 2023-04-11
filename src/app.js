/* eslint-disable max-len */
// import 'bootstrap';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import { setLocale } from 'yup';
import locales from './locales/index.js';

import { UPDATE_INTERVAL } from './config.js';
import { fetchRSS, parseXML, normalizeRssObj } from './helpers.js';

import {
  elements,
  renderForm,
  renderPosts,
  renderModal,
  renderChannels,
} from './Views/index.js';

const { ru } = locales;

export default () => {
  const i18nInstance = i18n.createInstance();

  // Model
  const state = {
    links: [],
    channels: [], // id
    posts: [], // id
    ui: {
      modalPost: {},
      showModal: false, // modal state without bootstrap
      readPosts: [], // сюда id постов
    },
    form: 'startup',
    process: 'idle',
    addChannel(channel) {
      const channelId = _.uniqueId('channel_');
      const idfyiedChannel = { ...channel, ...{ channelId } };
      this.channels.push(idfyiedChannel);
    },
    addPost(post, channelId) {
      const postId = _.uniqueId('post_');
      const idfyiedPost = { ...post, ...{ postId, channelId } };
      this.posts.push(idfyiedPost);
    },
  };

  const watchedState = onChange(state, () => {
    renderForm(watchedState, i18nInstance, elements);
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

  function handleFormSubmit(form) {
    const data = new FormData(form);
    const url = data.get('url');

    if (!isUrlUnique(url)) {
      watchedState.form = 'not_unique';
    } else {
      inputSchema
        .validate(url)
        .then(() => {
          watchedState.form = 'awaiting'; // separate form state and general process state !!!
          return fetchRSS(url);
        })
        .then((rssData) => {
          const parsedRss = parseXML(rssData);
          const { channel, posts } = normalizeRssObj(parsedRss, url);
          watchedState.addChannel(channel);
          posts.reverse().forEach((post) => watchedState.addPost(post));
          watchedState.form = 'submitted';
        })
        .catch((err) => {
          if (err.message.key === 'noInput') watchedState.form = 'no_input';
          if (err.message.key === 'notUrl') watchedState.form = 'invalid_URL';
          if (err.isParsingError) watchedState.form = 'invalid_rss';
          if (err.code === 'ERR_NETWORK') watchedState.form = 'network_error';
          console.error(err.message);
        });
    }
  }

  function handlePostClick(postLink) {
    const chosenPost = watchedState.posts.find((post) => post.link === postLink);
    watchedState.ui.modalPost = chosenPost;
    watchedState.ui.showModal = true;
    watchedState.ui.readPosts.push(chosenPost);
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
      watchedState.form = 'filling';

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(e.target);
      });

      elements.posts.addEventListener('click', (e) => {
        if (e.target.type !== 'button') return;
        const postLink = e.target.previousElementSibling.href;
        handlePostClick(postLink);
      });

      elements.modalCloseButton.addEventListener('click', () => {
        watchedState.ui.showModal = false;
      });

      elements.modalWindow.addEventListener('click', () => {
        watchedState.ui.showModal = false;
      });

      elements.posts.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') return;
        const postLink = e.target.href;
        handlePostClick(postLink);
      });

      elements.posts.addEventListener('auxclick', (e) => {
        if (e.target.tagName !== 'A') return;
        const postLink = e.target.href;
        handlePostClick(postLink);
      });
    });

  function isPostFresh(post) {
    return !watchedState.posts.some(
      // in different RSS versions different nuances
      (loadedPost) => loadedPost.title === post.title || loadedPost.link === post.link,
    );
  }

  const updateFeed = () => {
    if (watchedState.channels.length > 0) {
      watchedState.channels.forEach((channel) => {
        fetchRSS(channel.url)
          .then((rssData) => {
            const parsedRss = parseXML(rssData);
            const normalizedRss = normalizeRssObj(parsedRss, channel.url);
            const updatedPosts = normalizedRss.posts;
            const freshPosts = updatedPosts.filter((newPost) => isPostFresh(newPost));
            freshPosts.reverse().forEach((post) => watchedState.addPost(post));
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
