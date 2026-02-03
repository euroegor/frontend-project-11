import axios from 'axios'
import parseRss from '../parsers/rss.js'

const makeProxyUrl = (url) => {
  const proxy = 'https://allorigins.hexlet.app/get'
  const params = new URLSearchParams({
    disableCache: 'true',
    url,
  })

  return `${proxy}?${params.toString()}`
}

const fetchRss = url =>
  axios
    .get(makeProxyUrl(url))
    .then(response => response.data.contents)
    .then(xml => parseRss(xml))

export default fetchRss
