MediaDevices = [];
function fixed_enumerateMediaDevices() {
    try {
        //addLog('enumerateMediaDevices()');
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.log("Media Devices cannot be enumerated on this browser.");
            return;
        }

        navigator.mediaDevices.enumerateDevices().then(devices => {
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    var deviceName = device.label || 'device #' + MediaDevices.length;
                    var mediaDevice = {
                        deviceName: deviceName,
                        refCount: 0,
                        deviceId: device.deviceId,
                        video: null
                    };
                    MediaDevices.push(mediaDevice);
                }
            });
        }).catch(function (err) {
            console.log(err.name + ':  ' + err.message);
        });
    } catch (ex) {
        console.log('fixed_enumerateMediaDevices error', ex);
    }
}

function fixed_JS_WebCamVideo_GetNumDevices() {
    try {
        //addLog(`_JS_WebCamVideo_GetNumDevices()`);
        return MediaDevices.length;
    } catch (ex) {
        console.log('fixed_JS_WebCamVideo_GetNumDevices error', ex);
    }
}
function fixed_JS_WebCamVideo_GetDeviceName(deviceId, buffer) {
    try {
        //addLog(`_JS_WebCamVideo_GetDeviceName(deviceId=${deviceId}, buffer=${buffer})`);
        if (buffer) writeStringToMemory(MediaDevices[deviceId].deviceName, buffer, false);
        return MediaDevices[deviceId].deviceName.length;
    } catch (ex) {
        console.log('fixed_JS_WebCamVideo_GetDeviceName error', ex);
    }
}

Array.prototype.push = (function () {
    var orgPush = Array.prototype.push;
    return function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'function' && arguments[i].toString().includes('navigator.mediaDevices.enumerateDevices')) {
                arguments[i] = fixed_enumerateMediaDevices;
            }
        }
        return orgPush.apply(this, arguments);
    };
})();

Object.defineProperties(Module, {
    _asmLibraryArg: {
        value: true,
        writable: true
    },
    asmLibraryArg: {
        get: function () {
            return this._asmLibraryArg;
        },
        set: function (val) {
            val._JS_WebCamVideo_GetNumDevices = fixed_JS_WebCamVideo_GetNumDevices;
            val._JS_WebCamVideo_GetDeviceName = fixed_JS_WebCamVideo_GetDeviceName;
        }
    }
});