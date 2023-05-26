const g_data = require('./database.json') ;
const board_level = 1;

// 列出方塊與方塊類型列表
let typeList = []
for (let i = 0; i < g_data.square.length; i++) {
    typeList[g_data.square[i].id] = g_data.square[i].type;
}

// 列出方塊與方塊分數列表
let oddsList = []
for (let i = 0; i < g_data.square.length; i++) {
    oddsList[g_data.square[i].id] = g_data.square[i].odds;
}


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

console.log("原始盤面 :");
console.log(board);

let result = [];
let cancelBoard = JSON.parse(JSON.stringify(board));
let totalCancelCount = 0;
let loopCount = 0;
let isLoop = true;
while (isLoop) {
    // 判斷盤面消除
    for (let i = 0; i < boardX; i++) {
        for (let k = 0; k < boardY; k++) {
            let tempCancel = JSON.parse(JSON.stringify(cancelBoard));
            
            // 編號0代表已被消除，跳過，如果方塊type不是普通方塊(type=0)，也跳過
            if (tempCancel[i][k] != 0 && typeList[tempCancel[i][k]] === 0) {
                let checkId = tempCancel[i][k];
                
                let cancelCount = 0;
                tempCancel[i][k] = 0;
                // console.log("判斷起始[" + i + "][" + k + "]id為" + checkId);
    
                // 先往右判斷
                let nextX = i + 1;
                while (nextX < boardX && tempCancel[nextX][k] === checkId) {
                    if (cancelCount === 0) {
                        cancelCount = 2;
                    } else {
                        cancelCount++;
                    }
                    // console.log("[" + nextX + "][" + k + "]id相同，cancelCount累計為" + cancelCount);
                    tempCancel[nextX][k] = 0;
    
                    // 有相同時，往下判斷
                    let nextY = k + 1;
                    while (nextY < boardY && tempCancel[nextX][nextY] === checkId) {
                        cancelCount++;
                        // console.log("[" + nextX + "][" + nextY + "]id相同，cancelCount累計為" + cancelCount);
                        tempCancel[nextX][nextY] = 0;
    
                        // 有相同時，往左判斷
                        let tx = nextX - 1;
                        while (tx >= 0 && tempCancel[tx][nextY] === checkId) {
                            cancelCount++;
                            // console.log("[" + tx + "][" + nextY + "]id相同，cancelCount累計為" + cancelCount);
                            tempCancel[tx][nextY] = 0;
                            tx++;
                        }
    
                        // 有相同時，往右判斷
                        tx = nextX + 1;
                        while (tx < boardX && tempCancel[tx][nextY] === checkId) {
                            cancelCount++;
                            // console.log("[" + tx + "][" + nextY + "]id相同，cancelCount累計為" + cancelCount);
                            tempCancel[tx][nextY] = 0;
                            tx++;
                        }
                        nextY++;
                    }
                    nextX++;
                }
    
                // 之後往下判斷
                let nextY = k + 1;
                while (nextY < boardY && tempCancel[i][nextY] === checkId) {
                    if (cancelCount === 0) {
                        cancelCount = 2;
                    } else {
                        cancelCount++;
                    }
                    // console.log("[" + i + "][" + nextY + "]id相同，cancelCount累計為" + cancelCount);
                    tempCancel[i][nextY] = 0;
    
                    // 有相同時，往右判斷
                    let nextX = i + 1;
                    while (nextX < boardX && tempCancel[nextX][nextY] === checkId) {
                        cancelCount++;
                        // console.log("[" + nextX + "][" + nextY + "]id相同，cancelCount累計為" + cancelCount);
                        tempCancel[nextX][nextY] = 0;
    
                        // 有相同時，往上判斷
                        let ty = nextY - 1;
                        while (ty >= 0 && tempCancel[nextX][ty] === checkId) {
                            cancelCount++;
                            // console.log("[" + nextX + "][" + ty + "]id相同，cancelCount累計為" + cancelCount);
                            tempCancel[nextX][ty] = 0;
                            ty++;
                        }
    
                        // 有相同時，往下判斷
                        ty = nextY + 1;
                        while (ty < boardY && tempCancel[nextX][ty] === checkId) {
                            cancelCount++;
                            // console.log("[" + nextX + "][" + ty + "]id相同，cancelCount累計為" + cancelCount);
                            tempCancel[nextX][ty] = 0;
                            ty++;
                        }
                        nextX++
                    }
                    nextY++;
                }
    
                // 相鄰相同方塊連續數字大於4時，消取
                if (cancelCount > 3) {
                    // console.log("cancelCount為" + cancelCount + "，連續相同方塊大於4，予以消除");
                    cancelBoard = JSON.parse(JSON.stringify(tempCancel));
                    totalCancelCount += cancelCount;
                    let res = {};
                    res.id = checkId;
                    res.count = totalCancelCount;
                    result.push(res);
                } else {
                    // console.log("cancelCount為" + cancelCount + "，連續相同方塊未達4塊");              
                }
            }
        }
    }

    if (totalCancelCount > 0) {
        console.log("方塊消除後盤面 :");
        console.log(cancelBoard);

        console.log("此次盤面消除方塊" + totalCancelCount + "個，補全方塊後再次進行消除判斷");

        totalCancelCount = 0;
        isLoop = true;
        loopCount++;

        // 先將方塊往下掉落後，補齊空格
        for (let i = 0; i < boardX; i++) {
            for (let k = boardY - 1; k >= 0; k--) {
                if (cancelBoard[i][k] === 0) {
                    for (let tk = k - 1; tk >= 0; tk--) {
                        if (cancelBoard[i][tk] != 0) {
                            let temp = cancelBoard[i][tk];
                            cancelBoard[i][tk] = cancelBoard[i][k];
                            cancelBoard[i][k] = temp;
                            break;
                        }
                    }
                }
            }
        }
        console.log("方塊下落後盤面 :");
        console.log(cancelBoard);

        for (let i = 0; i < boardX; i++) {
            for (let k = 0; k < boardY; k++) {
                if (cancelBoard[i][k] === 0) {
                    cancelBoard[i][k] = Math.floor(Math.random() * 5) + 1;
                }
            }
        }

        console.log("第" + loopCount + "次補方塊後盤面 :");
        console.log(cancelBoard);
    } else {
        isLoop = false;
    }
}

console.log("最後的盤面 :");
console.log(cancelBoard);

for (let i = 0; i < result.length; i++) {
    console.log("清除id : " + result[i].id + " 的方塊 " + result[i].count + " 個")
}
