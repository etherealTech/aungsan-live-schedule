const { default: axios } = require('axios');
const { exec } = require('shelljs');
const getFBVideo = require('./src/getFBVideo');

const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_PAGE_TOKEN;
const postID = '654432202109918';

!async function () {
  // initiated
  console.log(new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yangon'
  }, '[STARTED]'));

  // auth page/group/user
  const { data: currentAuth } = await axios.get(`https://graph.facebook.com/v10.0/me?access_token=${FACEBOOK_PAGE_TOKEN}`);

  console.log('[AUTH:PAGE]', currentAuth);

  // video details
  const sources = await getFBVideo(postID);
  const videos = sources.filter(source => !(source.text || '').includes('Audio'));
  const video = videos.shift();
  const fileName = new URL(video.source).pathname.split('/').pop();
  const filePath = `${__dirname}/tmp/${fileName}`;

  console.log('[INPUT]', video);
  console.log('[DOWNLOADING]', filePath);

  const command = `curl -L '${video.source}' -o '${filePath}' --progress-bar `;
  exec(command);

  console.log('[PRE-LIVE]');
  //

  console.log('[LIVE]');
  //

  console.log('DONE!');
}().catch(err => console.error('[ERROR]', err));
