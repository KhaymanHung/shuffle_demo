const express = require('express');
const GameServer = require('./GameServer');

const WebService_Base = require('./WebService_Base');

const i18n = require('i18next');
const i18nFsBackend = require('i18next-node-fs-backend');
const i18nMiddleware = require('i18next-express-middleware');

const app = express();

// 建立伺服器物件
class WebService extends WebService_Base {
    /**
     * 建構
     */
    constructor() {
        
        super();

        console.log("啟動 shuffle demo");
        
        const self = this;

        this.startWebLog(parseInt(8081));
    }

    startWebLog(port) {    
        const server = app.listen(port, function () {
                const host = "localhost";
                const port = server.address().port;
                console.log('WebService running at http://' + host + ':' + port);
            }
        );
    
        this.startSetting(app);
    }

    startSetting(app) {
        app.use(express.urlencoded({extended: true}));

        const self = this;

        app.get('/play', function (req, res, next) {
            let bet = req.query.bet;
            let token = req.query.token;

            console.log("REQ play [" + req.method + "] " + req.url + "\n\t" + JSON.stringify(req.query));

            GameServer.asyncPlay(bet, token)
                .then(data => {
                    res.send(WebService_Base.getClientStr(data));
                })
                .catch(err => {
                    console.warn('webService catch: ' + JSON.stringify(err));
                    res.send(WebService_Base.getClientStr(err));
                })
        });
    }
}

new WebService();