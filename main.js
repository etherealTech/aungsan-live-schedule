const { default: axios } = require('axios');
const getFBVideo = require('./src/getFBVideo');

const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_PAGE_TOKEN;
const postID = '654432202109918';

!async function () {
  console.log(new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yangon'
  }, '[STARTED]'));
  
  const videoSources = await getFBVideo(postID);
  
  console.log(videoSources)
  
  axios.get(`https://graph.facebook.com/v10.0/me?access_token=${FACEBOOK_PAGE_TOKEN}`)
    .then(({ data }) => {
      console.log(data);
    });
}();
