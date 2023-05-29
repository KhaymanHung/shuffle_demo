const g_data = require('./database.json') ;
const board_level = 1;

// 列出方塊與方塊類型列表
let typeList = []
for (let i = 0; i < g_data.square.length; i++) {
    typeList[g_data.square[i].id] = g_data.square[i].type;
}

main = function() {
    // 取得現在階級盤面大小
    let boardX = 0;
    let boardY = 0;
    
    for (let i = 0; i < g_data.board.length; i++) {
        if (g_data.board[i].level === board_level) {
            boardX = g_data.board[i].x;
            boardY = g_data.board[i].y;
            break;
        }
    }
    
    if (boardX === 0 || boardY === 0) {
        return;
    }
    
    // 產生盤面
    let board = [];
    for (let i = 0; i < boardX; i++) {
        board[i] = [];
        for (let k = 0; k < boardY; k++) {
            board[i][k] = Math.floor(Math.random() * 5) + 1;
            // board[i][k] = Math.floor(Math.random() * g_data.square.length) + 1;
        }
    }

    let result = _play(board);

    if (result.length != 0) {
        result.forEach(element => {
            console.log("result id :");
            console.log(element.id);
            console.log("result coordinate :");
            console.log(element.coordinate);
        });
    }
}

_play = function(board) {
    console.log("原始盤面 :");
    console.log(board);
    
    let result = [];
    let boardX = board.length;
    let boardY = board.length;
    let cancelBoard = JSON.parse(JSON.stringify(board));
    
    // 判斷盤面消除
    for (let i = 0; i < boardX; i++) {
        for (let k = 0; k < boardY; k++) {
            let tempCancel = JSON.parse(JSON.stringify(cancelBoard));
            
            // 編號0代表已被消除，跳過，如果方塊type不是普通方塊(type=0)，也跳過
            if (tempCancel[i][k] != 0 && typeList[tempCancel[i][k]] === 0) {
                let checkId = tempCancel[i][k];
                
                let cancelList = [];
                tempCancel[i][k] = 0;
                let cancelItem = {}
                cancelItem.x = i;
                cancelItem.y = k;
                cancelList.push(cancelItem);
                // console.log("判斷起始[" + i + "][" + k + "]id為" + checkId);
    
                // 先往右判斷
                let nextX = i + 1;
                while (nextX < boardX && tempCancel[nextX][k] === checkId) {
                    tempCancel[nextX][k] = 0;
                    let cancelItem = {}
                    cancelItem.x = nextX;
                    cancelItem.y = k;
                    cancelList.push(cancelItem);
                    // console.log("[" + nextX + "][" + k + "]id相同，消除數量累計為" + cancelList.length);
    
                    // 有相同時，往下判斷
                    let nextY = k + 1;
                    while (nextY < boardY && tempCancel[nextX][nextY] === checkId) {
                        tempCancel[nextX][nextY] = 0;
                        let cancelItem = {}
                        cancelItem.x = nextX;
                        cancelItem.y = nextY;
                        cancelList.push(cancelItem);
                        // console.log("[" + nextX + "][" + nextY + "]id相同，消除數量累計為" + cancelList.length);
    
                        // 有相同時，往左判斷
                        let tx = nextX - 1;
                        while (tx >= 0 && tempCancel[tx][nextY] === checkId) {
                            tempCancel[tx][nextY] = 0;
                            let cancelItem = {}
                            cancelItem.x = tx;
                            cancelItem.y = nextY;
                            cancelList.push(cancelItem);
                            // console.log("[" + tx + "][" + nextY + "]id相同，消除數量累計為" + cancelList.length);
                            tx++;
                        }
    
                        // 有相同時，往右判斷
                        tx = nextX + 1;
                        while (tx < boardX && tempCancel[tx][nextY] === checkId) {
                            tempCancel[tx][nextY] = 0;
                            let cancelItem = {}
                            cancelItem.x = tx;
                            cancelItem.y = nextY;
                            cancelList.push(cancelItem);
                            // console.log("[" + tx + "][" + nextY + "]id相同，消除數量累計為" + cancelList.length);
                            tx++;
                        }
                        nextY++;
                    }
                    nextX++;
                }
    
                // 之後往下判斷
                let nextY = k + 1;
                while (nextY < boardY && tempCancel[i][nextY] === checkId) {
                    tempCancel[i][nextY] = 0;
                    let cancelItem = {}
                    cancelItem.x = i;
                    cancelItem.y = nextY;
                    cancelList.push(cancelItem);
                    // console.log("[" + i + "][" + nextY + "]id相同，消除數量累計為" + cancelList.length);
    
                    // 有相同時，往右判斷
                    let nextX = i + 1;
                    while (nextX < boardX && tempCancel[nextX][nextY] === checkId) {
                        tempCancel[nextX][nextY] = 0;
                        let cancelItem = {}
                        cancelItem.x = nextX;
                        cancelItem.y = nextY;
                        cancelList.push(cancelItem);
                        // console.log("[" + nextX + "][" + nextY + "]id相同，消除數量累計為" + cancelList.length);
    
                        // 有相同時，往上判斷
                        let ty = nextY - 1;
                        while (ty >= 0 && tempCancel[nextX][ty] === checkId) {
                            tempCancel[nextX][ty] = 0;
                            let cancelItem = {}
                            cancelItem.x = nextX;
                            cancelItem.y = ty;
                            cancelList.push(cancelItem);
                            // console.log("[" + nextX + "][" + ty + "]id相同，消除數量累計為" + cancelList.length);
                            ty++;
                        }
    
                        // 有相同時，往下判斷
                        ty = nextY + 1;
                        while (ty < boardY && tempCancel[nextX][ty] === checkId) {
                            tempCancel[nextX][ty] = 0;
                            let cancelItem = {}
                            cancelItem.x = nextX;
                            cancelItem.y = ty;
                            cancelList.push(cancelItem);
                            // console.log("[" + nextX + "][" + ty + "]id相同，消除數量累計為" + cancelList.length);
                            ty++;
                        }
                        nextX++
                    }
                    nextY++;
                }
    
                // 相鄰相同方塊連續數字大於4時，消除
                if (cancelList.length > 3) {
                    // console.log("消除數量為" + cancelList.length + "，連續相同方塊大於4，予以消除");
                    cancelBoard = JSON.parse(JSON.stringify(tempCancel));
                    let res = {};
                    res.id = checkId;
                    res.coordinate = cancelList;
                    result.push(res);
                } else {
                    // console.log("消除數量為" + cancelList.length + "，連續相同方塊未達4塊");              
                }
            }
        }
    }
    
    console.log("方塊消除後盤面 :");
    console.log(cancelBoard);
    
    for (let i = 0; i < result.length; i++) {
        console.log("清除id : " + result[i].id + " 的方塊 " + result[i].coordinate.length + " 個")
    }

    return result;
}

main();