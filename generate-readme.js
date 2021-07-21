const generateReadme = require ("./src/generateReadme");
const { pushChanges } = require("./src/getVideoInfo");
const { default: axios } = require("axios");

const CRON_SCHEDULE_TIME = process.argv[3];
const FACEBOOK_PAGE_TOKEN = process.argv[2] || process.env.FACEBOOK_PAGE_TOKEN;

!async function() {
  const { data } = await axios.get(`https://graph.facebook.com/v10.0/me?${FACEBOOK_PAGE_TOKEN}`);
  generateReadme(data, CRON_SCHEDULE_TIME);
  pushChanges();
}();
