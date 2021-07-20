!async function () {
  console.log(new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yangon'
  }, '[STARTED]'));
  console.log(...process.argv.slice(2));
}();
