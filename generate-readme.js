const generateReadme = require ("./src/generateReadme");
const { pushChanges } = require("./src/getVideoInfo");
const { default: axios } = require("axios");

const CRON_SCHEDULE_TIME = process.argv[3];
const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_PAGE_TOKEN;

axios.get(`https://graph.facebook.com/v10.0/me?access_token=${FACEBOOK_PAGE_TOKEN}`)
  .then(({ data }) => {
    generateReadme(data, CRON_SCHEDULE_TIME);
    pushChanges('.db');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[ERROR]', err);
    process.exit(1);
  });
