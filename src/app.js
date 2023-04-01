import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import locales from './locales/index.js';

import { UPDATE_INTERVAL, DEFAULT_LANG } from './config.js';
import { composeProxifiedUrl, xmlToJson, normalizeRssJson } from './helpers.js';

import { addFormInputHandler, renderForm } from './Views/formView';
import { renderPosts, addShowButtonHandler, addLinkHandler } from './Views/postsView';
import renderModal from './Views/modalView';
import renderChannels from './Views/channelsView';

export const i18nInstance = i18n.createInstance();
const { ru } = locales;

export const app = () => {
  // Model

  const state = {
    links: [],
    channels: [],
    posts: [],
    uiState: {
      lang: DEFAULT_LANG,
      modalPost: {},
      readPosts: [],
    },
    formState: 'loading',
  };

  const watchedState = onChange(state, () => {
    renderForm(watchedState, i18nInstance);
    renderModal(watchedState, i18nInstance);
    if (watchedState.channels.length > 0) {
      renderChannels(watchedState, i18nInstance);
      renderPosts(watchedState, i18nInstance);
    }
  });

  i18nInstance
    .init({
      lng: state.uiState.lang,
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => {
      watchedState.formState = 'filling';
    });

  // validating url input
  const inputSchema = yup
    .string()
    .required(() => {
      watchedState.formState = 'no_input';
      return 'Input URL is empty';
    })
    .trim()
    .url((err) => {
      watchedState.formState = 'invalid_URL';
      return `The value ${err.value} is not a valid URL.`;
    })
    .test(
      'is unique',
      (err) => `URL ${err.value} is already added`,
      (url) => {
        const isUnique = !state.links.includes(url);
        if (!isUnique) {
          watchedState.formState = 'not_unique';
        }
        return isUnique;
      },
    );

  // controller
  const handleFormInput = (inputLink) => {
    inputSchema
      .validate(inputLink)
      .then((validLink) => {
        // watchedState.links.push(validLink); // in last then
        const proxifiedUrl = composeProxifiedUrl(validLink);
        const responsePromise = axios.get(proxifiedUrl);
        watchedState.formState = 'awaiting';
        return responsePromise;
      })
      .then((response) => {
        if (!response.data.contents) {
          watchedState.formState = 'invalid_rss';
          throw new Error(
            `Could not get RSS from ${response.data.status.url}. Source status: ${response.data}`,
          );
        }
        return response.data.contents;
      })
      .then((contents) => {
        const json = xmlToJson(contents);
        // should be rss structure validation?
        if (!_.has(json, 'rss')) {
          watchedState.formState = 'invalid_rss';
          throw new Error('XML document is not RSS');
        }
        const normalizedRss = normalizeRssJson(json);
        return normalizedRss;
      })
      .then((rss) => {
        watchedState.links.push(inputLink); // higher level argument
        const { channel, posts } = rss;
        watchedState.channels.push(channel);
        watchedState.posts.push(...posts.reverse());
        // sort the posts?
        watchedState.formState = 'submitted';
      })
      .catch((err) => {
        if (err.code === 'ERR_NETWORK') watchedState.formState = 'network_error';
        console.error(err.message);
      });
  };

  const handlePostClick = (postLink) => {
    const chosenPost = watchedState.posts.find((post) => post.link === postLink);
    watchedState.uiState.modalPost = chosenPost;
    watchedState.uiState.readPosts.push(chosenPost);
  };

  addFormInputHandler(handleFormInput);
  addShowButtonHandler(handlePostClick);
  addLinkHandler(handlePostClick);

  const updateFeed = () => {
    if (watchedState.links.length > 0) {
      watchedState.links.forEach((link) => {
        const proxifiedUrl = composeProxifiedUrl(link);
        axios
          .get(proxifiedUrl)
          .then((response) => {
            if (response.data.status.http_code !== 200) {
              throw new Error(
                `Could not update source ${link}. Origin proxy status: ${response.status}. RSS source status: ${response.data.status.http_code}`,
              );
            }
            return response.data.contents;
          })
          .then((data) => {
            const json = xmlToJson(data);
            const normalizedRss = normalizeRssJson(json);
            const updatedPosts = normalizedRss.posts;
            function isNewPostFresh(post) {
              return !watchedState.posts.some((loadedPost) => _.isEqual(loadedPost, post));
            }
            const freshPosts = updatedPosts.filter((newPost) => isNewPostFresh(newPost));
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
