const { default: axios } = require('axios');
const { schedule } = require ('node-cron');
const { exec } = require('shelljs');
const { getVideo, updateVideo, pushChanges } = require('./src/getVideoInfo');
const getFBVideoFromGraph = require('./src/getFBVideoFromGraph');
const createLiveStream = require('./src/createLiveStream');
const broadcastLiveStream = require('./src/broadcastLiveStream');
const generateReadme = require('./src/generateReadme');

const LIVE_STREAM_TITLE = 'တရားတော်';
const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_TEST_TOKEN;

!async function () {
  let filePath, fileName, command;
  now('STARTED');

  const video = getVideo();
  const video_id = video.link.split('/').pop();

  const { data: auth } = await axios.get(`https://graph.facebook.com/v10.0/me?access_token=${FACEBOOK_PAGE_TOKEN}`);
  console.log('[AUTH] %s (https://www.facebook.com/%s)', auth.name, auth.id);

  const { source, description, title } = await getFBVideoFromGraph({ id: video_id, access_token: FACEBOOK_PAGE_TOKEN });
  const text = description || title;

  fileName = new URL(source).pathname.split('/').pop();
  filePath = `${__dirname}/tmp/${fileName}`;

  console.log('<<<', source;
  console.log('>>>', filePath);

  command = `curl -L '${source}' -o '${filePath}' --progress-bar`;
  exec(command);

  console.log('[CRON:SCHEDULE]', CRON_SCHEDULE_TIME);
  schedule(CRON_SCHEDULE_TIME, () => onAir(), {
    timezone: 'Asia/Rangoon',
  });
  
  async function onAir() {
    now('ONAIR');
    try {
      const description =  video.title || LIVE_STREAM_TITLE;
      const { id, stream_url } = await createLiveStream({
        title: LIVE_STREAM_TITLE + ' #' + video_id,
        description: text,
        access_token: FACEBOOK_PAGE_TOKEN,
      });

      command = broadcastLiveStream(filePath, stream_url);
      exec(command);

      setTimeout(() => console.log('[EXIT]') | process.exit(0), 5000);
    } catch(e) {
      console.error(e.request.headers);
      process.exit(1);
    }
  }
  /* end of on air function */
}().catch((err) => console.error('[ERROR]', err) | process.exit(1));

function now(message) {
  let date = new Date();
  let opt = {
    timeZone: 'Asia/Yangon'
  };
  console.log('[' + message + ']', date.toLocaleString('en-US', opt));
}
