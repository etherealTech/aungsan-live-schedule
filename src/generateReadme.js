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
    page.name ? `# [${page.name}](https://www.facebook.com/${page.id})` : '# aungsan-live-schedule',
    '',
    `> generated at ${new Date().toLocaleString(...DATETIME_OPT)}`,
    '',
    '## Today\'s Selection',
    '',
    '### [' + video.title + '](' + video.link + ')',
    '![thumbnail](' + video.image + ')',
    '',
    '| | |',
    '|:--:|:---:|',
    `| Duration | ${video.duration} |`,
    `| Local time | ${schedule.time} |`,
    `| Local date | ${schedule.date} |`,
    '',
    '## Upcoming Schedule',
    '',
    '| Video | Title | Duration | Date |',
    '|:-----:|:------|---------:|-------------:|',
    ...createUpcoming(),
    '',
    '## Previous Broadcast',
    '',
    '| Video | Title | Duration | Date |',
    '|:-----:|:------|---------:|-------------:|',
    ...createPrevious(),
    '',
    '_&copy; 2021-' + new Date().getFullYear() + ' [Ethereal](https://github.com/etherealtech)_',
  ];
  
  writeFileSync(README_PATH, markdown.join('\n'), 'utf-8');
  
  function convertToDate(cron) {
    let [s, m, h ] = cron.split(' ');
    if (parseInt(m) < 10) {
      m = '0' + m;
    }
    if (parseInt(s) < 10) {
      s = '0' + s;
    }
    return {
      date: new Date().toLocaleDateString(...DATETIME_OPT),
      time: `${h}:${m}:${s}`,
    };
  }
    
  function createUpcoming() {
    let items = [];
    let data = readData().slice(video.index, video.index + MAX_REVIEW_COUNT);
    for (let i in data) {
      let { title, duration, image, link } = data[i];
      let item = `| ![${id}](${image}) | [${title}](${link}) | ${duration} | ${new Date(Date.now() + i * PER_DAY_VALUE).toLocaleDateString(...DATETIME_OPT)} |`;
      items.push(item);
    }
    return items;
  }
  
  function createPrevious() {
    let items = [];
    let index = video.index < MAX_REVIEW_COUNT ? 0 : video.index - MAX_REVIEW_COUNT;
    let data = readData().slice(0, video.index - 1);
    for (let i in data) {
      let { title, duration, image, link } = data[i];
      let item = `| ![${id}](${image}) | [${title}](${link}) | ${duration} | ${new Date(Date.now() - i * PER_DAY_VALUE).toLocaleDateString(...DATETIME_OPT)} |`;
      items.push(item);
    }
    return items;
  }
};

