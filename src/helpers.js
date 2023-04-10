import axios from 'axios';
import {
  ORIGIN_PROXY_URL,
  ORIGIN_PROXY_PATHNAME,
  ORIGIN_PROXY_PARAMETERS,
} from './config.js';

export function composeProxifiedUrl(RssUrl) {
  const proxifiedUrl = new URL(ORIGIN_PROXY_URL);
  proxifiedUrl.pathname = ORIGIN_PROXY_PATHNAME;

  Object.keys(ORIGIN_PROXY_PARAMETERS).forEach((key) => {
    proxifiedUrl.searchParams.set(key, ORIGIN_PROXY_PARAMETERS[key]);
  });

  proxifiedUrl.searchParams.set('url', RssUrl);
  return proxifiedUrl;
}

export const normalizeRssObj = (obj, url) => {
  const channelData = {
    channel: {
      url,
      title: obj.rss.channel.title,
      description: obj.rss.channel.description,
    },
    posts: obj.rss.posts,
  };
  return channelData;
};

const xmlParser = new DOMParser();

export const parseXML = (xmlData) => {
  const data = xmlParser.parseFromString(xmlData, 'text/xml');
  if (data.children[0].nodeName !== 'rss') return null;

  const channel = data.getElementsByTagName('channel')[0];
  const channelInfoEntries = Array.from(channel.children)
    .filter((child) => child.nodeName !== 'item')
    .map((el) => [el.nodeName, el.textContent]);
  const channelInfo = Object.fromEntries(channelInfoEntries);

  const posts = Array.from(channel.querySelectorAll('item')).map((item) => {
    const children = Array.from(item.children).map((el) => [el.nodeName, el.textContent]);
    return Object.fromEntries(children);
  });

  const channelData = {
    rss: {
      channel: channelInfo,
      posts,
    },
  };
  return channelData;
};

export const fetchRSS = (url) => {
  const proxifiedUrl = composeProxifiedUrl(url);
  const rssData = axios.get(proxifiedUrl).then((response) => response.data.contents);
  return rssData;
};
