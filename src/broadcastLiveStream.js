module.exports = function broadcastLiveStream(input, output) {
  console.log('[INFO] streaming live video RTMP url: %s', output);
  return `ffmpeg -y -re -i '${input}' -c:v libx264 -preset veryfast -tune zerolatency -b:v 2M -minrate 1M -maxrate 2M -bufsize 2M -c:a aac -b:a 1M -bufsize 1M -f flv '${output}'`;
};
