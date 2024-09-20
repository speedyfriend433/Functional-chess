document.addEventListener('DOMContentLoaded', function() {
  var board = null;
  var game = new Chess();

  function onDragStart(source, piece, position, orientation) {
    // Do not pick up pieces if the game is over or if it's not the player's turn
    if (game.game_over() || game.turn() !== 'w' || piece.search(/^b/) !== -1) {
      return false;
    }
  }

  function makeBestMove() {
    var bestMove = getBestMove(game);
    game.move(bestMove);
    board.position(game.fen());
    if (game.game_over()) {
      alert('Game over!');
    }
  }

  var positionCount;
  function getBestMove(game) {
    positionCount = 0;
    var depth = 2; // Adjust the AI difficulty here
    var bestMove = minimaxRoot(depth, game, true);
    return bestMove;
  }

  function onDrop(source, target) {
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // Always promote to a queen for simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';

    window.setTimeout(makeBestMove, 250);
  }

  function onSnapEnd() {
    board.position(game.fen());
  }

  var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };

  board = Chessboard('board', config);

  // Minimax algorithm and evaluation functions
  function minimaxRoot(depth, game, isMaximisingPlayer) {
    var newGameMoves = game.moves();
    var bestMove = -Infinity;
    var bestMoveFound;

    for (var i = 0; i < newGameMoves.length; i++) {
      var newGameMove = newGameMoves[i];
      game.move(newGameMove);
      var value = minimax(depth - 1, game, -Infinity, Infinity, !isMaximisingPlayer);
      game.undo();
      if (value >= bestMove) {
        bestMove = value;
        bestMoveFound = newGameMove;
      }
    }
    return bestMoveFound;
  }

  function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
      return -evaluateBoard(game.board());
    }

    var newGameMoves = game.moves();

    if (isMaximisingPlayer) {
      var bestValue = -Infinity;
      for (var i = 0; i < newGameMoves.length; i++) {
        game.move(newGameMoves[i]);
        bestValue = Math.max(bestValue, minimax(depth - 1, game, alpha, beta, false));
        game.undo();
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      return bestValue;
    } else {
      var bestValue = Infinity;
      for (var i = 0; i < newGameMoves.length; i++) {
        game.move(newGameMoves[i]);
        bestValue = Math.min(bestValue, minimax(depth - 1, game, alpha, beta, true));
        game.undo();
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      return bestValue;
    }
  }

  function evaluateBoard(board) {
    var totalEvaluation = 0;
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
      }
    }
    return totalEvaluation;
  }

  function getPieceValue(piece, x, y) {
    if (piece === null) {
      return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
      var pieceValue = 0;
      switch (piece.type) {
        case 'p':
          pieceValue = 10;
          break;
        case 'r':
          pieceValue = 50;
          break;
        case 'n':
          pieceValue = 30;
          break;
        case 'b':
          pieceValue = 30;
          break;
        case 'q':
          pieceValue = 90;
          break;
        case 'k':
          pieceValue = 900;
          break;
      }
      return isWhite ? pieceValue : -pieceValue;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return absoluteValue;
  }
});
