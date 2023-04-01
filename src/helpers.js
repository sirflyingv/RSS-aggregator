// import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { ORIGIN_PROXY_URL, ORIGIN_PROXY_PARAMETERS } from './config.js';

export function composeProxifiedUrl(url) {
  return `${ORIGIN_PROXY_URL}${ORIGIN_PROXY_PARAMETERS}&url=${encodeURIComponent(url)}`;
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
