import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import { addFormInputHandler, render } from './formView';
import i18n from 'i18next';
import locales from './locales/index.js';
import { XMLParser } from 'fast-xml-parser';
import _ from 'lodash';

export const i18nInstance = i18n.createInstance();
const { ru } = locales;

export const app = () => {
  // Model
  const defaultLang = 'ru';

  const initialState = {
    links: [],
    channels: [],
    posts: [],
    uiState: {
      lang: 'ru',
    },
    formState: 'loading',
  };

  const state = {
    links: [],
    channels: [],
    posts: [],
    uiState: {
      lang: defaultLang || initialState.uiState.lang,
    },
    formState: initialState.formState,
  };
  const watchedState = onChange(state, () => {
    render(watchedState);
  });

  i18nInstance
    .init({
      lng: state.uiState.lang,
      debug: false,
      resources: {
        ru,
      },
    })
    .then(function (t) {
      watchedState.formState = 'filling';
    });

  // controller
  const handleFormInput = (value) => {
    inputSchema
      .validate(value)
      .then((value) => {
        watchedState.formState = 'awaiting';
        watchedState.links.push(value);
        return getRssData(value);
      })
      .then((response) => {
        if (response.data.status.error) {
          watchedState.formState = 'invalid_rss';
          throw new Error('Absolutely nothing on that link');
        }
        if (response.data.status.http_code !== 200) {
          watchedState.formState = 'invalid_rss';
          throw new Error(
            `Could not get RSS from ${response.data.status.url}. Source status: ${response.data.status.http_code}`,
          );
        }
        if (response.data.status.http_code == 200) {
          return response.data.contents;
        }
      })
      .then((contents) => {
        const { channel, posts } = rssParser(contents);
        watchedState.channels.push(channel);
        watchedState.posts.push(...posts);
        // sort the posts?
        watchedState.formState = 'submitted';
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  addFormInputHandler(handleFormInput);

  const updateFeed = () => {
    if (watchedState.links.length > 0) {
      watchedState.links.forEach((link) => {
        getRssData(link)
          .then((response) => {
            if (response.data.status.http_code !== 200) {
              throw new Error(
                `Could not update source ${link}. Origin proxy status: ${response.status}. RSS source status code: ${response.data.status.http_code}`,
              );
            }
            return response.data.contents;
          })
          .then((data) => {
            const updatedPosts = rssParser(data).posts;
            const freshPosts = updatedPosts.filter((newPost) => {
              return !watchedState.posts.some((loadedPost) => {
                return _.isEqual(loadedPost, newPost);
              });
            });
            // console.log(freshPosts);
            watchedState.posts.push(...freshPosts);
          })
          .catch((err) => {
            console.error(err.message);
          });
      });
    }
    setTimeout(updateFeed, 1000); // magic number
  };

  updateFeed();

  // utils

  // routing requests READ DOCS TO AVOID CACHED RESULTS
  // REMOVE HARDCODE
  function getRssData(url) {
    return axios.get(
      `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`,
    );
  }

  // parsing XML
  function rssParser(xml) {
    const parser = new XMLParser();
    const parsedXML = parser.parse(xml);
    const channelData = {
      channel: {
        title: parsedXML.rss.channel.title,
        description: parsedXML.rss.channel.description,
      },
      posts: parsedXML.rss.channel.item,
    };

    return channelData;
  }

  // validating url input
  const inputSchema = yup
    .string()
    .required('no_input')
    .trim()
    .url((err) => {
      watchedState.formState = 'invalid';
      watchedState.uiState.feedback = i18nInstance.t('feedbackInvalid');
      return `The value ${err.value} is not a valid URL.`;
    })
    .test(
      'is unique',
      (err) => `URL ${err.value} is already added`,
      (url) => {
        const isUnique = !state.links.includes(url);
        if (!isUnique) {
          watchedState.formState = 'not_unique';
          watchedState.uiState.feedback = i18nInstance.t('feedbackNotUnique');
        }
        return isUnique;
      },
    );
};
