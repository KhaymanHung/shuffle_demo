//DEBUG="pm2:*" pm2 restart universalApps/CLI.js --no-daemon --watch
//套件
// const pm2 = require('pm2');
// const express = require('express');
// var cors = require('cors');
// const fs = require('fs');
// const path = require('path');
var getIP = require('ipware')().get_ip;

const moment = require('moment');

class WebService_Base {

    static getClientIp2(req) {
        var ipInfo = getIP(req);
        console.log(ipInfo);
        return ipInfo;
        // { clientIp: '127.0.0.1', clientIpRoutable: false }
    }

    static getClientIp(req) {
        // let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        // if (!ipAddress) {
        //     return '';
        // }
        // if (ipAddress.substr(0, 7) === "::ffff:") {
        //     ipAddress = ipAddress.substr(7)
        // }
        let ipInfo = getIP(req);

        if (ipInfo.clientIp.substr(0, 7) === "::ffff:") {
            ipInfo.clientIp = ipInfo.clientIp.substr(7);
        }

        return ipInfo.clientIp;
    }

    static getResponseStr(data, errMsg) {
        let resObj = {};
        if (data) {
            //success
            resObj = {statusCode: 1, data: data, err: null}
        } else {
            resObj = {statusCode: -1, data: null, err: errMsg}
        }
        return JSON.stringify(resObj);
    }

    static getClientStr(data) {
        data.time = moment().format("X");
        return JSON.stringify(data);
    }

    static getResponseObj(data, errMsg) {
        let resObj = {};
        if (data) {
            //success
            resObj = {statusCode: 1, data: data, err: null}
        } else {
            resObj = {statusCode: -1, data: null, err: errMsg}
        }

        return resObj;

    }

    constructor() {

    }


}


module.exports = WebService_Base;
