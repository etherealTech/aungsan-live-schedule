const { default: axios } = require('axios');

module.exports = function getFBVideoFromGraph({ id, access_token }) {
  let fields = ['id', 'title', 'description','length', 'source', 'thumbnails{uri}'];
  let url = new URL(`https://graph.facebook.com/${id}`);
  let params = url.searchParams;
  params.append('access_token', access_token);
  params.append('fields', fields.join(','));
  return axios.get(url.toString()).then(({ data }) => data);
};
