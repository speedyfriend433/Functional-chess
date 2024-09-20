// Initialize a new chess game
var game = new Chess();

// Configuration for the chessboard
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://cdnjs.cloudflare.com/ajax/libs/chessboard.js/1.0.0/img/chesspieces/wikipedia/{piece}.png'
};

// Initialize the chessboard
var board = Chessboard('myBoard', config);

// Function to prevent illegal moves
function onDragStart(source, piece, position, orientation) {
    // Do not pick up pieces if the game is over
    if (game.game_over()) return false;

    // Only pick up pieces for the current player's turn
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

// Function to handle piece drop events
function onDrop(source, target) {
    // See if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Automatically promote to a queen
    });

    // Illegal move
    if (move === null) return 'snapback';

    // Update the game status
    updateStatus();
}

// Function to update the board position after the piece snap
function onSnapEnd() {
    board.position(game.fen());
}

// Function to update the game status text
function updateStatus() {
    var status = '';

    var moveColor = game.turn() === 'b' ? 'Black' : 'White';

    // Checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
    // Draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position.';
    }
    // Game ongoing
    else {
        status = moveColor + ' to move';

        // Check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check.';
        }
    }

    // Update move history
    var history = game.history();
    var historyElement = document.getElementById('moveHistory');
    historyElement.innerHTML = 'Move History: ' + history.join(' ');

    // Update status display
    document.getElementById('status').innerHTML = status;
}

// Initial status update
updateStatus();
