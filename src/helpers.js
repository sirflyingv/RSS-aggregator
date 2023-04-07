import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
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

const xmlToJsonParser = new XMLParser();
export const xmlToJson = (xml) => xmlToJsonParser.parse(xml);

export const normalizeRssJson = (json, url) => {
  const channelData = {
    channel: {
      url,
      title: json.rss.channel.title,
      description: json.rss.channel.description,
    },
    posts: json.rss.channel.item,
  };
  return channelData;
};

export const parseXML = (xmlData) => {
  const json = xmlToJson(xmlData);
  return json;
};

export const fetchRSS = (url) => {
  const proxifiedUrl = composeProxifiedUrl(url);
  const rssData = axios.get(proxifiedUrl).then((response) => response.data.contents);
  return rssData;
};
