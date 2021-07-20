const { JSDOM } = require('jsdom');
const fetch = require('isomorphic-fetch');

const FACEBOOK_PAGE_ID = '655653464834259';
const FACEBOOK_BASE_URL = `https://www.facebook.com/${FACEBOOK_PAGE_ID}/videos`;
const REQUEST_URL = 'https://www.getfvid.com/downloader';
const REQUEST_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const REQUEST_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const REQUEST_METHOD = 'POST';
const REQUEST_OPT = {
  method: REQUEST_METHOD,
  headers: {
      origin: 'https://www.getfvid.com',
      referer: 'https://www.getfvid.com/',
      'content-type': REQUEST_CONTENT_TYPE,
      'user-agent': REQUEST_USER_AGENT,
  },
  body: null,
};

module.exports = function getFBVideo(id) {
  const config = { 
    ...REQUEST_OPT, 
    body: 'url=' + encodeURIComponent(`${FACEBOOK_BASE_URL}/${id}`),
  };
  return fetch(REQUEST_URL, config)
    .then((res) => res.text())
    .then((html) => new JSDOM(html))
    .then(({ window: { document } }) => {
      const results = [];      
      const { body } = document;
      const links = body.querySelectorAll('a');
      for (let link of links) {
          let url = new URL(link.href);
          if (url.pathname.includes('.mp4')) {
            results.push({ source: url.toString(), text: link.textContent });
          }
      }
      return results;
  })
};
