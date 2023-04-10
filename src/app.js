/* eslint-disable max-len */
import 'bootstrap';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import { setLocale } from 'yup';
import locales from './locales/index.js';

import { UPDATE_INTERVAL } from './config.js';
import { fetchRSS, parseXML, normalizeRssObj } from './helpers.js';

import elements from './elements.js';
import renderForm from './Views/formView';
import renderPosts from './Views/postsView';
import renderModal from './Views/modalView';
import renderChannels from './Views/channelsView';

const { ru } = locales;

export default () => {
  const i18nInstance = i18n.createInstance();

  // Model
  const state = {
    links: [],
    channels: [],
    posts: [],
    uiState: {
      modalPost: {},
      readPosts: [],
    },
    formState: 'loading',
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
      required: () => {
        watchedState.formState = 'no_input';
        return i18nInstance.t('errorEmptyInput');
      },
    },
    string: {
      url: (err) => {
        watchedState.formState = 'invalid_URL';
        return i18nInstance.t('errorInvalidUrl', { value: err.value });
      },
    },
  });

  const inputSchema = yup
    .string()
    .trim()
    .required()
    .url()
    .test(
      'is unique',
      (err) => i18nInstance.t('errorNotUnique', { value: err.value }),
      (url) => {
        const isUnique = !watchedState.channels.find((channel) => channel.url === url);
        if (!isUnique) watchedState.formState = 'not_unique';
        return isUnique;
      },
    );

  function handleFormSubmit(form) {
    const data = new FormData(form);
    const url = data.get('url');

    inputSchema
      .validate(url)
      .then(() => {
        watchedState.formState = 'awaiting';
        return fetchRSS(url);
      })
      .then((rssData) => {
        const parsedRss = parseXML(rssData);
        if (!parsedRss) {
          watchedState.formState = 'invalid_rss';
        } else {
          const { channel, posts } = normalizeRssObj(parsedRss, url);
          watchedState.channels.push(channel);
          watchedState.posts.push(...posts.reverse());
          watchedState.formState = 'submitted';
        }
      })
      .catch((err) => {
        if (err.code === 'ERR_NETWORK') watchedState.formState = 'network_error';
        console.error(err.message);
      });
  }

  function handlePostClick(postLink) {
    const chosenPost = watchedState.posts.find((post) => post.link === postLink);
    watchedState.uiState.modalPost = chosenPost;
    watchedState.uiState.readPosts.push(chosenPost);
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
      watchedState.formState = 'filling';

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(e.target);
      });

      elements.posts.addEventListener('click', (e) => {
        if (e.target.type !== 'button') return;
        const postLink = e.target.previousElementSibling.href;
        handlePostClick(postLink);
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
    return !watchedState.posts.some((loadedPost) => _.isEqual(loadedPost, post));
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
            watchedState.posts.push(...freshPosts.reverse());
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
