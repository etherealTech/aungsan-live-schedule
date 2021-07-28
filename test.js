const { default: axios } = require('axios');
const { schedule } = require ('node-cron');
const { exec } = require('shelljs');
const { getVideo, updateVideo, pushChanges } = require('./src/getVideoInfo');
const getFBVideoFromGraph = require('./src/getFBVideoFromGraph');
const createLiveStream = require('./src/createLiveStream');
const broadcastLiveStream = require('./src/broadcastLiveStream');
const generateReadme = require('./src/generateReadme');

const LIVE_STREAM_TITLE = 'တရားတော်';
const CRON_SCHEDULE_TIME = process.argv[3];
const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_PAGE_TOKEN;

!async function () { 
  now(':INIT');

  const video = getVideo();
  const video_id = video.link.split('/').pop();

  const { data: auth } = await axios.get(`https://graph.facebook.com/v10.0/me?access_token=${FACEBOOK_PAGE_TOKEN}`);
  const { source, description, title } = await getFBVideoFromGraph({ id: video_id, access_token: FACEBOOK_PAGE_TOKEN });
  const text = description || title;

  const fileName = new URL(source).pathname.split('/').pop();
  const filePath = `${__dirname}/tmp/${fileName}`;

  exec(`wget '${source}' -O '${filePath}'`);

  now(':PRE');

  generateReadme(auth, CRON_SCHEDULE_TIME);
  updateVideo();
  pushChanges();

  now(':LIVE');

  try {
    const { id, stream_url } = await createLiveStream({
      title: LIVE_STREAM_TITLE + ' #' + video_id,
      description: text,
      access_token: FACEBOOK_PAGE_TOKEN,
    });
    exec(broadcastLiveStream(filePath, stream_url));
    setTimeout(() => process.exit(0), 3000);
  } catch(e) {
    console.error(e.request?.headers || e.message);
    process.exit(1);
  }
}().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});

function now(message) {
  console.log('[' + message + ']', new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yangon'
  }));
}
