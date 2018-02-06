# Daydream-node

Quick Node.js module to connect to the Daydream controller and receive all data.


# Installation:

* Clone this repo and run:

```
npm install
node examples/simple.js
```

OR

```
npm install daydream-node
```

# Usage:

*Make sure your Bluetooth connection is on.*

```javascript
var daydream = require('daydream-node')();

daydream.onStateChange(function(data){
    if(data.isClickDown){
        // do something
    }
});
```

# Data available:

Buttons events:

```javascript
// returns true if the button is clicked.
.isClickDown
.isHomeDown
.isAppDown 
.isVolPlusDown
.isVolMinusDown
```

Orientation:

```javascript
// returns a float number with the orientation value for each axis.
.xOri
.yOri
.zOri
```

Accelerometer:

```javascript
// returns a float number with the accelerometer value for each axis.
.xAcc
.yAcc
.zAcc
```

Gyroscope:

```javascript
// returns a float number with the gyroscope value for each axis.
.xGyro
.yGyro
.zGyro
```

Touch events:

```javascript
// returns a floating number between 0 and 1 representing the position of the finger on the main button on the x and y axis.
.xTouch
.yTouch
```

This module was built based on [@mrdoob](https://github.com/mrdoob)'s previous work on the [same concept](https://github.com/mrdoob/daydream-controller.js/blob/master/DaydreamController.js) using Web Bluetooth. 