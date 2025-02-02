/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
"use strict";
var mac = require("getmac"),
    os = require("os"),
    http = require("http"),
    config = require ('../config'),
    publicApi = require('@open-iot-service-platform/oisp-sdk-js')(config).api.rest.publicApi,
    pkgJson = require('../package.json'),
    common = require('./common');
    
function IoTKitUtils(cfg) {
    var me = this;
    common.initializeDataDirectory();
    me.deviceConf = common.getDeviceConfig();
    me.config = cfg;
    me.did = me.deviceConf.device_id;
}
IoTKitUtils.prototype.getLocation = function () {
    //TODO Need to implement location gather info
    if (this.deviceConf.device_loc) {
        return this.deviceConf.device_loc;
    }
    return null;
};
IoTKitUtils.prototype.getAgentAttr = function () {
    return {
        "agent_version": pkgJson.version,
        "hardware_vendor": os.cpus()[0].model,
        "hardware_model": os.platform(),
        "Model Name": os.arch(),
        "Firmware Version": os.release()
    };
};
IoTKitUtils.prototype.externalInfo = function(cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }
    publicApi.getExternalInfo(function (err, data) {
        if (!err) {
            data.ip_local = me.getIPs()[0];
            cb(data);
        } else {
            cb(null);
        }
    });
};
IoTKitUtils.prototype.getExternalInfo = function(cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }

    var options = {
        host: 'ipinfo.io',
        port: 80,
        method: 'GET'
    };
    http.request(options, function(res) {
        if (res.statusCode === 200) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);
                data.ip_local = me.getIPs()[0];
                cb(data);
            });
        } else {
            cb(null);
        }
    }).end();
};
IoTKitUtils.prototype.getDeviceId = function(cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }
    // if use explicit Id if one was defined in the configuration file
    // account for the different ways people could spell it ;)
    if (me.did) {
        cb(me.did);
        return;
    }
  
    mac.getMac(function(err, macAddress) {
        var result = null;
        if (err) {
        //Unable to get MAC address
            result = os.hostname().toLowerCase();
        } else {
            result = macAddress.replace(/:/g, '-');
        }
        me.did = result;
        cb(result);
    });
};
IoTKitUtils.prototype.getIPs = function() {
    var addresses = [];
    var interfaces = os.networkInterfaces();
    for (var k in interfaces) {
        if (interfaces.hasOwnProperty(k)) {
            for (var k2 in interfaces[k]) {
                if (interfaces[k].hasOwnProperty(k2)) {
                    var address = interfaces[k][k2];
                    if (address.family === 'IPv4' && !address.internal) {
                        addresses.push(address.address);
                    }
                }
            }
        }
    }

    return addresses;
  
};

IoTKitUtils.prototype.getGatewayId = function(key, cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }

    if (me.config[key]) {
        cb(me.config[key]);
    } else {
        (me.getDeviceId(cb));
    }
};

IoTKitUtils.prototype.getDataDirectory = function(key, cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }

    if (me.config[key]) {
        cb(me.config[key]);
    } else {
        throw "Config for data directory not found";
    }
};

IoTKitUtils.prototype.getValueFromDeviceConfig = function(key, cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }

    if (me.deviceConf[key]) {
        cb(me.deviceConf[key]);
    } else {
        throw "Value not found in device config";
    }
};

IoTKitUtils.prototype.updateCatalog = function(data) {
    common.writeCatalog(data);
};

IoTKitUtils.prototype.getItemFromCatalog = function(id, callback) {
    if (!callback) {
        throw "Callback required!";
    }

    // Update catalog
    var catalog = common.getCatalog();

    var item = catalog.find(i => i.id === id);
    if (item) {
        callback(item)
    } else {
        callback(null);
    }
};

IoTKitUtils.prototype.getMinutesAndSecondsFromMiliseconds = function(miliseconds) {
    var minutes = Math.floor(miliseconds / 60000),
        seconds = ((miliseconds % 60000) / 1000).toFixed(0);
    return {m: minutes, s: seconds};
};

exports.init = function() {
    var utils = new IoTKitUtils(config);
    return utils;
};  
