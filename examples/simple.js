var daydream = require('../daydream-node')();
var readline = require('readline');

daydream.onStateChange(function(data){
  // output whole data object using JSON.stringify and readline library
  // (i.e. overwrite output instead of appending)
  readline.clearScreenDown(process.stdout);
  process.stdout.write(JSON.stringify(data, null, 2));
  readline.moveCursor(process.stdout, null, -19);
  readline.cursorTo(process.stdout, 0);
});
