const g_data = require('./database.json') ;
const board_level = 1;

// 列出方塊與方塊類型列表
let typeList = [];
let oddsList = [];
let squareList = [];
g_data.square.forEach(element => {
    typeList[element.id] = element.type;
    oddsList[element.id] = element.odds;
    if (element.type === 0) {
        squareList.push(element.id);
    }
});

// 將普通方塊id依照分數高低排列
for (let i = 0; i < squareList.length; i++) {
    for (let k = i + 1; k < squareList.length; k++) {
        if (oddsList[squareList[i]] < oddsList[squareList[k]]) {
            let temp = squareList[i];
            squareList[i] = squareList[k];
            squareList[k] = temp;
        }
    }
}

let setCancelCount = g_data.setup.cancel;

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
            board[i][k] = Math.floor(Math.random() * 8) + 1;
            // board[i][k] = Math.floor(Math.random() * g_data.square.length) + 1;
        }
    }

    // board = [ [ 1, 6, 6, 1 ], [ 2, 2, 2, 2 ], [ 3, 3, 7, 3 ], [ 4, 4, 4, 4 ] ];
    // board = [ [ 4, 6, 6, 6 ], [ 1, 1, 7, 6 ], [ 5, 8, 6, 7 ], [ 8, 7, 6, 6 ] ];
    // board = [ [ 4, 3, 6, 2 ], [ 7, 7, 7, 2 ], [ 5, 8, 3, 6 ], [ 8, 1, 2, 6 ] ];

    let result = _play(board);

    if (result.length != 0) {
        result.forEach(element => {
            console.log("result id : " + element.id);
            console.log("result coordinate :");
            console.log(element.coordinate);
            console.log("result odds : " + element.odds);
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
    let freespinCoordinate = [];
    
    // 判斷盤面消除，先清除type 2和type 3
    for (let i = 0; i < boardX; i++) {
        for (let k = 0; k < boardY; k++) {
            let tempCancel = JSON.parse(JSON.stringify(cancelBoard));
            
            // 編號0代表已被消除，跳過
            if (tempCancel[i][k] != 0) {
                // 進階方塊(type=2)消除判斷
                if (typeList[cancelBoard[i][k]] === 2) {
                    let saveId = cancelBoard[i][k];
                    cancelBoard[i][k] = 0;
                    let haveKey = false;
                    result.forEach(element => {
                        if (element.id === saveId) {
                            haveKey = true;
                            return;
                        }
                    });
                    let cancelItem = {}
                    cancelItem.x = i;
                    cancelItem.y = k;
                    if (haveKey === false) {
                        let res = {};
                        res.id = saveId;
                        res.coordinate = [];
                        res.coordinate.push(cancelItem);
                        res.odds = oddsList[res.id];
                        result.push(res);
                    } else {
                        result.forEach(element => {
                            if (element.id === saveId) {
                                element.coordinate.push(cancelItem);
                            }
                        });
                    }
                }

                // freespin方塊(type=3)判斷
                if (typeList[cancelBoard[i][k]] === 3) {
                    let cancelItem = {}
                    cancelItem.x = i;
                    cancelItem.y = k;
                    freespinCoordinate.push(cancelItem);
                }
            }
        }
    }
    
    // freespin方塊只有場上有3個以上時才會產生效果
    if (freespinCoordinate.length >= 3) {
        freespinCoordinate.forEach(element => {
            cancelBoard[element.x][element.y] = 0;
        });
        let res = {};
        for (let i = 0; i < typeList.length; i++) {
            if (typeList[i] === 3) {
                res.id = i;
                break;
            }
        }
        res.coordinate = freespinCoordinate;
        result.push(res);
        res.odds = oddsList[res.id];
    }

    // 判斷普通方塊消除，根據ID從高分到低分來判斷，以免百搭方堆在多個選擇時被用在低分方塊上
    squareList.forEach(element => {
        let checkId = element;
        for (let i = 0; i < boardX; i++) {
            for (let k = 0; k < boardY; k++) {
                let tempCancel = JSON.parse(JSON.stringify(cancelBoard));
                
                // 如果不是checkid則跳過
                if (tempCancel[i][k] == checkId) {
                    let cancelList = [];
                    tempCancel[i][k] = 0;
                    let cancelItem = {}
                    cancelItem.x = i;
                    cancelItem.y = k;
                    cancelList.push(cancelItem);
                    // console.log("判斷起始[" + i + "][" + k + "]id為" + checkId);
                    
                    // 判斷座標周圍的圖騰的是否為checkID或百搭圖騰
                    _checkFullDirect(tempCancel, i, k, checkId, cancelList);

                    // 相鄰相同方塊連續數字大於4時，消除
                    if (cancelList.length >= setCancelCount) {
                        // console.log("消除數量為" + cancelList.length + "，連續相同方塊大於4，予以消除");
                        cancelBoard = JSON.parse(JSON.stringify(tempCancel));
                        let res = {};
                        res.id = checkId;
                        res.coordinate = cancelList;
                        res.odds = oddsList[res.id];
                        result.push(res);
                    } else {
                        // console.log("消除數量為" + cancelList.length + "，連續相同方塊未達4塊");              
                    }
                }
            }
        }
    });

    console.log("方塊消除後盤面 :");
    console.log(cancelBoard);
    
    return result;
}

_checkFullDirect = function(board, x, y, id, list) {
    //  檢查右方是否為同樣id或百搭圖騰
    if (x + 1 < board.length && (board[x + 1][y] === id || typeList[board[x + 1][y]] === 1)) {
        board[x + 1][y] = 0;
        let res = {};
        res.x = x + 1;
        res.y = y;
        list.push(res);
        // console.log(res);
        _checkFullDirect(board, x + 1, y, id, list);
    }

    //  檢查下方是否為同樣id或百搭圖騰
    if (y + 1 < board[x].length && (board[x][y + 1] === id || typeList[board[x][y + 1]] === 1)) {
        board[x][y + 1] = 0;
        let res = {};
        res.x = x;
        res.y = y + 1;
        list.push(res);
        // console.log(res);
        _checkFullDirect(board, x, y + 1, id, list);
    }

    //  檢查左方是否為同樣id或百搭圖騰
    if (x - 1 >= 0 && (board[x - 1][y] === id || typeList[board[x - 1][y]] === 1)) {
        board[x - 1][y] = 0;
        let res = {};
        res.x = x - 1;
        res.y = y;
        list.push(res);
        // console.log(res);
        _checkFullDirect(board, x - 1, y, id, list);
    }
    //  檢查上方是否為同樣id或百搭圖騰
    if (y - 1 >= 0 && (board[x][y - 1] === id || typeList[board[x][y - 1]] === 1)) {
        board[x][y - 1] = 0;
        let res = {};
        res.x = x;
        res.y = y - 1;
        list.push(res);
        // console.log(res);
        _checkFullDirect(board, x, y - 1, id, list);
    }
}

main();