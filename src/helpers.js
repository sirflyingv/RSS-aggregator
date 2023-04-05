// import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { ORIGIN_PROXY_URL, ORIGIN_PROXY_PATHNAME, ORIGIN_PROXY_PARAMETERS } from './config.js';

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

export const normalizeRssJson = (json) => {
  const channelData = {
    channel: {
      title: json.rss.channel.title,
      description: json.rss.channel.description,
    },
    posts: json.rss.channel.item,
  };
  return channelData;
};
