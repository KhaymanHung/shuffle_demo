const g_data = require('./database.json') ;

let GameServer = {}
module.exports = GameServer;

// 
GameServer.asyncPlay = async function(bet, token) {
    try {
        let sendClientMsg = {};
        sendClientMsg.error = 0;
        sendClientMsg.message = "";
        sendClientMsg.data = {
            "bet" : bet,
            "token" : token,
        };
        return sendClientMsg;
    } catch (e) {
        return Promise.reject(e);
    }
}