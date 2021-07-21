const DATETIME_OPTIONS = ['en-US', { timeZone: 'Asia/Yangon' }]; 

!function() {
  let ld = new Date().toLocaleDateString(...DATETIME_OPTIONS);
  ld = ld.split('/');
  ld = [ld[2], ld[0].length === 2 ? ld[0] : '0' + ld[0], ld[1]].join('-');
  let dt = new Date(`${ld} 19:00:00 GMT+6:30`);
  console.log(dt);
}();
