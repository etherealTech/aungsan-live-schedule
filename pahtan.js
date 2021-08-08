const { default: axios } = require('axios');
const { schedule } = require ('node-cron');
const { exec } = require('shelljs');
const createLiveStream = require('./src/createLiveStream');
const broadcastLiveStream = require('./src/broadcastLiveStream');

const VIDEO_SOURCE_URL = 'https://firebasestorage.googleapis.com/v0/b/mogok-aungsan.appspot.com/o/public%2Fdhamma%2Fvideos%2Fpahtan.mp4?alt=media&token=44e2caa8-5db6-4864-b563-58444fc0abdf';
const CRON_SCHEDULE_TIME = process.argv[3];
const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_PAGE_TOKEN;

!async function () { 
  now(':INIT');
  const title = 'ပဋ္ဌာန်းဒေသနာတော်';
  const description = 'အောင်ဆန်းဆရာတော် ရွတ်ဖတ်ပူဇော်အပ်သော ပဋ္ဌာန်းဒေသနာတော်';

  const fileName = 'pahtan.mp4';
  const filePath = `${__dirname}/tmp/${fileName}`;

  exec(`wget '${VIDEO_SOURCE_URL}' -O '${filePath}'`);

  now(':READY');

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
    } catch(e) {
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
