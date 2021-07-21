const { default: axios } = require('axios');
const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com';

module.exports = function createLiveStream({ 
  title, 
  description,
  access_token
}) { 
  let url = `${FACEBOOK_GRAPH_URL}/me/live_videos`;
  return axios.post(url, {
    access_token,
    status: 'LIVE_NOW',
    title,
    description,
  }).then(({ data }) => data);
};
