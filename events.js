var level = 5;
var maxPieceLength = 4;
var squares = new Array();
var pieces = new Array();
var freeSpaces = new Array();
var colours = new Array();
var baseLightColour = "CC";
var baseDarkColour = "66";
var squareSize = 50;
var snapAmount = 10;
var downPageX = 0;
var downPageY = 0;
var downOffsetX = 0;
var downOffsetY = 0;
var leftMargin = 200;
var movingPiece = null;

create_squares();
create_pieces();
create_colours();

$(document).ready(function() {

	/* Stop the Right-click context menu from showing */
	$(document).bind("contextmenu",function(e){
		return false;
	});
	
	/* Initialize the piece */
	var pieceInit = $(".piece");
	pieceInit.attr('data-startX', pieceInit.offset().left);
	pieceInit.attr('data-startY', pieceInit.offset().top);
	pieceInit.attr('data-offsetX', 0);
	pieceInit.attr('data-offsetY', 0);
	
	/* Create a 2D array for all the squares on the board */
	/*for (var i = 0; i < level; i++)
	{
		squares[i] = new Array(level);
	}*/

	/*var test = "";
	
	for (var i = 0, li = pieces.length; i < li; i++)
	{
		test += "(";
		
		for (var j = 0, lj = pieces[i].length; j < lj; j++)
		{
			test += pieces[i][j] + ", ";
		}
		
		test += ") ";
	}
	
	$("#test1").html(test);
	*/
	
	/* Mouse down - Handles all the mouse clicks */
	$(".piece").mousedown(function(e) {
		
		var piece = $(this);
		
		/* Work out which mouse button was clicked */
		switch (e.which) {
			/* Left click for moving the piece */
			case 1:
				movingPiece = piece;
			
				downPageX = e.pageX;
				downPageY = e.pageY;
				
				downOffsetX = piece.offset().left;
				downOffsetY = piece.offset().top;
				break;
			case 2:
				alert('Middle mouse button pressed');
				break;
			/* Right click for rotating the piece */
			case 3:
				downOffsetX = piece.offset().left;
				downOffsetY = piece.offset().top;
				
				piece.attr('data-angle', (parseInt(piece.attr('data-angle')) + 45));
				transform(piece, 0, 0);
				
				/* We need to store the amount that the offset changed, so we can rotate around the correct point */
				var oldOffsetX = parseFloat(piece.attr('data-offsetX'));
				var oldOffsetY = parseFloat(piece.attr('data-offsetY'));
				
				piece.attr('data-offsetX', oldOffsetX + (downOffsetX - piece.offset().left));
				piece.attr('data-offsetY', oldOffsetY + (downOffsetY - piece.offset().top));
				
				break;
		}
		
		
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
	
	/* Mouse Up - Stops dragging the piece around */
	$(document).mouseup(function(e){
		movingPiece = null;
		
		/* Have to return false, else firefox treats it like dragging an image */
		return false;
	})

	/* Mouse Move - Drags the piece around */
	$(document).mousemove(function(e){
	
		if (movingPiece == null) return;
		
		transform(movingPiece, (e.pageX - downPageX), (e.pageY - downPageY));
		
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
});

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
	var colourDivison = Math.ceil(pieces.length / 6);
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
			
			var pieceCount = (pieces.length - 1)
			
			while (pieces[pieceCount].length < maxPieceLength && freeSpaces[pieceCount].length > 0)
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
	pieces.push(new Array());
	freeSpaces.push(new Array());
	
	new_segment(squareID);
}

function new_segment(squareID)
{
	/* Add the new segment to the piece */
	pieces[pieces.length - 1].push(squareID);
	squares[squareID].pieceID = (pieces.length - 1);

	/* Adding possible free spaces to the current piece */
	if (direction(squareID, 0) != -1)
	{
		freeSpaces[pieces.length - 1].push(direction(squareID, 0));
	}
	
	if (direction(squareID, 1) != -1)
	{
		freeSpaces[pieces.length - 1].push(direction(squareID, 1));
	}
	
	if (direction(squareID, 2) != -1)
	{
		freeSpaces[pieces.length - 1].push(direction(squareID, 2));
	}
	
	if (direction(squareID, 3) != -1)
	{
		freeSpaces[pieces.length - 1].push(direction(squareID, 3));
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

/* Squares on the board */
function square(x, y, id)
{
	return '<rect class="square" id="' + id + '" x=' + (x + 0.5) + ' y=' + (y + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '"/>';
}

/* One segment of the puzzle piece */
function segment(x, y, pieceID)
{
	return '<rect class="segment" fill="url(#colorGradient' + pieceID + ')" x = ' + (x + 0.5) + ' y = ' + (y + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '" rx = 10 ry = 10 />';
}

function transform(piece, mouseMoveX, mouseMoveY)
{
	/* Works out how far to translate the piece */
	var translateX = ((downOffsetX + parseFloat(piece.attr('data-offsetX'))) - piece.attr('data-startX')) + mouseMoveX;
	var translateY = ((downOffsetY + parseFloat(piece.attr('data-offsetY'))) - piece.attr('data-startY')) + mouseMoveY;
	
	/* Works out how much to rotate the piece */
	var rotate = piece.attr('data-angle');
	
	/*$("#test1").html(downOffsetX + ', ' + downOffsetY);*/
	/*$("#test2").html(piece.attr('data-startX') + ', ' + piece.attr('data-startY'));*/
	/*$("#test3").html(mouseMoveX + ', ' + mouseMoveY);
	$("#test4").html(downPageX + ', ' + downPageY);
	$("#test5").html(translateX + ', ' + translateY);*/
	
	/* Snapping - Sometimes jQuery is REALLY cool */
	var snappingSquare = $(".square")
		.filter(function () {
			return Math.abs($(this).attr('x') - translateX) < snapAmount
			&& Math.abs($(this).attr('y') - translateY) < snapAmount;
		}).first();
	
	if (snappingSquare.length > 0)
	{
		translateX = snappingSquare.attr('x');
		translateY = snappingSquare.attr('y')
	}
	
	/* Set bounds for the piece */
	if (translateX < 0)
	{
		translateX = 0;
	}
	
	if (translateY < 0)
	{
		translateY = 0;
	}
	
	piece.attr('transform', 'translate(' + translateX + ', ' + translateY + ') rotate(' + rotate + ', ' + (squareSize / 2) + ', ' + (squareSize / 2) + ')');
}