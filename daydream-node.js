/**
 * @author Charlie Gerard / https://charliegerard.github.io/
 */

var noble = require("noble");

var daydreamDeviceName = "Daydream controller";
var daydreamDeviceId = 'db7df138e6f4466aa8d01a514fa80991';
var daydreamPrimaryServiceUuid = "fe55";
var daydreamMainCharacteristicUuid = "0000000110001000800000805f9b34fb";

var state = {};

function DaydreamController(){
  noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
  });
  
  noble.on('discover', function(peripheral){
    if(peripheral.advertisement.localName === daydreamDeviceName || peripheral.id === daydreamDeviceId){
      console.log('peripheral id: ' + peripheral.id + ' found');
      console.log('Device name: ' + peripheral.advertisement.localName);
      noble.stopScanning();
    }
  
    explore(peripheral);
  });

  function explore(peripheral){
    peripheral.on('disconnect', function() {
      process.exit(0);
    });
  
    peripheral.connect(function(error){
      peripheral.discoverServices([daydreamPrimaryServiceUuid], function(error, services){
          if(services.length > 0){
              var primaryService = services[0];
            
              primaryService.discoverCharacteristics([daydreamMainCharacteristicUuid], function(error, characteristics){
                var mainCharacteristic = characteristics[0];
    
                mainCharacteristic.on("data", function(data, isNotification){
  
                  // The following is based on the work by @mrdoob you can find here: https://github.com/mrdoob/daydream-controller.js/blob/master/DaydreamController.js
                  state.isClickDown = (data.readUInt8(18) & 0x1) > 0;
                  state.isAppDown = (data.readUInt8(18) & 0x4) > 0;
                  state.isHomeDown = (data.readUInt8(18) & 0x2) > 0;
  
                  state.isVolPlusDown = (data.readUInt8(18) & 0x10) > 0;
                  state.isVolMinusDown = (data.readUInt8(18) & 0x8) > 0;
  
                  state.time = ((data.readUInt8(0) & 0xFF) << 1 | (data.readUInt8(1) & 0x80) >> 7);
  
                  state.seq = (data.readUInt8(1) & 0x7C) >> 2;
  
                  state.xOri = (data.readUInt8(1) & 0x03) << 11 | (data.readUInt8(2) & 0xFF) << 3 | (data.readUInt8(3) & 0x80) >> 5;
                  state.xOri = (state.xOri << 19) >> 19;
                  state.xOri *= (2 * Math.PI / 4095.0);
  
                  state.yOri = (data.readUInt8(3) & 0x1F) << 8 | (data.readUInt8(4) & 0xFF);
                  state.yOri = (state.yOri << 19) >> 19;
                  state.yOri *= (2 * Math.PI / 4095.0);
  
                  state.zOri = (data.readUInt8(5) & 0xFF) << 5 | (data.readUInt8(6) & 0xF8) >> 3;
                  state.zOri = (state.zOri << 19) >> 19;
                  state.zOri *= (2 * Math.PI / 4095.0);
  
                  state.xAcc = (data.readUInt8(6) & 0x07) << 10 | (data.readUInt8(7) & 0xFF) << 2 | (data.readUInt8(8) & 0xC0) >> 6;
                  state.xAcc = (state.xAcc << 19) >> 19;
                  state.xAcc *= (8 * 9.8 / 4095.0);
  
                  state.yAcc = (data.readUInt8(8) & 0x3F) << 7 | (data.readUInt8(9) & 0xFE) >>> 1;
                  state.yAcc = (state.yAcc << 19) >> 19;
                  state.yAcc *= (8 * 9.8 / 4095.0);
  
                  state.zAcc = (data.readUInt8(9) & 0x01) << 12 | (data.readUInt8(10) & 0xFF) << 4 | (data.readUInt8(11) & 0xF0) >> 4;
                  state.zAcc = (state.zAcc << 19) >> 19;
                  state.zAcc *= (8 * 9.8 / 4095.0);
  
                  state.xGyro = ((data.readUInt8(11) & 0x0F) << 9 | (data.readUInt8(12) & 0xFF) << 1 | (data.readUInt8(13) & 0x80) >> 7);
                  state.xGyro = (state.xGyro << 19) >> 19;
                  state.xGyro *= (2048 / 180 * Math.PI / 4095.0);
  
                  state.yGyro = ((data.readUInt8(13) & 0x7F) << 6 | (data.readUInt8(14) & 0xFC) >> 2);
                  state.yGyro = (state.yGyro << 19) >> 19;
                  state.yGyro *= (2048 / 180 * Math.PI / 4095.0);
  
                  state.zGyro = ((data.readUInt8(14) & 0x03) << 11 | (data.readUInt8(15) & 0xFF) << 3 | (data.readUInt8(16) & 0xE0) >> 5);
                  state.zGyro = (state.zGyro << 19) >> 19;
                  state.zGyro *= (2048 / 180 * Math.PI / 4095.0);
  
                  state.xTouch = ((data.readUInt8(16) & 0x1F) << 3 | (data.readUInt8(17) & 0xE0) >> 5) / 255.0;
                  state.yTouch = ((data.readUInt8(17) & 0x1F) << 3 | (data.readUInt8(18) & 0xE0) >> 5) / 255.0;
                  
                  onStateChangeCallback(state);
                });
    
                mainCharacteristic.subscribe(function(error) {
                  console.log('daydream controller notifications on');
                });
              })
            }
        });
    });
  
    function onStateChangeCallback(){}
  
    return {
      onStateChange: function ( callback ) {
        onStateChangeCallback = callback;
      }
    }
  }
}

module.exports = function(){
  return DaydreamController();
}

