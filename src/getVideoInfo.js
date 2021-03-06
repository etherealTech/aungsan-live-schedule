const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { exec } = require('shelljs');

const MAX_LOGGING_SIZE = 20;
const VIDEO_DATA = resolve(__dirname, '../data/videos.json');
const DATABASE_PATH = resolve(__dirname, '../.db');
const GIT_AUTHOR_NAME = 'Bot';
const GIT_AUTHOR_EMAIL = '50423290+etherio97@users.noreply.github.com';

function readJSON(path) {
  let text = readFileSync(path, 'utf-8');
  return JSON.parse(text);
}

function readDB() {
  return readJSON(DATABASE_PATH);
}

function readData() {
  return readJSON (VIDEO_DATA);
}

function getVideo() {
  let { index } = readDB();
  let videos = readData();
  let video = videos[index];
  if (video === undefined) {
    index = 0;
    video = videos[index];
    console.log('video:reset-playlist');
  } else {
    console.log('video:next-playlist');
  }
  video.index = index;
  return video;
}

function updateVideo(index = 1) {
  let video = getVideo();
  let data = readDB();
  let log = {
    index: video.index,
    link: video.link,
    uptime: process.uptime(),
    datetime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }),
  };
  data.index = video.index + index;
  data.logs.unshift(log);
  data.logs = data.logs.slice(0, MAX_LOGGING_SIZE);
  writeFileSync(DATABASE_PATH, JSON.stringify(data), "utf-8");
}

function pushChanges(message, tracks = '--all') {
  let command = [
    "git config user.name '" + GIT_AUTHOR_NAME + "'",
    "git config user.email '" + GIT_AUTHOR_EMAIL + "'",
    "git add " + tracks,
    "git commit -m 'Live Schedule'",
    "git push"
  ].join(";\n");
  console.log('[GIT:PUSH]', tracks);
  exec(command);
}

module.exports = {
  readDB,
  readData,
  getVideo,
  updateVideo,
  pushChanges,
};
