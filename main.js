//creates the board with square divs, img for piece, and eventlistener
for (let i = 0; i < 64; i++) {
	let square = document.createElement("div");
	square.className = "square";
	square.id = i;
	square.addEventListener("dragover", dragOverSquare);
	square.addEventListener("drop", dragDropSquare);
	let elem = document.createElement("img");
	elem.id = "square" + i;
	elem.src = "";
	elem.style.width = "100px";
	elem.addEventListener("dragstart", dragStartPiece);
	square.appendChild(elem);
	let board = document.getElementById("board");
	board.appendChild(square);
}

//creates the colors of the squares
for (let i = 0; i < 64; i++) {
	if (i % 2 === 0 && i % 16 < 8) {
		document.getElementById("" + i).style.backgroundColor = "#ffe6b3";
		document.getElementById("" + i).className += " white;"
	} else if (i % 2 === 1 && i % 16 > 8) {
		document.getElementById("" + i).style.backgroundColor = "#ffe6b3";
		document.getElementById("" + i).className += " white;"
	} else {
		document.getElementById("" + i).style.backgroundColor = "#86592d";
		document.getElementById("" + i).className += " black;"
	}
}

//sets pieces on the board
function updatePieces() {
	for (let i = 0; i < 64; i++) {
		if (board[i] !== "x") {
			document.getElementById("square" + i).src =
				"./pieces/" + board[i] + ".png";
			//document.getElementById("" + i).className = board[i];
		} else {
			document.getElementById("square" + i).src = "";
		}
	}
}

//array of the pieces on the board
const board = ["1r","1n","1b","1q","1k","1b","1n","1r","1p","1p","1p","1p","1p","1p","1p","1p","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","0p","0p","0p","0p","0p","0p","0p","0p","0r","0n","0b","0q","0k","0b","0n","0r",];

//move piece from to another square: a1 -> a2
function makeMove(from, to) {
	if (checkMovePossible(board[convertToIndex(from)], from, to)) {
		const piece = getPiece(from);
		board[convertToIndex(to)] = piece;
		board[convertToIndex(from)] = "x";
		updatePieces();
	} else {
		return "invalid move";
	}
}

//get the piece that is standing on the from square
function getPiece(from) {
	return board[convertToIndex(from)];
}

// converts the square to array index: a1 -> index [56]
function convertToIndex(square) {
	const letter = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const index = (8 - square[1]) * 8 + letter.indexOf(square[0]);
	return index;
}

//Start
//Checks if move is possible
function checkMovePossible(piece, from, to) {
	if (typeof from === "string" && typeof to === "string") {
		from = convertToIndex(from);
		to = convertToIndex(to);
	}

	switch (piece) {
		//White pieces
		case "0r":
			return checkMoveWhiteRook(from, to);
		case "0n":
			return checkMoveWhiteKnight(from, to);
		case "0b":
			return checkMoveWhiteBishop(from, to);
		case "0k":
			return checkMoveWhiteKing(from, to);
		case "0q":
			return checkMoveWhiteQueen(from, to);
		case "0p":
			return checkMoveWhitePawn(from, to);
		//Black pieces
		case "1r":
			return checkMoveBlackRook(from, to);
		case "1n":
			return checkMoveBlackKnight(from, to);
		case "1b":
			return checkMoveBlackBishop(from, to);
		case "1k":
			return checkMoveBlackKing(from, to);
		case "1q":
			return checkMoveBlackQueen(from, to);
		case "1p":
			return checkMoveBlackPawn(from, to);
		default:
			return false;
	}
}
//End

//Start
//Check if move of a certain piece is valid

//White
function checkMoveWhitePawn(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if ((from - 9 === to || from - 7 === to) && board[to] !== "x" && checkForWhitePiece(to)) {
		return true;
	} else if (from - 8 === to && board[to] === "x") {
		return true;
	} else if (from - 16 === to && from > 47 && board[to] === "x" && board[to+8] === "x") {
		return true;
	} 
	return false;
}

function checkMoveWhiteKnight(from, to) {
	let move = Math.abs(from-to)
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if (!checkForWhitePiece(to)) {
		return false;
	} else if (move > 17) {
		return false;
	}
	if (move === 15) {
		return true;
	} else if (move === 6) {
		return true;
	} else if (move === 10) {
		return true;
	} else if (move === 17) {
		return true;
	}
	return false;
}

//		left19			right21
//	left26					right30
//				mid 36
//	left42					right 46
//		left51			right53


//			17			 15
//		10					6
//				mid 36
//	   -6				   -10
//		 -15			 -17

function checkMoveWhiteRook(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if (to % 8 === from % 8 && checkForWhitePiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	} else if (Math.floor(from/8) === Math.floor(to/8) && checkForWhitePiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	}
	return false
}

function checkMoveWhiteBishop(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	}
	if (!checkForWhitePiece(to)) {
		return false;
	} else if (document.getElementById(""+from).className.split(" ")[1] !== document.getElementById(""+to).className.split(" ")[1]) {
		return false;
	}
	else if ((from-to)%7 === 0) {
		return checkForPiecesOnRightDiagonal(from, to);
	} else if ((from-to)%9 === 0) {
		return checkForPiecesOnLeftDiagonal(from, to);
	} 
	return false;
}


function checkMoveWhiteKing(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if ((from-7 === to || from-8 === to || from-9 === to || from -1 === to) && checkForWhitePiece(to)) {
		return true;
	} else if ((from+7 === to || from+8 === to || from+9 === to || from +1 === to) && checkForWhitePiece(to)) {
		return true;
	} 
	return false;
}

function checkMoveWhiteQueen(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	}
	if (!checkForWhitePiece(to)) {
		return false;
	} else if ((from-to)%7 === 0) {
		return checkForPiecesOnRightDiagonal(from, to);
	} else if ((from-to)%9 === 0) {
		return checkForPiecesOnLeftDiagonal(from, to);
	} else if (to % 8 === from % 8 && checkForWhitePiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	} else if (Math.floor(from/8) === Math.floor(to/8) && checkForWhitePiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	}
	return false;
}

//Black
function checkMoveBlackPawn(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if ((from + 9 === to || from + 7 === to) && board[to] !== "x" && checkForBlackPiece(to)) {
		return true;
	} else if (from + 8 === to && checkForPiece(to)) {
		return true;
	} else if (from + 16 === to && from < 16 && checkForPiece(to) && board[to-8] === "x") {
		return true;
	} 
	return false;
}

function checkMoveBlackKnight(from, to) {
	let move = Math.abs(from-to)
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if (!checkForBlackPiece(to)) {
		return false;
	} else if (move > 17) {
		return false;
	}
	if (move === 15) {
		return true;
	} else if (move === 6) {
		return true;
	} else if (move === 10) {
		return true;
	} else if (move === 17) {
		return true;
	}
	return false;
}

function checkMoveBlackRook(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if (to % 8 === from % 8 && checkForBlackPiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	} else if (Math.floor(from/8) === Math.floor(to/8) && checkForBlackPiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	}
	return false;
}

function checkMoveBlackBishop(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	}
	if (!checkForBlackPiece(to)) {
		return false;
	} else if (document.getElementById(""+from).className.split(" ")[1] !== document.getElementById(""+to).className.split(" ")[1]) {
		return false;
	}
	else if ((from-to)%7 === 0) {
		return checkForPiecesOnRightDiagonal(from, to);
	} else if ((from-to)%9 === 0) {
		return checkForPiecesOnLeftDiagonal(from, to);
	} 	
	return false;
}

function checkMoveBlackKing(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	} else if ((from-7 === to || from-8 === to || from-9 === to || from -1 === to) && checkForBlackPiece(to)) {
		return true;
	} else if ((from+7 === to || from+8 === to || from+9 === to || from +1 === to) && checkForBlackPiece(to)) {
		return true;
	} 
	return false;
}

function checkMoveBlackQueen(from, to) {
	if (from < 0 || from > board.length) {
		return false;
	} else if (to < 0 || to > board.length) {
		return false;
	}
	console.log("begin")
	if (!checkForBlackPiece(to)) {
		return false;
	} else if ((from-to)%7 === 0) {
		return checkForPiecesOnRightDiagonal(from, to);
	} else if ((from-to)%9 === 0) {
		return checkForPiecesOnLeftDiagonal(from, to);
	} else if (to % 8 === from % 8 && checkForBlackPiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	} else if (Math.floor(from/8) === Math.floor(to/8) && checkForBlackPiece(to) && checkForPiecesOnRow(from, to)) {
		return true;
	}
	return false;
}

//Check if there is a piece at position
function checkForPiece(to) {
	if (board[to] !== "x") {
		return false;
	} else {
		return true;
	}
}
//Check if there is a white piece at white position
function checkForWhitePiece(to) {
	if (board[to][0] === "0") {
		return false;
	} else {
		return true;
	}
}
//Check if there is a black piece at white position
function checkForBlackPiece(to) {
	if (board[to][0] === "1") {
		return false;
	} else {
		return true;
	}
}
//Check for pieces on the right diagonal
function checkForPiecesOnRightDiagonal(from, to) {
	if (from-to > 0) {
		for (let i = from-7; i > to; i-=7) {
			if (!checkForPiece(i)) {
				return false;
			}
		}
		return true;
	} else if (from-to < 0) {
		for (let i = from+7; i < to; i+=7) {
			if (!checkForPiece(i)) {
				return false;
			}
		}
		return true;
	}
}

//Check for pieces on the left diagonal
function checkForPiecesOnLeftDiagonal(from, to) {
	if (from-to > 0) {
		for (let i = from-9; i > to; i-=9) {
			if (!checkForPiece(i)) {
				return false;
			}
		}
		return true;
	} else if (from-to < 0) {
		for (let i = from+9; i < to; i+=9) {
			if (!checkForPiece(i)) {
				return false;
			}
		}
		return true;
	}
}

//Check for pieces on the row or column
function checkForPiecesOnRow(from, to) {
	if (Math.floor(from/8) === Math.floor(to/8)) {
		if (from < to) {
			for (let i = from+1; i < to; i++) {
				console.log(!checkForPiece(i))
				if (!checkForPiece(i)) {
					return false;
				}
			}
			return true;
		} else {
			for (let i = to+1; i < from; i++) {
				console.log(!checkForPiece(i))
				if (!checkForPiece(i)) {
					return false;
				} 
			}
			return true;
		}
	} else {
		if (from < to) {
			for (let i = from+8; i < to; i+=8) {
				console.log(!checkForPiece(i))
				if (!checkForPiece(i)) {
					return false;
				}
			}
			return true;
		} else {
			for (let i = to+8; i < from; i+= 8) {
				console.log(!checkForPiece(i))
				if (!checkForPiece(i)) {
					return false;
				}
			}
			return true;
		}
	}
}

//End

// Start
//Drag Functions
let piece_selected;
let piece_selected_square;

function dragStartPiece() {
	piece_selected_square = parseInt(this.parentElement.id);
	piece_selected = board[piece_selected_square];
	this.style.opacity = "1";

	//console.log(piece_selected, piece_selected_square)
}

function dragOverSquare(event) {
	event.preventDefault();
}

function dragDropSquare() {
	if (piece_selected[0] === "0" && movesPlayed["0"] > movesPlayed["1"]) {
		return false;
	} else if (piece_selected[0] === "1" && movesPlayed["0"] === movesPlayed["1"]) {
		return false;
	}
	
	if ( checkMovePossible(piece_selected, piece_selected_square, parseInt(this.id)) ) {
		board[piece_selected_square] = "x";
		board[parseInt(this.id)] = piece_selected;
		updatePieces();
		movesPlayed[piece_selected[0]] += 1;
	} else {
		//console.log(piece_selected, piece_selected_square, parseInt(this.id));
		console.log( "invalid move", checkMovePossible(piece_selected, piece_selected_square, parseInt(this.id)))
	}
}
//End


// Adding letters to the bottom of the board
//Start
function addLetterToBoard() {
	let letter = ["a", "b", "c", "d", "e", "f", "g", "h"];
	let p;
	for (let i = 0; i < 8; i++) {
		p = document.createElement("p");
		p.className = "letter";
		document.getElementById("" + (i + 56)).appendChild(p);
		document.getElementById("" + (i + 56)).childNodes[1].innerHTML = letter[i];
	}
}
addLetterToBoard();
//End

// Adding numbers to the side of the board
//Start
function addNumberToBoard() {
	let p;
	for (let i = 56; i >= 0; i-=8) {
		p = document.createElement("p");
		p.className = "number";
		document.getElementById("" + i).appendChild(p);
		document.getElementById("" + i).lastChild.innerHTML = (56-i)/8+1;
	}
}
addNumberToBoard();
//End




// Game Start //
const movesPlayed = {"0":0,
					 "1":0}
updatePieces();



/*
Bug list:
	-queen can do illegal moves on diagonal
	-class of white and black squares cant be found


To do's:
	-Style the chess board
	-Dragging animation and sound
	-Desing moving pattern: Done = King, Pawn, Rook, bishop, knight
							Not done = Queen,
*/


