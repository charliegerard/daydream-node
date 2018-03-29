var daydream = require('../daydream-node.js')();

daydream.onStateChange(function(data){
    // if(data.isClickDown){
    //     console.log('clicking down');
    // } else {
    //     console.log('not cliking down');
    // }

    console.log(data.xTouch);
})
