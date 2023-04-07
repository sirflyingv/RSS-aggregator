/* eslint-disable max-len */
import 'bootstrap';
import axios from 'axios';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import { setLocale } from 'yup';
import locales from './locales/index.js';

import { UPDATE_INTERVAL } from './config.js';
import {
  composeProxifiedUrl,
  xmlToJson,
  normalizeRssJson,
  fetchRSS,
  parseXML,
} from './helpers.js';

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
        console.log(isUnique);
        if (!isUnique) watchedState.formState = 'not_unique';
        return isUnique;
      },
    );

  const validateUrl = (url) => inputSchema.validate(url);

  // controller
  // function handleFormInput(url) {
  //   inputSchema
  //     .validate(url)
  //     .then((validLink) => {
  //       // if (watchedState.links.includes(validLink)) {
  //       //   watchedState.formState = 'not_unique';
  //       // }

  //       // watchedState.links.push(validLink); // in last then
  //       const proxifiedUrl = composeProxifiedUrl(validLink);
  //       const responsePromise = axios.get(proxifiedUrl);
  //       watchedState.formState = 'awaiting';
  //       return responsePromise;
  //     })
  //     // eslint-disable-next-line consistent-return
  //     .then((response) => {
  //       if (!response.data.contents) {
  //         watchedState.formState = 'invalid_rss';
  //         return null;
  //       }

  //       const json = xmlToJson(response.data.contents);
  //       // should be rss structure validation?
  //       if (!_.has(json, 'rss')) {
  //         watchedState.formState = 'invalid_rss';
  //         return null;
  //       }

  //       watchedState.links.push(url); // higher level argument
  //       const { channel, posts } = normalizeRssJson(json, url);
  //       watchedState.channels.push(channel);
  //       watchedState.posts.push(...posts.reverse());
  //       // sort the posts?
  //       watchedState.formState = 'submitted';
  //     })
  //     .catch((err) => {
  //       if (err.code === 'ERR_NETWORK') watchedState.formState = 'network_error';
  //       console.error(err.message);
  //     });
  // }

  function handlePostClick(postLink) {
    const chosenPost = watchedState.posts.find((post) => post.link === postLink);
    watchedState.uiState.modalPost = chosenPost;
    watchedState.uiState.readPosts.push(chosenPost);
  }

  const updateFeed = () => {
    if (watchedState.links.length > 0) {
      watchedState.links.forEach((link) => {
        const proxifiedUrl = composeProxifiedUrl(link);
        axios
          .get(proxifiedUrl)
          .then((response) => {
            if (response.data.status.http_code !== 200) {
              throw new Error(
                i18nInstance.t('errorUpdateError', {
                  link,
                  proxyStatus: response.status,
                  sourceStatus: response.data.status.http_code,
                }),
              );
            }
            return response.data.contents;
          })
          .then((data) => {
            const json = xmlToJson(data);
            const normalizedRss = normalizeRssJson(json);
            const updatedPosts = normalizedRss.posts;
            function isNewPostFresh(post) {
              return !watchedState.posts.some(
                (loadedPost) => _.isEqual(loadedPost, post),
                // eslint-disable-next-line function-paren-newline
              );
            }
            const freshPosts = updatedPosts.filter(
              (newPost) => isNewPostFresh(newPost),
              // eslint-disable-next-line function-paren-newline
            );
            watchedState.posts.push(...freshPosts.reverse());
          })
          .catch((err) => {
            if (err.code === 'ERR_NETWORK') watchedState.formState = 'network_error';
            console.error(err.message);
          });
      });
    }
    setTimeout(updateFeed, UPDATE_INTERVAL);
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
      watchedState.formState = 'filling';

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const url = data.get('url');

        validateUrl(url, watchedState.channels)
          .then(() => {
            console.log(state);
            watchedState.formState = 'awaiting';
            return fetchRSS(url);
          })
          .then((rssData) => {
            const jsonRssData = parseXML(rssData);
            if (!_.has(jsonRssData, 'rss')) {
              // enough?
              watchedState.formState = 'invalid_rss';
            } else {
              const { channel, posts } = normalizeRssJson(jsonRssData, url);
              watchedState.channels.push(channel);
              watchedState.posts.push(...posts.reverse());
              watchedState.formState = 'submitted';
            }
          })
          .catch((err) => {
            console.error(err);
          });

        // handleFormInput(elements.input.value);
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

  updateFeed();
};
