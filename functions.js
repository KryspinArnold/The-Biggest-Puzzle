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

	squares = new Array();

	for (var y = 0; y < level; y++)
	{
		for (var x = 0; x < level; x++)
		{
			squares.push(new Square(x, y, -1));
		}
	}
}

/* Randomly generates all the puzzle pieces for the board */
function create_pieces() {

	pieceData = new Array();
	freeSpaces = new Array();
	
	/* Loop through all the squares on the board */
	for (var i = 0, li = squares.length; i < li; i++) {
	
		/* If the square is blank, then we want to create a new piece */
		if (squares[i].pieceID == -1) {
		
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
	squares[squareID].pieceID = (pieceData.length - 1);

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
	if (returnSquareID != -1 && squares[returnSquareID].pieceID != -1) {
		returnSquareID = -1;
	}
	
	return returnSquareID;
}

function transform(piece, translateX, translateY) {

	/* Works out how much to rotate the piece */
	var rotate = piece.data('rotation');
	var corX = piece.data('corX');
	var corY = piece.data('corY');
	
	/* Snapping */
	var snapped = true;
	var snapSquares = $(".square");
	
	var actualX = (translateX - piece.data('segOffsetX'));
	var actualY = (translateY - piece.data('segOffsetY'));
	
	/* Check each segment is snapped to a square */
	piece.children().each(function() {
	
		var segment = $(this);
	
		var segmentSnapped = snapSquares.filter(function() {
			return Math.abs($(this).attr('x') - (segment.offset().left - piece.data('startX'))) < snapAmount
				&& Math.abs($(this).attr('y') - (segment.offset().top - piece.data('startY'))) < snapAmount;
		}).first();
	
		if (segmentSnapped.length == 0) {
			snapped = false;
			return;
		}
	});
	
	/* Each segment has snapped */
	if (snapped) {
	
		/* Get the square that the piece is snapped to */
		var pieceSnapped = snapSquares.filter(function() {
				return Math.abs($(this).attr('x') - actualX) < snapAmount
					&& Math.abs($(this).attr('y') - actualY) < snapAmount;
			}).first();
	
		if (pieceSnapped.length > 0) {
	
			translateX = parseFloat(pieceSnapped.attr('x')) + piece.data('segOffsetX');
			translateY = parseFloat(pieceSnapped.attr('y')) + piece.data('segOffsetY');
		
			piece.children().each(function() {
				$(this).attr('rx', 0);
				$(this).attr('ry', 0);
			});
			
		} else {
	
			piece.children().each(function() {
				$(this).attr('rx', 10);
				$(this).attr('ry', 10);
			});
		}
	}
	
	/* Set bounds for the piece */
	if (actualX < 0) {
		translateX = piece.data('segOffsetX');
	}
	
	if (actualY < 0) {
		translateY = piece.data('segOffsetY');
	}
	
	/* Finally do the transformation */
	piece.attr('transform', 'translate(' + translateX + ', ' + translateY + ') rotate(' + rotate + ', ' + corX + ', ' + corY + ')');
}

/* Checks if the puzzle has been solved by matching the xy positions of the squares to the piece segments */
function puzzle_solved() {

	var puzzleSolved = true;
	var solvedSquares = $(".square");
	var solvedSegments = $(".segment");
	
	/* Each square needs a segment on it */
	solvedSquares.each(function() {
	
		var square = $(this);
		
		var segmentMatch = solvedSegments.filter(function() {
			var piece = $(this).parent();
			
			return Math.abs(square.attr('x') - ($(this).offset().left - piece.data('startX'))) < snapAmount
				&& Math.abs(square.attr('y') - ($(this).offset().top - piece.data('startY'))) < snapAmount;

		}).first();
		
		if (segmentMatch.length == 0) {
			puzzleSolved = false;
			return;
		}
	});

	return puzzleSolved;
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
}