const { default: axios } = require('axios');
const { schedule } = require('node-cron');
const { exec } = require('shelljs');
const getFBVideoFromGraph = require('./src/getFBVideoFromGraph');
const createLiveStream = require('./src/createLiveStream');
const broadcastLiveStream = require('./src/broadcastLiveStream');

const SOURCE_VIDEO_ID = '';
const CRON_SCHEDULE_TIME = process.argv[3];
const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_PAGE_TOKEN;

!async function () {
  now(':INIT');

  const { source, description, title } = await getFBVideoFromGraph({ id: SOURCE_VIDEO_ID, access_token: FACEBOOK_PAGE_TOKEN });

  const fileName = new URL(source).pathname.split('/').pop();
  const filePath = `${__dirname}/tmp/${fileName}`;

  exec(`wget '${source}' -O '${filePath}'`);

  now(':STANDBY');

  schedule(CRON_SCHEDULE_TIME, async () => {
    now(':ONAIR');
    try {
      const { id, stream_url } = await createLiveStream({
        title,
        description,
        access_token: FACEBOOK_PAGE_TOKEN,
      });
      exec(broadcastLiveStream(filePath, stream_url));
      setTimeout(() => process.exit(0), 3000);
    } catch (e) {
      console.error(e.request?.headers || e.message);
      process.exit(1);
    }
  }, { timezone: 'Asia/Rangoon' });
}().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});

function now(message) {
  console.log('[' + message + ']', new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yangon'
  }));
}
