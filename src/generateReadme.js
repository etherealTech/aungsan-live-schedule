const { resolve } = require('path');
const { writeFileSync } = require('fs');
const { readDB, readData, getVideo } = require('./getVideoInfo.js');

const MAX_REVIEW_COUNT = 14;
const README_PATH = resolve(__dirname, '../README.md');
const DATETIME_OPT = ['en-US', { timeZone: 'Asia/Yangon' }];
const PER_DAY_VALUE = 24 * 3600 * 1000; // hour * minute * millisecond

module.exports = function generateReadme(page, cron) {
  let time = convertToDate();
  let today = new Date().toLocaleDateString(...DATETIME_OPT);
  today = today.split('/');
  today = [today[2], today[0].length === 2 ? today[0] : '0' + today[0], today[1]].join('-');
  today = new Date(`${today} ${time} GMT+6:30`);
 
  let video = getVideo();
  let id = video.link.split('/').pop();

  let markdown = [
    page.name ? `# [${page.name}](https://www.facebook.com/${page.id})` : '# aungsan-live-schedule',
    '',
    `> generated at ${today.toLocaleString(...DATETIME_OPT)}`,
    '',
    '## Today\'s Selection',
    '',
    '### ' + video.title + ' (`' + video.duration + '`)',
    '',
    '![thumbnail](' + video.image + ')',
    '',
    'Original Link: [`#' + id +'`](' + video.link + ')',
    '',
    '## Upcoming',
    '',
    '| Video | Title | Duration | Date |',
    '|:-----:|:------|---------:|-------------:|',
    ...createUpcoming(),
    '',
//    '## Previous Broadcast',
//    '',
//    '| Video | Title | Duration | Date |',
//    '|:-----:|:------|---------:|-------------:|',
//   ...createPrevious(),
//    '',
    '_&copy; 2021-' + new Date().getFullYear() + ' [Ethereal](https://github.com/etherealtech)_',
  ];
  
  writeFileSync(README_PATH, markdown.join('\n'), 'utf-8');

  function convertToDate() {
    let [s, m, h ] = cron.split(' ');
    if (h.length === 1) {
      h = '0' + h;
    }
    if (m.length === 1) {
      m = '0' + m;
    }
    if (s.length === 1) {
      s = '0' + s;
    }
    return `${h}:${m}:${s}`;
  }
    
  function createUpcoming() {
    let items = [];
    let data = readData().slice(video.index, video.index + MAX_REVIEW_COUNT + 1);
    for (let i in data) {
      let { title, duration, image, link } = data[i];
      let id = link.split('/').pop();
      title = title.replace(/\|/gm, '-');
      let date = new Date(today.getTime() + i * PER_DAY_VALUE);
      let item = `| ![thumbnail](${image}) | \`#${id}\` [${title}](${link}) | ${duration} | ${date.toLocaleString(...DATETIME_OPT)} |`;
      items.push(item);
    }
    return items.slice(1);
  }
  
  function createPrevious() {
    let items = [];
    let index = video.index < MAX_REVIEW_COUNT ? 0 : video.index - MAX_REVIEW_COUNT;
    let data = readData().slice(0, video.index - 1);
    for (let i in data) {
      let { title, duration, image, link } = data[i];
      let item = `| ![${id}](${image}) | [${title}](${link}) | ${duration} | ${new Date(Date.now() - ((i + 1) * PER_DAY_VALUE)).toLocaleDateString(...DATETIME_OPT)} |`;
      items.push(item);
    }
    return items;
  }
};

