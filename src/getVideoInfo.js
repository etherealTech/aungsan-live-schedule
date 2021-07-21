const { readFileSync, writeFileSync } = require('fs');

const VIDEO_DATA = '../data/videos.json';
const DATABASE_PATH = '../.db.json';

function readJSON(path) {
  let text = reaeFileSync(path, 'utf-8');
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
    throw new Error('Undefined index [' + index + '] in variable $videos');
  }
  return video;
};


module.exports = {
  getVideo,
};
