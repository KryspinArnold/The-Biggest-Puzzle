/* Creates all the beautiful colour combinations */
function create_colours() {

	/* To get nice colours, for RGB, one is CC, one is 0 and one is evenly distributed between 0 and CC */
	/* The dark colour uses 66 instead of CC */
	
	colours = new Array();
	
	/* It doesn't matter if we create too many colours, we just won't use them all */
	var colourDivison = Math.ceil(pieceData.length / 6);
	var lightInt = parseInt(baseLightColour, 16);
	var darkInt = parseInt(baseDarkColour, 16);
	
	for (var i = 1; i <= colourDivison; i++) {
	
		var lightHex = Math.floor(i / colourDivison * lightInt).toString(16);
		var darkHex = Math.floor(i / colourDivison * darkInt).toString(16);
		
		/* Creates the six combinations of these colours */
		for (var j = 0; j < 6; j++) {
			colours.push(new Colour(new Array(lightHex, darkHex), j));
		}
	}
}

/* Sets up the squares array */
function create_squares() {

	squareData = new Array();

	for (var y = 0; y < level; y++)
	{
		for (var x = 0; x < level; x++)
		{
			squareData.push(new Square(x, y, -1));
		}
	}
}

/* Randomly generates all the puzzle pieces for the board */
function create_pieces() {

	pieceData = new Array();
	freeSpaces = new Array();
	
	/* Loop through all the squares on the board */
	for (var i = 0, li = squareData.length; i < li; i++) {
	
		/* If the square is blank, then we want to create a new piece */
		if (squareData[i].pieceID == -1) {
		
			new_piece(i);
			
			var pieceCount = (pieceData.length - 1)
			
			while (pieceData[pieceCount].length < maxPieceLength && freeSpaces[pieceCount].length > 0) {
				/* Get a random free space from around the current piece */
				var randomIndex = Math.floor(Math.random() * freeSpaces[pieceCount].length);
				var randomSquareID = freeSpaces[pieceCount][randomIndex];
				
				/* Remove the free space */
				freeSpaces[pieceCount].splice(randomIndex, 1);
				
				/* Add the new seqment */
				new_segment(randomSquareID);
			}
		}
	}
}

function new_piece(squareID) {

	pieceData.push(new Array());
	freeSpaces.push(new Array());
	
	new_segment(squareID);
}

function new_segment(squareID) {

	/* Add the new segment to the piece */
	pieceData[pieceData.length - 1].push(squareID);
	squareData[squareID].pieceID = (pieceData.length - 1);

	/* Adding possible free spaces to the current piece */
	if (direction(squareID, 0) != -1) {
		freeSpaces[pieceData.length - 1].push(direction(squareID, 0));
	}
	
	if (direction(squareID, 1) != -1) {
		freeSpaces[pieceData.length - 1].push(direction(squareID, 1));
	}
	
	if (direction(squareID, 2) != -1) {
		freeSpaces[pieceData.length - 1].push(direction(squareID, 2));
	}
	
	if (direction(squareID, 3) != -1) {
		freeSpaces[pieceData.length - 1].push(direction(squareID, 3));
	}	
}

/* Given a square and a direction, this returns the squareID that it goes to */
/* It returns -1 if the direction goes off the board, or the square is used by another piece */
function direction(squareID, direction) {

	var returnSquareID = -1;

	/* North */
	if (direction == 0)	{
		
		if (squareID > level) {
			returnSquareID = (squareID - level);
		}
	}
	/* East */
	else if (direction == 1) {
	
		if (((squareID + 1) % level) > 0) {
			returnSquareID = (squareID + 1);
		}
	}
	/* South */
	else if (direction == 2) {
	
		if (squareID < (level * (level - 1))) {
			returnSquareID = (squareID + level);
		}
	}
	/* West */
	else if (direction == 3) {
	
		if ((squareID % level) > 0) {
			returnSquareID = (squareID - 1);
		}
	}
	
	/* Check that the squareID isn't already used in another piece */
	if (returnSquareID != -1 && squareData[returnSquareID].pieceID != -1) {
		returnSquareID = -1;
	}
	
	return returnSquareID;
}

function transform(piece, translateXY) {

	/* Works out how much to rotate the piece */
	var rotate = piece.data('rotation');
	var corX = piece.data('corX');
	var corY = piece.data('corY');
	
	/* Snapping */
	/* We are storing all the snapping data in the squarePieceID array, so that it is faster to access */
	var snapped = true;
	var snapSquares = $(".square"); /* All the squares on the board */
	var snapSquareIDs = new Array(); /* An array of squareIDs that are snapped to */
	var pieceID = piece.data('pieceID');
	
	var actualX = (translateXY.x - piece.data('segOffsetX'));
	var actualY = (translateXY.y - piece.data('segOffsetY'));
	
	/* Check each segment is snapped to a square */
	for (var seg = 0, lseg = segmentXY.length; seg < lseg; seg++) {
	
		var squareID = -1;
		
		for (var sq = 0, lsq = squareXY.length; sq < lsq; sq++)	{
		
			if (Math.abs(squareXY[sq].x - ((segmentXY[seg].x + piece.offset().left) - piece.data('startX'))) < snapAmount
				&& Math.abs(squareXY[sq].y - ((segmentXY[seg].y + piece.offset().top) - piece.data('startY'))) < snapAmount)
			{
				squareID = sq;
				break;
			}
		}

		/* Cancel the snap if a square doesn't exist or the square is not empty */
		if (squareID == -1 || (board[squareID] != pieceID && board[squareID] != -1)) {
			snapped = false;
			break;
		} else {
			snapSquareIDs.push(squareID);
		}
	}
	
	/* Each segment has snapped to a square */
	if (snapped) {
	
		var squareID = -1;
	
		for (var sq = 0, lsq = squareXY.length; sq < lsq; sq++)	{
		
			if (Math.abs(squareXY[sq].x - actualX) < snapAmount
				&& Math.abs(squareXY[sq].y - actualY) < snapAmount)
			{
				squareID = sq;
				break;
			}
		}
	
		if (squareID != -1) {
	
			translateXY.x = parseFloat(squareXY[squareID].x) + piece.data('segOffsetX');
			translateXY.y = parseFloat(squareXY[squareID].y) + piece.data('segOffsetY');
		
			piece.children().each(function() {
				$(this).attr('rx', 0);
				$(this).attr('ry', 0);
			});
			
			/* Add all the squares that we snapped to, to the squarePieceID array */
			for (var i = 0, li = snapSquareIDs.length; i < li; i++)
			{
				board[snapSquareIDs[i]] = pieceID;
			}
			
			piece.data('solved', true);
		}
	} else {
	
		piece.children().each(function() {
			$(this).attr('rx', 10);
			$(this).attr('ry', 10);
		});
		
		/* Remove any reference from this piece from the board array */
		for (var j = 0, lj = board.length; j < lj; j++) {
		
			if (board[j] == pieceID) {
				board[j] = -1;
			}
		}
	}
	
	/* Set bounds for the piece */
	if (actualX < 0) {
		translateXY.x = piece.data('segOffsetX');
	}
	
	if (actualY < 0) {
		translateXY.y = piece.data('segOffsetY');
	}
	
	/* Finally do the transformation */
	piece.attr('transform', 'translate(' + translateXY.x + ', ' + translateXY.y + ') rotate(' + rotate + ', ' + corX + ', ' + corY + ')');
}

/* Checks if the puzzle has been solved by matching the xy positions of the squares to the piece segments */
function puzzle_solved() {

	/* jQuery returns -1 if the element is not found */
	/* So in our case if -1 is not in board then it returns -1 :) */

	return (jQuery.inArray(-1, board) == -1);
}

function restart_game() {

		var newLevel = parseInt($("#input_level").val());
		var newPieceLength = parseInt($("#input_piece_length").val());
		
		if (newLevel >= 4 && newLevel <= 20)
		{
			$("#input_level").val(newLevel);
			level = newLevel;
		}
		
		if (newPieceLength >= 3 && newPieceLength <= (level * level))
		{
			$("#input_piece_length").val(newPieceLength);
			maxPieceLength = newPieceLength;
		}
		
		initialize();
		add_mouse_events();

}

function create_segmentXY(piece) {

	segmentXY = new Array();
	/* Add all the piece points into an array */
	piece.children().each(function() {
		var segment = $(this);
		segmentXY.push(new XY(segment.offset().left - piece.offset().left, segment.offset().top - piece.offset().top));
	});
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
}