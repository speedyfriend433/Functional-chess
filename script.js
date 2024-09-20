var game = new Chess();
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

var board = Chessboard('myBoard', config);

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;

    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' 
    });
  
    if (move === null) return 'snapback';

    updateStatus();
}

function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    var status = '';

    var moveColor = game.turn() === 'b' ? 'Black' : 'White';

    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
    else if (game.in_draw()) {
        status = 'Game over, drawn position.';
    }
    else {
        status = moveColor + ' to move';

        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check.';
        }
    }

    document.getElementById('status').innerHTML = status;
}

updateStatus();
