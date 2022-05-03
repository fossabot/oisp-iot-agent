/*
Copyright (c) 2022, Intel Corporation

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

var assert =  require('chai').assert,
    rewire = require('rewire');
var fileToTest = "../lib/cloud.proxy.js";

describe(fileToTest, function() {
    var ToTest = rewire(fileToTest);
    var logger = {
        info : function() {},
        error : function() {},
        debug : function() {}
    };
    console.debug = function() {
        console.log(arguments);
    };
    var secret = {};
    var store = {};
    var conf ={
        "connector": {
            "rest": {
                "host": "frontend",
                "port": 4001,
                "protocol": "http",
                "strictSSL": false,
                "timeout": 30000,
                "proxy": {
                    "host": false,
                    "port": false
                }
            },
            "mqtt": {
                "host": "emqx",
                "port": 1883,
                "qos": 1,
                "retain": false,
                "secure": true,
                "strictSSL": false,
                "retries": 5,
                "sparkplugB": true,
                "version": "spBv1.0",
                "hwVersion": "Emulated Hardware",
                "swVersion": "v1.0.0",
                "rejectUnauthorized": false
            }
        }

    }
    var deviceConf = {
        "activation_retries": 10,
        "activation_code": null,
        "device_id": "spbdev0123",
        "device_name": "spbdevice",
        "device_loc": [
            88.34,
            64.22047,
            0
        ],
        "gateway_id": "spbgateway0123",
        "device_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0Smp6ejhEUzc0S2M5TXY5OHZhb0RMTHZuaV85b25JOGdvLXExSkVZamRjIn0.eyJleHAiOjE2NTA3MTc5ODUsImlhdCI6MTY1MDYzMTU4NSwianRpIjoiNWJlNDk3YjItNzZiMC00MGYyLTg3ZWQtMmI0YmRhYmZjMmQwIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLWh0dHA6NDA4MC9rZXljbG9hay9yZWFsbXMvT0lTUCIsImF1ZCI6WyJ3ZWJzb2NrZXQtc2VydmVyIiwib2lzcC1mcm9udGVuZCIsIm1xdHQtYnJva2VyIl0sInN1YiI6InNwYmRldjAxMjMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJvaXNwLWZyb250ZW5kIiwic2Vzc2lvbl9zdGF0ZSI6ImRmZmE2NDE2LThjNWYtNDMyYi1hZTczLWNlY2E1YzM5ZWY1MyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im9pc3AtZnJvbnRlbmQiOnsicm9sZXMiOlsidXNlciJdfX0sInNjb3BlIjoib3BlbmlkIHdlYnNvY2tldC1zZXJ2ZXIgb2ZmbGluZV9hY2Nlc3Mgb2lzcC1mcm9udGVuZCBhY2NvdW50cyBnYXRld2F5IG1xdHQtYnJva2VyIHR5cGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYWNjb3VudHMiOlt7ImlkIjoiODU3NDM1OTctNGRiYi00NTQ5LWIyMmYtMTY1ZTM1OTcwNjMwIiwicm9sZSI6ImRldmljZSJ9XSwidHlwZSI6ImRldmljZSIsImVtYWlsIjoicGxhY2Vob2xkZXJAcGxhY2Vob2xkZXIub3JnIiwiZ2F0ZXdheSI6InNwYmRldjAxMjMifQ.tg7SjQ1enmTFL8r_V7bhy2gqF4ZPwX-NajYWWQWwmfF8uWVWmljSoSRSrPRI3HDGmVgbJkmWWszeXXiI5x7P5psYgD8Iqd4Al32xhr-u0Qgil2ybqHc4w7DqhtydnGr9OmO7xp9Gwy8OW40E8qyWa6my4Fnqy_oDXtLMvsVJJd8m95z5tQrOah-3AeWDJCCzT7ij8bMf0Fyg_asklqTMhPbwcx1TPPTDvZ3d4rlJKrkSb1e7YsHJxvDX2px30RoXQpy1tKNCaofr2Sa-XugHjDL5d9-y3Lkd7FOlSsgLLQNQ0tvRXl0S3s5fSkYW7hKcbR3pIDwsBGZkmlEf4JhURg",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjNDcyY2M5Ni01M2I5LTRkNWYtODZhMS02MzM1ZWUyMzdjYmUifQ.eyJpYXQiOjE2NTA2MzE1ODUsImp0aSI6IjhkYzNkMjVmLTNhMGYtNDQyNC04ZjcyLTc2OTBmNGJlZDlhOSIsImlzcyI6Imh0dHA6Ly9rZXljbG9hay1odHRwOjQwODAva2V5Y2xvYWsvcmVhbG1zL09JU1AiLCJhdWQiOiJodHRwOi8va2V5Y2xvYWstaHR0cDo0MDgwL2tleWNsb2FrL3JlYWxtcy9PSVNQIiwic3ViIjoic3BiZGV2MDEyMyIsInR5cCI6Ik9mZmxpbmUiLCJhenAiOiJvaXNwLWZyb250ZW5kIiwic2Vzc2lvbl9zdGF0ZSI6ImRmZmE2NDE2LThjNWYtNDMyYi1hZTczLWNlY2E1YzM5ZWY1MyIsInNjb3BlIjoib3BlbmlkIHdlYnNvY2tldC1zZXJ2ZXIgb2ZmbGluZV9hY2Nlc3Mgb2lzcC1mcm9udGVuZCBhY2NvdW50cyBnYXRld2F5IG1xdHQtYnJva2VyIHR5cGUgZW1haWwifQ.-SuKVy_3nwmrh6lYPwmqpBo2zctsSQC5dJgKUmsr-ws",
        "device_token_expire": 1650717985000,
        "account_id": "85743597-4dbb-4549-b22f-165e35970630",
        "sensor_list": [
            {
                "cid": "b0c59d04-d3c4-4d75-8e27-8104b8546aa1",
                "name": "Sensor Name",
                "type": "temperature.v1.0"
            }
        ],
        "last_actuations_pull_time": false
    };
    var cid = "b0c59d04-d3c4-4d75-8e27-8104b8546aa1";

    it('Shall Return True if SparkplugB Data Submit is correct >', function(done) {
       
        var metric = [{
            n: "Sensor Name",
            alias: cid,
            value: "value"
        }];
        var deviceId = "spbdev0123";
        var customProxy = "mqtt";
        var spbMetricList = [{
            name : "Sensor Name",
            alias  : cid ,
            timestamp : 12345,
            dataType : "float",
            value : 0
        }];
          
        var spBProxy = function (){
            return {
                nodeBirth : function(){
                    return 0;
                },
                deviceBirth : function(){
                    return 0;
                },
                data : function(devProf,componentMetrics){
                    var value = {
                        name : "Sensor Name",
                        alias : cid,
                        timestamp : 12345,
                        dataType : "float",
                        value: "value"
                    };
                     var devProfile ={
                        groupId    : deviceConf['account_id'],
                        edgeNodeId : deviceConf['gateway_id'],
                        clientId   : deviceConf['device_name'],
                        deviceId   : deviceConf['device_id'],         
                        componentMetric : IoTkitCloud.spbMetricList
                     };

                    assert.equal(componentMetrics,value, "Wrong sparkplugB payload metrics formed from catalog and data due to mismatch of alias")
                    assert.equal(devProf,devProfile, " Device profile sent based on data/device.json doesnot match")
                    return true;
                }
            }

        }
        var IoTkitCloud = ToTest.init(logger,deviceId);
        IoTkitCloud.spBProxy = spBProxy;
        IoTkitCloud.spbMetricList= spbMetricList;
        IoTkitCloud.deviceConf= deviceConf;
        ToTest.__set__("conf", conf);
    
        IoTkitCloud.dataSubmit(metric);
        
        done();
        
    });
})