var level = 10;
var maxPieceLength = 10;
var squareSize = 50;
var pieces;
var squares = new Array();
var pieceData = new Array();
var freeSpaces = new Array();
var colours = new Array();
var baseLightColour = "CC";
var baseDarkColour = "66";
var snapAmount = 10;
var downPageX = 0;
var downPageY = 0;
var downOffsetX = 0;
var downOffsetY = 0;
var windowWidth = $(window).width();
var leftMargin = Math.floor((windowWidth - (squareSize * level))/ 2);
var topMargin = 40;
var movingPiece = null;

create_squares();
create_pieces();
create_colours();

/* Square class */
function Square(x, y, pieceID)
{
	this.x = x;
	this.y = y;
	this.pieceID = pieceID;
}

/* Colour class */
/* We are given the light and dark hex values and the order to add everything together */
function Colour(ldHex, order)
{
	var ldStatic = new Array(baseLightColour, baseDarkColour);
	var ldColour = new Array("#", "#");
	
	for (var i = 0; i < 2; i++)
	{
		/* TODO: Work out the combinations automatically */
		switch(order)
		{
			case 0:
			ldColour[i] += ldStatic[i] + ldHex[i] + "00";
			break;
			case 1:
			ldColour[i] += ldStatic[i] + "00" + ldHex[i];
			break;
			case 2:
			ldColour[i] += ldHex[i] + ldStatic[i] + "00";
			break;
			case 3:
			ldColour[i] += ldHex[i] + "00" + ldStatic[i];
			break;
			case 4:
			ldColour[i] += "00" + ldStatic[i] + ldHex[i];
			break;
			case 5:
			ldColour[i] += "00" + ldHex[i] + ldStatic[i];
			break;
		}
	}

	this.light = ldColour[0];
	this.dark = ldColour[1];
}

/* Creates all the beautiful colour combinations */
function create_colours()
{
	/* To get nice colours, for RGB, one is CC, one is 0 and one is evenly distributed between 0 and CC */
	/* The dark colour uses 66 instead of CC */
	
	/* It doesn't matter if we create too many colours, we just won't use them all */
	var colourDivison = Math.ceil(pieceData.length / 6);
	var lightInt = parseInt(baseLightColour, 16);
	var darkInt = parseInt(baseDarkColour, 16);
	
	for (var i = 1; i <= colourDivison; i++)
	{
		var lightHex = Math.floor(i / colourDivison * lightInt).toString(16);
		var darkHex = Math.floor(i / colourDivison * darkInt).toString(16);
		
		/* Creates the six combinations of these colours */
		for (var j = 0; j < 6; j++)
		{
			colours.push(new Colour(new Array(lightHex, darkHex), j));
		}
	}
}

/* Sets up the squares array */
function create_squares()
{
	for (var y = 0; y < level; y++)
	{
		for (var x = 0; x < level; x++)
		{
			squares.push(new Square(x, y, -1));
		}
	}
}

/* Randomly generates all the puzzle pieces for the board */
function create_pieces()
{
	/* Loop through all the squares on the board */
	
	for (var i = 0, li = squares.length; i < li; i++)
	{
		/* If the square is blank, then we want to create a new piece */
		if (squares[i].pieceID == -1)
		{
			new_piece(i);
			
			var pieceCount = (pieceData.length - 1)
			
			while (pieceData[pieceCount].length < maxPieceLength && freeSpaces[pieceCount].length > 0)
			{
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

function new_piece(squareID)
{
	pieceData.push(new Array());
	freeSpaces.push(new Array());
	
	new_segment(squareID);
}

function new_segment(squareID)
{
	/* Add the new segment to the piece */
	pieceData[pieceData.length - 1].push(squareID);
	squares[squareID].pieceID = (pieceData.length - 1);

	/* Adding possible free spaces to the current piece */
	if (direction(squareID, 0) != -1)
	{
		freeSpaces[pieceData.length - 1].push(direction(squareID, 0));
	}
	
	if (direction(squareID, 1) != -1)
	{
		freeSpaces[pieceData.length - 1].push(direction(squareID, 1));
	}
	
	if (direction(squareID, 2) != -1)
	{
		freeSpaces[pieceData.length - 1].push(direction(squareID, 2));
	}
	
	if (direction(squareID, 3) != -1)
	{
		freeSpaces[pieceData.length - 1].push(direction(squareID, 3));
	}	
}

/* Given a square and a direction, this returns the squareID that it goes to */
/* It returns -1 if the direction goes off the board, or the square is used by another piece */
function direction(squareID, direction)
{
	var returnSquareID = -1;

	/* North */
	if (direction == 0)
	{
		if (squareID > level)
		{
			returnSquareID = (squareID - level);
		}
	}
	/* East */
	else if (direction == 1)
	{
		if (((squareID + 1) % level) > 0)
		{
			returnSquareID = (squareID + 1);
		}
	}
	/* South */
	else if (direction == 2)
	{
		if (squareID < (level * (level - 1)))
		{
			returnSquareID = (squareID + level);
		}
	}
	/* West */
	else if (direction == 3)
	{
		if ((squareID % level) > 0)
		{
			returnSquareID = (squareID - 1);
		}
	}
	
	/* Check that the squareID isn't already used in another piece */
	if (returnSquareID != -1 && squares[returnSquareID].pieceID != -1)
	{
		returnSquareID = -1;
	}
	
	return returnSquareID;
}

function transform(piece, translateX, translateY)
{
	/* Works out how far to translate the piece */
	/*var translateX = piece.data('offsetX') + mouseMoveX; /* + (downOffsetX - piece.data('startX'));*/
	/*var translateY = piece.data('offsetY') + mouseMoveY; /* + (downOffsetY - piece.data('startY'));*/

	/* Works out how much to rotate the piece */
	var rotate = piece.data('rotation');
	var corX = piece.data('corX');
	var corY = piece.data('corY');
	
	/*$("#test1").html('DownOffset' + downOffsetX + ', ' + downOffsetY);
	$("#test2").html('DownPage ' + downPageX + ', ' + downPageY);
	$("#test3").html('Data Segment' + piece.data('segOffsetX') + ', ' + piece.data('segOffsetY'));
	$("#test4").html('Data Offset' + piece.data('offsetX') + ', ' + piece.data('offsetY'));
	$("#test5").html('Translate' + translateX + ', ' + translateY);*/
	
	var actualX = (translateX - piece.data('segOffsetX'));
	var actualY = (translateY - piece.data('segOffsetY'));
	
	/* Snapping - Sometimes jQuery is REALLY cool */
	var snappingSquare = $(".square")
		.filter(function() {
			return Math.abs($(this).attr('x') - actualX) < snapAmount
			&& Math.abs($(this).attr('y') - actualY) < snapAmount;
		}).first();
	
	if (snappingSquare.length > 0)
	{
		translateX = parseFloat(snappingSquare.attr('x')) + piece.data('segOffsetX');
		translateY = parseFloat(snappingSquare.attr('y')) + piece.data('segOffsetY');
		
		/*piece.removeAttr('filter');*/
		piece.children().each(function() {
			$(this).attr('rx', 0);
			$(this).attr('ry', 0);
		});
	}
	else
	{
		/*piece.attr('filter', 'url(#dropshadow)');*/
		piece.children().each(function() {
			$(this).attr('rx', 10);
			$(this).attr('ry', 10);
		});
	}
	
	/* Set bounds for the piece */
	if (actualX < 0)
	{
		translateX = piece.data('segOffsetX');
	}
	
	if (actualY < 0)
	{
		translateY = piece.data('segOffsetY');
	}
	
	piece.attr('transform', 'translate(' + translateX + ', ' + translateY + ') rotate(' + rotate + ', ' + corX + ', ' + corY + ')');
}
