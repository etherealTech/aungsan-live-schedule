const { default: axios } = require('axios');
const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com';

module.exports = async function createLiveStream({ 
  title, 
  description,
  access_token
}) { 
  let url = `${FACEBOOK_GRAPH_URL}/me/live_videos`;
  let data = {
    access_token,
    status: 'LIVE_NOW',
    title,
    description,
    fields: 'id,stream_url,video',
  };
  let { data: { id, stream_url } } = await axios.post(url, data);
  return { id, stream_url, video };
};
