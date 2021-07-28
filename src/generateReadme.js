const { resolve } = require('path');
const { writeFileSync } = require('fs');
const { readDB, readData, getVideo } = require('./getVideoInfo.js');

const MAX_REVIEW_COUNT = 14;
const README_PATH = resolve(__dirname, '../README.md');
const DATETIME_OPT = ['en-US', { timeZone: 'Asia/Yangon' }];
const PER_DAY_VALUE = 24 * 3600 * 1000;

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
    `> generated for ${today.toLocaleString(...DATETIME_OPT)}`,
    '',
    '## Coming Up',
    '',
    '### ' + video.title + ' `' + video.duration + '`',
    '',
    'Original Link: [`#' + id +'`](' + video.link + ')',
    '',
    '## Upcoming',
    '',
    '| # | Title | Duration | Date |',
    '|:-----:|:------|---------:|-------------:|',
    ...createUpcoming(),
    '',
    '---',
    '',
    '_&copy; 2021-' + new Date().getFullYear() + ' [Ethereal](https://github.com/etherealtech)_',
  ];
  
  writeFileSync(README_PATH, markdown.join('\n'), 'utf-8');

  function convertToDate() {
    let [s, m, h] = cron.split(' ');
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
      let [DD, MM, YY] = new Date(today.getTime() + i * PER_DAY_VALUE).toLocaleDateString(...DATETIME_OPT).split('/');
      let time = new Date(today.getTime() + i * PER_DAY_VALUE).toLocaleTimeString(...DATETIME_OPT).spilt(':');
      let day = time.pop().split(' ').pop();
      let item = `| \`#${id}\` | [${title}](${link}) | ${duration} | ${DD}.${MM}.${YY} ${time.join(':')}${day}|`;
      items.push(item);
    }
    return items.slice(1);
  }
};

