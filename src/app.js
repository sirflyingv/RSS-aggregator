import 'bootstrap';
import axios from 'axios';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import { setLocale } from 'yup';
import locales from './locales/index.js';

import { UPDATE_INTERVAL } from './config.js';
import { composeProxifiedUrl, xmlToJson, normalizeRssJson } from './helpers.js';

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
        return 'Input URL is empty';
      },
    },
    string: {
      url: (err) => {
        watchedState.formState = 'invalid_URL';
        return `The value ${err.value} is not a valid URL`;
      },
    },
  });

  const inputSchema = yup.string().trim().required().url();

  // controller
  function handleFormInput(inputLink) {
    inputSchema
      .validate(inputLink)
      .then((validLink) => {
        if (state.links.includes(validLink)) {
          watchedState.formState = 'not_unique';
          throw new Error(`URL ${validLink} is already added`);
        }
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

        const json = xmlToJson(response.data.contents);
        // should be rss structure validation?
        if (!_.has(json, 'rss')) {
          watchedState.formState = 'invalid_rss';
          throw new Error('XML document is not RSS');
        }

        watchedState.links.push(inputLink); // higher level argument
        const { channel, posts } = normalizeRssJson(json);
        watchedState.channels.push(channel);
        watchedState.posts.push(...posts.reverse());
        // sort the posts?
        watchedState.formState = 'submitted';
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

  i18nInstance
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
    })
    .then(() => {
      watchedState.formState = 'filling';
      // listeners
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormInput(elements.input.value);
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
