const { resolve } = require('path');
const { writeFileSync } = require('fs');
const { readData, getVideo } = require('./getVideoInfo.js');

const MAX_REVIEW_COUNT = 20;
const README_PATH = resolve(__dirname, '../README.md');
const DATETIME_OPT = ['en-US', { timeZone: 'Asia/Yangon' }];
const PER_DAY_VALUE = 24 * 3600 * 1000; // hour * minute * millisecond

module.exports = function generateReadme(page, cron) {
  let video = getVideo();
  let id = video.link.split('/').pop();
  let schedule = convertToDate(cron);
  let markdown = [
    page.name ? `# [${page.name}](https://fb.me/${page.id})` : '# aungsan-live-schedule',
    '',
    `generated at ${new Date().toLocaleString(...DATETIME_OPT)}`,
    '',
    '## Today\'s Selection',
    '',
    '### [' + video.title + '](' + video.link + ')';
    '![thumbnail](' + video.image + ')',
    '',
    '| | |',
    '|:---:|---:|',
    '| ID# | `' + video.id + '` |`,
    `| Duration | ${video.duration} |`,
    `| Schedule for | ${schedule.date} ${schedule.time} |`,
    '',
    '| Video | Title | Duration | Schedule For |',
    '|:-----:|:------|---------:|-------------:|',
    ...generateVideoRow(Date.now()),
    '',
    '> &copy; 2021-' + new Date().getFullYear() + ' [Ethereal](https://github.com/etherealtech)',
  ];
  
  writeFileSync(README_PATH, markdown.join('\n'), 'utf-8');
  
  function convertToDate(cron) {
    let [s, m, h ] = cron.split(' ');
    if (parseInt(m) < 10) {
      m = '0' + m;
    }
    if (parseInt(s) < 10) {
      s = '0' + m;
    }
    return {
      date: new Date().toLocaleDateString(...DATETIME_OPT),
      time: `${h}:${m}:${s}`,
    };
  }
  
  function generateVideoRow() {
    let now = new Date();
    let results = [];
    let videos = getVideos();
    for (let i in videos) {
      let date = new Date(now.getTime() + (i * PER_DAY_VALUE));
      let { title, duration, image, link } = videos[i];
      let id = link.split('/').pop();
      results.push(`| ![${id}](${image}) | [${title}](${link}) | ${duration} | ${date.toLocaleDateString(...DATETIME_OPT)} |`);
    }
    return results;
  }
  
  function getVideos() {
    let i = video.index < MAX_REVIEW_COUNT ? 0 : video.index - MAX_REVIEW_COUNT;
    return readData().slice(i, i + MAX_REVIEW_COUNT);
  }
};

