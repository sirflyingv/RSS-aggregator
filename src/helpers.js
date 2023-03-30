import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { ORIGIN_PROXY_URL, ORIGIN_PROXY_PARAMETERS } from './config.js';

export function getRssData(url) {
  return axios.get(
    `${ORIGIN_PROXY_URL}}${ORIGIN_PROXY_PARAMETERS}&url=${encodeURIComponent(url)}`,
  );
}

export function rssParser(xml) {
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
