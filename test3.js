_checkFullDirect = function(board, x, y, id, list) {
    //  檢查右方是否為同樣id
    if (x + 1 < board.length && (board[x + 1][y] === id || board[x + 1][y] === 6)) {
        board[x + 1][y] = 0;
        let res = {};
        res.x = x + 1;
        res.y = y;
        list.push(res);
        console.log(res);
        _checkFullDirect(board, x + 1, y, id, list);
    }

    //  檢查下方是否為同樣id
    if (y + 1 < board[x].length && (board[x][y + 1] === id || board[x][y + 1] === 6)) {
        board[x][y + 1] = 0;
        let res = {};
        res.x = x;
        res.y = y + 1;
        list.push(res);
        console.log(res);
        _checkFullDirect(board, x, y + 1, id, list);
    }

    //  檢查左方是否為同樣id
    if (x - 1 >= 0 && (board[x - 1][y] === id || board[x - 1][y] === 6)) {
        board[x - 1][y] = 0;
        let res = {};
        res.x = x - 1;
        res.y = y;
        list.push(res);
        console.log(res);
        _checkFullDirect(board, x - 1, y, id, list);
    }
    //  檢查上方是否為同樣id
    if (y - 1 >= 0 && (board[x][y - 1] === id || board[x][y - 1] === 6)) {
        board[x][y - 1] = 0;
        let res = {};
        res.x = x;
        res.y = y - 1;
        list.push(res);
        console.log(res);
        _checkFullDirect(board, x, y - 1, id, list);
    }
}

const board = [ [ 4, 3, 6, 2 ], [ 7, 7, 7, 2 ], [ 5, 8, 3, 6 ], [ 8, 1, 2, 6 ]];

let result = [];
let cancelBoard = JSON.parse(JSON.stringify(board));
for (let i = 0; i < board.length; i++) {
    for(let k = 0; k < board.length; k++) {
        if (cancelBoard[i][k] === 7) {
            cancelBoard[i][k] = 0;
        }
    }
}

for (let i = 0; i < board.length; i++) {
    for(let k = 0; k < board.length; k++) {
        let tempCancel = JSON.parse(JSON.stringify(cancelBoard));
        let cancelList = [];
        let checkId = tempCancel[i][k];
        if (checkId < 1 ||checkId > 5) {
            continue;
        }
        tempCancel[i][k] = 0;
        let res = {};
        res.x = i;
        res.y = k;
        cancelList.push(res);
        console.log("start : " + i + " / " + k + " / " + checkId);
        _checkFullDirect(tempCancel, i, k, checkId, cancelList);
        if (cancelList.length >= 4) {
            cancelBoard = JSON.parse(JSON.stringify(tempCancel));
            let res = {};
            res.id = checkId;
            res.coordinate = cancelList;
            res.odds = 1;
            result.push(res);
        }
        console.log("end");
    }
}
console.log(result);